import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';
import { Download, Loader2, AlertCircle } from 'lucide-react';

const ReportViewer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);
    setReportUrl(null);
    try {
      const response = await axios.post('/api/report/generate', {}, {
        responseType: 'blob',
      });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      link.setAttribute('download', `mktdash_daily_summary_${timestamp}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Failed to generate or download report:", err);
      const errorData = err.response?.data;
      if (errorData instanceof Blob && errorData.type === "application/json") {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const jsonError = JSON.parse(reader.result as string);
            setError(jsonError.message || jsonError.error || 'Failed to generate report.');
          } catch {
            setError('Failed to generate report and parse error response.');
          }
        };
        reader.readAsText(errorData);
      } else {
        setError(err.message || 'An unknown error occurred while generating the report.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow p-4 h-96 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Daily Report</h2>
        <Button onClick={handleGenerateReport} disabled={isLoading} size="sm">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Generate & Download
        </Button>
      </div>
      {error && (
        <div className="my-2 p-3 bg-destructive/15 text-destructive rounded-md text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}
      <div className="flex-grow bg-muted/50 flex items-center justify-center rounded border border-dashed border-border mt-2">
        {reportUrl ? (
          <iframe src={reportUrl} title="Daily Report" width="100%" height="100%" />
        ) : (
          <p className="text-muted-foreground text-center">
            Click "Generate & Download" to create the latest daily summary.<br />
            The PDF will download automatically.
          </p>
        )}
      </div>
      <div className="mt-4 flex justify-end space-x-2 text-xs text-muted-foreground">
        <span>[PDF generation and download functionality]</span>
      </div>
    </div>
  );
};

export default ReportViewer;