import { CalendarEvent } from '../services/calendarService';
import { IntelligenceOverview } from '../contracts/intelligence';

export function isIsoDateLike(value: unknown) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

export function validateIntelligenceOverview(payload: any): payload is IntelligenceOverview {
  if (!payload || typeof payload !== 'object') return false;
  if (!payload.regime || !payload.quality || !Array.isArray(payload.changes) || !Array.isArray(payload.invalidations)) return false;

  const regime = payload.regime;
  if (!['risk_on', 'neutral', 'risk_off'].includes(regime.state)) return false;
  if (typeof regime.score !== 'number') return false;
  if (!['high', 'medium', 'low'].includes(regime.confidence)) return false;
  if (!regime.quality || !isIsoDateLike(regime.quality.as_of)) return false;
  if (!Array.isArray(regime.drivers)) return false;

  const quality = payload.quality;
  if (!isIsoDateLike(quality.as_of)) return false;
  if (!['high', 'medium', 'low'].includes(quality.confidence)) return false;
  if (typeof quality.fallback_used !== 'boolean') return false;
  if (typeof quality.stale_used !== 'boolean') return false;
  if (typeof quality.stale_count !== 'number') return false;
  if (!Array.isArray(quality.sources)) return false;

  for (const inv of payload.invalidations) {
    if (!inv?.id || !inv?.label || !inv?.metric || !inv?.threshold) return false;
    if (!['safe', 'near', 'triggered'].includes(inv.status)) return false;
  }

  return true;
}

export function validateCalendarEvents(payload: any): payload is CalendarEvent[] {
  if (!Array.isArray(payload)) return false;
  return payload.every((evt) => {
    if (!evt || typeof evt !== 'object') return false;
    return (
      typeof evt.id === 'string' &&
      typeof evt.title === 'string' &&
      typeof evt.country === 'string' &&
      ['high', 'medium', 'low'].includes(evt.impact) &&
      isIsoDateLike(evt.scheduled_at) &&
      typeof evt.category === 'string' &&
      typeof evt.source === 'string'
    );
  });
}

export function validateDataQualityPayload(payload: any) {
  if (!payload || typeof payload !== 'object') return false;
  if (!payload.totals || !Array.isArray(payload.records)) return false;
  if (typeof payload.totals.metrics !== 'number') return false;
  if (typeof payload.totals.stale_count !== 'number') return false;
  if (typeof payload.totals.fallback_count !== 'number') return false;

  return payload.records.every((r: any) => {
    if (!r || typeof r !== 'object') return false;
    return (
      typeof r.symbol === 'string' &&
      typeof r.source === 'string' &&
      (r.as_of === null || isIsoDateLike(r.as_of)) &&
      (r.age_mins === null || typeof r.age_mins === 'number') &&
      typeof r.stale === 'boolean' &&
      typeof r.fallback === 'boolean'
    );
  });
}
