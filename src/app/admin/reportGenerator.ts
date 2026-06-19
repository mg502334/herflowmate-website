import { ReportConfig } from './ReportPreFlightModal';
import { StoreSettings } from '../data/useStoreSettings';
import { format } from 'date-fns';

export function generatePrintableReport(metrics: any, settings: StoreSettings | null, config: ReportConfig) {
  const rs = settings?.report_settings || {};
  const primaryColor = rs.primaryColor || '#38BDF8';
  const secondaryColor = rs.secondaryColor || '#0F172A';
  const businessName = rs.businessName || 'HerFlowMate';
  const logoUrl = settings?.business_logo_url || '';
  const pageNumbers = rs.pageNumbers !== false;
  
  const titleFont = rs.titles?.fontFamily || 'Inter';
  const titleWeight = rs.titles?.fontWeight || 'bold';
  const titleColor = rs.titles?.color || '#ffffff';
  
  const pFont = rs.paragraphs?.fontFamily || 'Inter';
  const pWeight = rs.paragraphs?.fontWeight || 'normal';
  const pColor = rs.paragraphs?.color || '#ffffff';

  const isLandscape = config.reportStyle === 'landscape';

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Financial Report</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@400;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
      <style>
        @page {
          size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'};
          margin: 0;
        }
        * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; color-adjust: exact !important; print-color-adjust: exact !important; }
        body {
          margin: 0;
          padding: 0;
          background-color: ${secondaryColor};
          font-family: '${pFont}', sans-serif;
          color: ${pColor};
          font-weight: ${pWeight};
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: '${titleFont}', serif;
          font-weight: ${titleWeight};
          color: ${titleColor};
          margin: 0;
        }
        .page {
          width: 100vw;
          height: 100vh;
          page-break-after: always;
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 80px;
          background-color: ${secondaryColor};
          overflow: hidden;
        }
        .cover {
          justify-content: center;
          align-items: flex-start;
          background: linear-gradient(135deg, ${secondaryColor} 40%, #000000 100%);
        }
        .cover .accent-bar {
          width: 120px;
          height: 8px;
          background-color: ${primaryColor};
          margin-bottom: 40px;
        }
        .cover h1 {
          font-size: 56px;
          line-height: 1.1;
          margin-bottom: 24px;
          max-width: 80%;
        }
        .cover .meta {
          margin-top: auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          width: 100%;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 40px;
        }
        .logo-img {
          max-height: 60px;
          margin-bottom: auto;
        }
        
        /* Inner Pages */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 60px;
          border-bottom: 2px solid ${primaryColor};
          padding-bottom: 20px;
        }
        .header h2 { font-size: 32px; }
        
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          margin-bottom: 60px;
        }
        .kpi-card {
          background-color: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-left: 4px solid ${primaryColor};
          padding: 40px;
        }
        .kpi-value { font-size: 48px; font-weight: bold; margin-top: 10px; color: ${titleColor}; font-family: '${titleFont}', serif; }
        .kpi-label { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.6); }

        .product-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }
        .list-item {
          display: flex;
          justify-content: space-between;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .bar-container {
          width: 100%;
          height: 6px;
          background: rgba(255,255,255,0.1);
          margin-top: 10px;
          border-radius: 3px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          background-color: ${primaryColor};
        }
        .bar-fill.bad { background-color: #f43f5e; }

        .notes-box {
          background-color: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 40px;
          font-size: 18px;
          line-height: 1.8;
          white-space: pre-wrap;
          flex: 1;
        }

        .page-number {
          position: absolute;
          bottom: 40px;
          right: 80px;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          ${!pageNumbers ? 'display: none;' : ''}
        }
        .footer-branding {
          position: absolute;
          bottom: 40px;
          left: 80px;
          font-size: 12px;
          font-weight: bold;
          color: ${primaryColor};
        }
      </style>
    </head>
    <body>
      <!-- Slide 1: Cover -->
      <div class="page cover">
        ${logoUrl ? `<img src="${logoUrl}" class="logo-img" />` : `<h2 style="margin-bottom: auto; color: ${primaryColor};">${businessName}</h2>`}
        <div class="accent-bar"></div>
        <h1>Executive Financial<br/>& Operations Report</h1>
        <div class="meta">
          <div>
            <div style="font-size: 12px; text-transform: uppercase; color: ${primaryColor}; margin-bottom: 8px;">Prepared For</div>
            <div style="font-size: 18px;">${config.preparedFor || 'Internal Review'}</div>
          </div>
          <div>
            <div style="font-size: 12px; text-transform: uppercase; color: ${primaryColor}; margin-bottom: 8px;">Prepared By</div>
            <div style="font-size: 18px;">${config.preparedBy}</div>
            <div style="font-size: 14px; opacity: 0.6; margin-top: 4px;">${format(new Date(), 'MMMM do, yyyy')}</div>
          </div>
        </div>
      </div>

      <!-- Slide 2: Executive Summary -->
      <div class="page">
        <div class="header">
          <h2>Executive Summary</h2>
          <div style="color: ${primaryColor}; font-weight: bold;">YTD Performance</div>
        </div>
        
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Total Revenue</div>
            <div class="kpi-value">$${metrics.totalRevenue.toFixed(2)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Order Volume</div>
            <div class="kpi-value">${metrics.totalOrders}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Avg Order Value</div>
            <div class="kpi-value">$${metrics.averageOrderValue.toFixed(2)}</div>
          </div>
        </div>

        <div class="product-grid">
          <div>
            <h3 style="margin-bottom: 30px; font-size: 24px;">Top Performing Assets</h3>
            ${metrics.mostPopular.map((item: any) => `
              <div class="list-item" style="flex-direction: column;">
                <div style="display: flex; justify-content: space-between; width: 100%;">
                  <span>${item.name}</span>
                  <span style="color: ${primaryColor}; font-weight: bold;">${item.qty} units</span>
                </div>
                <div class="bar-container">
                  <div class="bar-fill" style="width: ${Math.max(5, (item.qty / metrics.maxQty) * 100)}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
          <div>
            <h3 style="margin-bottom: 30px; font-size: 24px;">Low Velocity Assets</h3>
            ${metrics.leastSold.map((item: any) => `
              <div class="list-item" style="flex-direction: column;">
                <div style="display: flex; justify-content: space-between; width: 100%;">
                  <span>${item.name}</span>
                  <span style="color: #f43f5e; font-weight: bold;">${item.qty} units</span>
                </div>
                <div class="bar-container">
                  <div class="bar-fill bad" style="width: ${Math.max(5, (item.qty / metrics.maxQty) * 100)}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="footer-branding">${businessName}</div>
        <div class="page-number">Page 1</div>
      </div>

      <!-- Slide 3: Growth Projection (If we have projection data) -->
      <div class="page">
        <div class="header">
          <h2>5-Year Growth Trajectory</h2>
          <div style="color: ${primaryColor}; font-weight: bold;">Forward Looking Statement</div>
        </div>
        
        <p style="font-size: 18px; line-height: 1.6; margin-bottom: 40px; opacity: 0.8;">
          Based on historical all-time data, the following model projects revenue over the next 60 months assuming an aggressive 25% Year-over-Year growth rate. This model assumes market conditions remain favorable.
        </p>

        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; height: 300px; align-items: end;">
          ${(function() {
             const base = metrics.totalRevenue || 5000;
             let html = '';
             let cur = base;
             let maxVal = base * Math.pow(1.25, 5);
             for(let i=1; i<=5; i++) {
               cur *= 1.25;
               let h = (cur / maxVal) * 100;
               html += `
                 <div style="text-align: center;">
                   <div style="font-weight: bold; margin-bottom: 10px; color: ${primaryColor};">$${Math.round(cur).toLocaleString()}</div>
                   <div style="background-color: ${primaryColor}; height: ${h}%; width: 100%; opacity: ${0.5 + (i*0.1)};"></div>
                   <div style="margin-top: 15px; font-weight: bold;">Year ${i}</div>
                 </div>
               `;
             }
             return html;
          })()}
        </div>

        <div class="footer-branding">${businessName}</div>
        <div class="page-number">Page 2</div>
      </div>

      <!-- Slide 4: Notes (Optional) -->
      ${config.notes ? `
      <div class="page">
        <div class="header">
          <h2>Executive Notes & Synthesis</h2>
        </div>
        <div class="notes-box">${config.notes}</div>
        <div class="footer-branding">${businessName}</div>
        <div class="page-number">Page 3</div>
      </div>
      ` : ''}

      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
