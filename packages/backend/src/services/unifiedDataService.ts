/**
 * Unified Data Service - Aggregates all data sources
 * Phase 2 & 3 implementation
 */

import { fetchRBAData } from './rbaService';
import { fetchBCBData } from './bcbService';
import { fetchEurostatData } from './eurostatService';
import { fetchStatsNZData } from './statsNzService';
import { fetchYFinanceData } from './yfinanceService';
import { fetchPMIData } from './pmiService';
import { fetchMacroData } from './fredService';

export interface UnifiedDataRequest {
  fred?: string[];
  rba?: string[];
  bcb?: string[];
  eurostat?: string[];
  statsnz?: string[];
  yfinance?: string[];
  pmi?: string[];
}

export interface UnifiedDataResponse {
  fred?: Record<string, any>;
  rba?: Record<string, any>;
  bcb?: Record<string, any>;
  eurostat?: Record<string, any>;
  statsnz?: Record<string, any>;
  yfinance?: Record<string, any>;
  pmi?: Record<string, any>;
  errors?: string[];
}

export async function fetchUnifiedData(request: UnifiedDataRequest): Promise<UnifiedDataResponse> {
  const response: UnifiedDataResponse = {};
  const errors: string[] = [];

  // Run all fetches in parallel
  const promises: Promise<void>[] = [];

  if (request.fred && request.fred.length > 0) {
    promises.push(
      fetchMacroData(request.fred).then(result => {
        response.fred = result.data;
        if (result.error) errors.push(`FRED: ${result.error}`);
      })
    );
  }

  if (request.rba && request.rba.length > 0) {
    promises.push(
      fetchRBAData(request.rba).then(result => {
        response.rba = result.data;
        if (result.error) errors.push(`RBA: ${result.error}`);
      })
    );
  }

  if (request.bcb && request.bcb.length > 0) {
    promises.push(
      fetchBCBData(request.bcb).then(result => {
        response.bcb = result.data;
        if (result.error) errors.push(`BCB: ${result.error}`);
      })
    );
  }

  if (request.eurostat && request.eurostat.length > 0) {
    promises.push(
      fetchEurostatData(request.eurostat).then(result => {
        response.eurostat = result.data;
        if (result.error) errors.push(`Eurostat: ${result.error}`);
      })
    );
  }

  if (request.statsnz && request.statsnz.length > 0) {
    promises.push(
      fetchStatsNZData(request.statsnz).then(result => {
        response.statsnz = result.data;
        if (result.error) errors.push(`Stats NZ: ${result.error}`);
      })
    );
  }

  if (request.yfinance && request.yfinance.length > 0) {
    promises.push(
      fetchYFinanceData(request.yfinance).then(result => {
        response.yfinance = result.data;
        if (result.error) errors.push(`YFinance: ${result.error}`);
      })
    );
  }

  if (request.pmi && request.pmi.length > 0) {
    promises.push(
      fetchPMIData(request.pmi).then(result => {
        response.pmi = result.data;
        if (result.error) errors.push(`PMI: ${result.error}`);
      })
    );
  }

  await Promise.all(promises);

  if (errors.length > 0) {
    response.errors = errors;
  }

  return response;
}

// Export individual services for direct access
export {
  fetchRBAData,
  fetchBCBData,
  fetchEurostatData,
  fetchStatsNZData,
  fetchYFinanceData,
  fetchPMIData,
  fetchMacroData,
};
