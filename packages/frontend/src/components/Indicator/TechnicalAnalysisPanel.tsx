import React, { useState } from 'react';
import { runTechnicalAnalysis, AnalysisParams, TechnicalAnalysisResult } from '@/api/mlService';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type AnalysisType = 'SMA_CROSSOVER' | 'RSI' | 'MACD';

interface TechnicalAnalysisPanelProps {
  seriesId: string;
  dataSourceType: 'fred' | 'crypto';
  onAnalysisComplete: (results: TechnicalAnalysisResult | null) => void;
  onAnalysisStart: () => void;
  onAnalysisClear: () => void;
}

const TechnicalAnalysisPanel: React.FC<TechnicalAnalysisPanelProps> = ({
  seriesId,
  dataSourceType,
  onAnalysisComplete,
  onAnalysisStart,
  onAnalysisClear
}) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisType | ''>('');
  const [params, setParams] = useState<AnalysisParams>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisTypeChange = (value: string) => {
    setSelectedAnalysis(value as AnalysisType | '');
    setParams({});
    setError(null);
    onAnalysisClear();
  };

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value ? parseInt(value, 10) : undefined }));
  };

  const handleSubmit = async () => {
    if (!selectedAnalysis || !seriesId) return;
    setIsLoading(true);
    setError(null);
    onAnalysisStart();
    try {
      const results = await runTechnicalAnalysis(seriesId, dataSourceType, selectedAnalysis, params);
      onAnalysisComplete(results);
    } catch (err: any) {
      setError(err.message || 'Analysis failed.');
      onAnalysisComplete(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClear = () => {
    setSelectedAnalysis('');
    setParams({});
    setError(null);
    onAnalysisClear();
  }

  const renderParamFields = () => {
    switch (selectedAnalysis) {
      case 'SMA_CROSSOVER':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shortPeriod" className="text-xs">Short Period (e.g., 50)</Label>
                <Input type="number" id="shortPeriod" name="shortPeriod" placeholder="50" value={params.shortPeriod || ''} onChange={handleParamChange} />
              </div>
              <div>
                <Label htmlFor="longPeriod" className="text-xs">Long Period (e.g., 200)</Label>
                <Input type="number" id="longPeriod" name="longPeriod" placeholder="200" value={params.longPeriod || ''} onChange={handleParamChange} />
              </div>
            </div>
          </>
        );
      case 'RSI':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="period" className="text-xs">Period (e.g., 14)</Label>
              <Input type="number" id="period" name="period" placeholder="14" value={params.period || ''} onChange={handleParamChange} />
            </div>
            <div>
              <Label htmlFor="overbought" className="text-xs">Overbought (e.g., 70)</Label>
              <Input type="number" id="overbought" name="overbought" placeholder="70" value={params.overbought || ''} onChange={handleParamChange} />
            </div>
            <div>
              <Label htmlFor="oversold" className="text-xs">Oversold (e.g., 30)</Label>
              <Input type="number" id="oversold" name="oversold" placeholder="30" value={params.oversold || ''} onChange={handleParamChange} />
            </div>
          </div>
        );
      case 'MACD':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fastPeriod" className="text-xs">Fast (e.g., 12)</Label>
              <Input type="number" id="fastPeriod" name="fastPeriod" placeholder="12" value={params.fastPeriod || ''} onChange={handleParamChange} />
            </div>
            <div>
              <Label htmlFor="slowPeriod" className="text-xs">Slow (e.g., 26)</Label>
              <Input type="number" id="slowPeriod" name="slowPeriod" placeholder="26" value={params.slowPeriod || ''} onChange={handleParamChange} />
            </div>
            <div>
              <Label htmlFor="signalPeriod" className="text-xs">Signal (e.g., 9)</Label>
              <Input type="number" id="signalPeriod" name="signalPeriod" placeholder="9" value={params.signalPeriod || ''} onChange={handleParamChange} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center text-xl text-primary"><BarChart2 className="mr-2 h-5 w-5"/>Technical Analysis Lab</CardTitle>
        <CardDescription>Select an indicator and parameters to run analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="analysisType">Analysis Type</Label>
          <Select value={selectedAnalysis} onValueChange={handleAnalysisTypeChange}>
            <SelectTrigger id="analysisType">
              <SelectValue placeholder="Select Analysis..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SMA_CROSSOVER">SMA Crossover</SelectItem>
              <SelectItem value="RSI">RSI (Relative Strength Index)</SelectItem>
              <SelectItem value="MACD">MACD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedAnalysis && (
          <div className="p-4 border rounded-md bg-muted/30 space-y-3">
            <h4 className="text-sm font-medium text-foreground">Parameters for {selectedAnalysis.replace('_', ' ')}</h4>
            {renderParamFields()}
          </div>
        )}

        {error && (
          <div className="my-2 p-3 bg-destructive/15 text-destructive rounded-md text-sm flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" /> {error}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
         {(selectedAnalysis || error) && (
            <Button variant="outline" onClick={handleClear} disabled={isLoading}>Clear</Button>
         )}
        <Button onClick={handleSubmit} disabled={!selectedAnalysis || isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Run Analysis
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TechnicalAnalysisPanel;
