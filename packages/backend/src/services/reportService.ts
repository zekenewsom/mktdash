import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fetchIntelligenceOverview } from './intelligenceService';
import { fetchEconomicCalendar } from './calendarService';
import { fetchHeadlineIntelligence } from './headlineService';
import { fetchMacroData } from './fredService';
import { ReportInputContract, ReportOutput } from '../contracts/report';

function shortHash(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 12);
}

function makeProvenance(snapshotSeed: string) {
  const generated_at = new Date().toISOString();
  const run_id = `run_${Date.now().toString(36)}`;
  const snapshot_id = `snap_${shortHash(snapshotSeed)}`;
  const code_sha = process.env.RENDER_GIT_COMMIT || process.env.COMMIT_SHA || 'local-dev';
  return { run_id, snapshot_id, code_sha, generated_at };
}

function saveReportToJson(report: ReportOutput) {
  try {
    const reportsDir = path.resolve(process.cwd(), 'reports');
    fs.mkdirSync(reportsDir, { recursive: true });
    
    const date = new Date().toISOString().split('T')[0];
    const filename = `report_${date}_${report.provenance.run_id}.json`;
    const filepath = path.join(reportsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`Report saved to: ${filepath}`);
    return filepath;
  } catch (err) {
    console.error('Failed to save report:', err);
    return null;
  }
}

export async function generateDeterministicReport(input?: Partial<ReportInputContract>): Promise<ReportOutput> {
  const as_of = input?.as_of || new Date().toISOString();
  const include_sections = input?.include_sections || ['regime', 'changes', 'invalidations', 'calendar', 'headlines', 'quality'];

  const [intel, calendar, headlines, macro] = await Promise.all([
    fetchIntelligenceOverview(),
    fetchEconomicCalendar(),
    fetchHeadlineIntelligence(),
    fetchMacroData(['FEDFUNDS', 'CPIAUCSL', 'UNRATE']),
  ]);

  const snapshotSeed = JSON.stringify({ intel: intel.data, calendar: calendar.data, headlines: headlines.data, macro: macro.data, as_of });
  const provenance = makeProvenance(snapshotSeed);

  const summary = {
    regime: intel.data.regime.state,
    confidence: intel.data.regime.confidence,
    key_message: `${intel.data.regime.state} regime with ${intel.data.quality.stale_count} stale signals and ${intel.data.quality.fallback_used ? 'fallback active' : 'no fallback usage'}`,
  };

  const report: ReportOutput = {
    template_version: 'v1',
    title: 'mktdash Daily Intelligence Report',
    as_of,
    summary,
    sections: {
      ...(include_sections.includes('regime') ? { regime: intel.data.regime } : {}),
      ...(include_sections.includes('changes') ? { changes: intel.data.changes } : {}),
      ...(include_sections.includes('invalidations') ? { invalidations: intel.data.invalidations } : {}),
      ...(include_sections.includes('calendar') ? { calendar: calendar.data } : {}),
      ...(include_sections.includes('headlines') ? { headlines: headlines.data } : {}),
      ...(include_sections.includes('quality') ? { quality: intel.data.quality } : {}),
    },
    provenance,
  };

  // Save report as JSON
  saveReportToJson(report);

  return report;
}
