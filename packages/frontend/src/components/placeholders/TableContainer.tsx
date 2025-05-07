import React from 'react';

// Placeholder component for displaying data in table format
const TableContainer: React.FC = () => {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-2">Data Table</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-muted-foreground">
          <thead className="text-xs uppercase bg-muted text-muted-foreground">
            <tr>
              <th scope="col" className="px-6 py-3">Metric</th>
              <th scope="col" className="px-6 py-3">Value</th>
              <th scope="col" className="px-6 py-3">Change</th>
              <th scope="col" className="px-6 py-3">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {/* Example Table Rows */}
            <tr className="bg-card border-b border-border">
              <th scope="row" className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                CPI (YoY)
              </th>
              <td className="px-6 py-4">
                3.4%
              </td>
              <td className="px-6 py-4 text-positive">
                +0.1%
              </td>
              <td className="px-6 py-4">
                2023-03-14
              </td>
            </tr>
             <tr className="bg-card border-b border-border">
              <th scope="row" className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                Unemployment Rate
              </th>
              <td className="px-6 py-4">
                3.9%
              </td>
              <td className="px-6 py-4 text-negative">
                +0.2%
              </td>
              <td className="px-6 py-4">
                2023-04-05
              </td>
            </tr>
            {/* More rows will be added dynamically with real data */}
          </tbody>
        </table>
      </div>
       <p className="text-muted-foreground mt-4">[Placeholder for Data Table]</p>
    </div>
  );
};

export default TableContainer;