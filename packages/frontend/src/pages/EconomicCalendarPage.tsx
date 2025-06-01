import React from 'react';

const EconomicCalendarPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <h1 className="text-3xl font-bold mb-6">Economic Calendar</h1>
      <div className="w-full flex justify-center">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <iframe
            src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&category=_employment,_economicActivity,_inflation,_credit,_centralBanks,_confidenceIndex,_balance,_Bonds&importance=1,2,3&features=datepicker,timezone,timeselector,filters&countries=25,32,6,37,72,22,17,39,14,10,35,43,56,36,110,11,26,12,4,5&calType=week&timeZone=8&lang=1"
            width="650"
            height="900"
            frameBorder="0"
            allowTransparency={true}
            marginWidth={0}
            marginHeight={0}
            style={{ border: 'none' }}
            title="Investing.com Economic Calendar"
          ></iframe>
        </div>
      </div>
      <div className="poweredBy mt-2" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <span style={{ fontSize: 11, color: '#333', textDecoration: 'none' }}>
          Real Time Economic Calendar provided by{' '}
          <a
            href="https://www.investing.com/"
            rel="nofollow"
            target="_blank"
            style={{ fontSize: 11, color: '#06529D', fontWeight: 'bold' }}
            className="underline_link"
          >
            Investing.com
          </a>.
        </span>
      </div>
    </div>
  );
};

export default EconomicCalendarPage;
