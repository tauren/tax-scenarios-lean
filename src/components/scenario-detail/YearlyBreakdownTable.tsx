import React from 'react';
import { formatCurrency } from '@/utils/formatting';

interface YearlyBreakdownTableProps {
  results: any;
}

const YearlyBreakdownTable: React.FC<YearlyBreakdownTableProps> = ({ results }) => {
  const years = results.yearlyProjections || [];
  return (
    <div className="border rounded-lg p-4 mb-2 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-2">Yearly Breakdown</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-2 py-1 text-left">Year</th>
            <th className="px-2 py-1 text-left">Income</th>
            <th className="px-2 py-1 text-left">Asset Sales</th>
            <th className="px-2 py-1 text-left">Expenses</th>
            <th className="px-2 py-1 text-left">Taxes</th>
            <th className="px-2 py-1 text-left">Net Outcome</th>
          </tr>
        </thead>
        <tbody>
          {years.map((year: any, i: number) => (
            <tr key={i} className="border-b hover:bg-accent/30">
              <td className="px-2 py-1">{year.year}</td>
              <td className="px-2 py-1">{formatCurrency(year.income)}</td>
              <td className="px-2 py-1">{formatCurrency(year.capitalGainsData?.totalGains || 0)}</td>
              <td className="px-2 py-1">{formatCurrency(year.expenses)}</td>
              <td className="px-2 py-1">{formatCurrency(year.taxBreakdown?.totalTax || 0)}</td>
              <td className="px-2 py-1 font-semibold">{formatCurrency(year.netFinancialOutcome)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default YearlyBreakdownTable; 