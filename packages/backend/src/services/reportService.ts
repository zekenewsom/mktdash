import puppeteer from 'puppeteer';
console.log('[reportService.ts] Loaded');
import fs from 'fs/promises';
import path from 'path';
import { getSeriesDetails } from './marketDataService';

const reportsDir = path.join(__dirname, '..', '..', 'reports');

async function ensureReportsDirExists() {
  try {
    await fs.access(reportsDir);
  } catch (error) {
    await fs.mkdir(reportsDir, { recursive: true });
  }
}
ensureReportsDirExists();

function getReportHTML(reportData: any): string {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  let indicatorsHTML = '';
  if (reportData.sp500) {
    indicatorsHTML += `
      <div class="indicator">
        <h2>${reportData.sp500.seriesInfo?.title || 'S&P 500'}: 
          <span>${reportData.sp500.currentValue?.value?.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
        </h2>
        <p>Date: ${reportData.sp500.currentValue?.date}</p>
      </div>
    `;
  }
  if (reportData.fedfunds) {
    indicatorsHTML += `
      <div class="indicator">
        <h2>${reportData.fedfunds.seriesInfo?.title || 'Federal Funds Rate'}: 
          <span>${reportData.fedfunds.currentValue?.value?.toFixed(2)}%</span>
        </h2>
        <p>Date: ${reportData.fedfunds.currentValue?.date}</p>
      </div>
    `;
  }
  if (reportData.dgs10) {
    indicatorsHTML += `
      <div class="indicator">
        <h2>${reportData.dgs10.seriesInfo?.title || '10-Year Treasury Yield'}: 
          <span>${reportData.dgs10.currentValue?.value?.toFixed(2)}%</span>
        </h2>
        <p>Date: ${reportData.dgs10.currentValue?.date}</p>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Daily Market Summary</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { margin: 0; color: #1a3a6b; }
        .header p { margin: 5px 0 0; color: #555; }
        .indicator-section { margin-top: 20px; }
        .indicator { border: 1px solid #eee; padding: 15px; margin-bottom: 15px; border-radius: 5px; background-color: #f9f9f9; }
        .indicator h2 { margin-top: 0; margin-bottom: 8px; font-size: 1.1em; color: #2c3e50; }
        .indicator h2 span { font-weight: normal; color: #16a085; }
        .indicator p { font-size: 0.9em; color: #7f8c8d; margin: 0; }
        .footer { text-align: center; margin-top: 40px; font-size: 0.8em; color: #aaa; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Daily Market Summary</h1>
        <p>Generated on: ${currentDate}</p>
      </div>
      <div class="indicator-section">
        ${indicatorsHTML || '<p>No indicator data available for the report.</p>'}
      </div>
      <div class="footer">
        mktdash Analytics Platform
      </div>
    </body>
    </html>
  `;
}

export async function generateDailySummaryReport(): Promise<{ success: boolean; filePath?: string; pdfBuffer?: Buffer; error?: string }> {
  console.log('--- Starting PDF Generation ---');
  try {
    const reportData: any = {};
    const seriesToFetch = [
      { key: 'sp500', id: 'SP500' },
      { key: 'fedfunds', id: 'FEDFUNDS' },
      { key: 'dgs10', id: 'DGS10' },
    ];
    for (const item of seriesToFetch) {
      console.log(`Fetching data for ${item.id}...`);
      const result = await getSeriesDetails(item.id);
      if (result.data) {
        reportData[item.key] = result.data;
        console.log(`Fetched ${item.key}:`, result.data.currentValue);
      } else {
        console.warn(`Could not fetch data for ${item.id} for the report.`);
      }
    }
    if (!reportData.sp500 && !reportData.fedfunds && !reportData.dgs10) {
      console.warn('No indicator data fetched for report.');
    }
    console.log('Report data:', reportData);
    const htmlContent = getReportHTML(reportData);
    console.log("---- HTML Content for PDF ----");
    console.log(htmlContent);
    console.log("---- End of HTML Content ----");

    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({ 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // Common args for server environments
    });
    console.log('Puppeteer launched successfully.');
    const page = await browser.newPage();
    console.log('Setting page content...');
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    console.log('Page content set successfully.');
    console.log('Generating PDF...');
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    console.log(`Generated PDF Buffer size: ${pdfBuffer.length} bytes`);
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName = `mktdash_daily_summary_${timestamp}.pdf`;
    const filePath = path.join(reportsDir, fileName);
    await fs.writeFile(filePath, Buffer.from(pdfBuffer));
    await browser.close();
    console.log(`Report generated successfully: ${filePath}`);
    return { success: true, filePath, pdfBuffer: Buffer.from(pdfBuffer) };
  } catch (error: any) {
    console.error('Error generating PDF report:', error);
    return { success: false, error: error.message || 'Failed to generate PDF report' };
  }
}
