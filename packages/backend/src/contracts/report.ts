export interface ReportInputContract {
  as_of: string;
  include_sections: Array<'regime' | 'changes' | 'invalidations' | 'calendar' | 'headlines' | 'quality'>;
  horizon: '24h' | '7d';
}

export interface ReportProvenance {
  run_id: string;
  snapshot_id: string;
  code_sha: string;
  generated_at: string;
}

export interface ReportOutput {
  template_version: 'v1';
  title: string;
  as_of: string;
  summary: {
    regime: string;
    confidence: string;
    key_message: string;
  };
  sections: {
    regime?: any;
    changes?: any[];
    invalidations?: any[];
    calendar?: any[];
    headlines?: any[];
    quality?: any;
  };
  provenance: ReportProvenance;
}
