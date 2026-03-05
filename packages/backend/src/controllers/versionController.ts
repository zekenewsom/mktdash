import { Request, Response } from 'express';
import { sendSuccess } from '../lib/apiResponse';

export const getVersion = (_req: Request, res: Response) => {
  const commit = process.env.RENDER_GIT_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || 'unknown';
  const branch = process.env.RENDER_GIT_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || 'unknown';
  const service = process.env.RENDER_SERVICE_NAME || 'backend';
  return sendSuccess(res, {
    service,
    commit,
    branch,
    node: process.version,
    env: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  });
};
