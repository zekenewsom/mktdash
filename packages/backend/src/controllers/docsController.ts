import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { sendError } from '../lib/apiResponse';

export const getOpenApiSpec = async (_req: Request, res: Response) => {
  try {
    const specPath = path.resolve(process.cwd(), 'openapi.yaml');
    const content = fs.readFileSync(specPath, 'utf8');
    res.setHeader('Content-Type', 'application/yaml; charset=utf-8');
    return res.status(200).send(content);
  } catch (err: any) {
    return sendError(res, 'INTERNAL_ERROR', err.message || 'Unable to load OpenAPI spec', 500);
  }
};
