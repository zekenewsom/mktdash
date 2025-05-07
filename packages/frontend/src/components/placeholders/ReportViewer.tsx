import React from 'react';

// Placeholder component for viewing generated daily reports
const ReportViewer: React.FC = () => {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow p-4 h-96 flex flex-col">
      <h2 className="text-xl font-semibold mb-2">Daily Report</h2>
      <div className="flex-grow bg-muted flex items-center justify-center rounded">
        <p className="text-muted-foreground">[Placeholder for PDF Report Viewer]</p>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
         <button className="text-sm text-muted-foreground hover:text-foreground border border-border rounded px-3 py-1">View Latest</button>
         <button className="text-sm text-muted-foreground hover:text-foreground border border-border rounded px-3 py-1">Download PDF</button>
      </div>
    </div>
  );
};

export default ReportViewer;