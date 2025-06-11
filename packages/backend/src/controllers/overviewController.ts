import { Request, Response } from 'express';
import { getHomeSnapshotData } from '../services/overviewService';

export const getHomeSnapshot = async (req: Request, res: Response) => {
  try {
    const result = await getHomeSnapshotData();
    if (result.error || !result.data) {
      return res.status(500).json({ error: result.error || 'Failed to retrieve snapshot data', data: null });
    }
    return res.status(200).json(result.data);
  } catch (error: any) {
    console.error('Controller error for getHomeSnapshot:', error);
    return res.status(500).json({ error: error.message || 'Unknown server error', data: null });
  }
};
