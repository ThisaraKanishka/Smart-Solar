import React, { useState, useEffect } from 'react';
import { FileText, Download, Table, Calendar, CheckCircle, RefreshCw } from 'lucide-react';
import api from '../utils/api';
import { generatePDFReport } from '../utils/pdfExport';
import { generateExcelReport } from '../utils/excelExport';

const ReportsPage = () => {
  const [payments, setPayments] = useState([]);
  const [customer, setCustomer] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [dashRes, payRes] = await Promise.all([
          api.get('/customer/dashboard'),
          api.get('/customer/payments')
        ]);
        setCustomer(dashRes.data.customer);
        setPayments(payRes.data.payments || []);
      } catch (err) {
        console.error('Fetch report error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
        <p className="text-xs text-slate-400 mt-2">Loading Report Generator...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <FileText className="w-4 h-4" /> Export Center
        </div>
        <h1 className="text-3xl font-extrabold text-white">Monthly & Yearly Reports</h1>
        <p className="text-xs text-slate-400">
          Download officially certified electricity board net metering reports in PDF or Excel spreadsheet format.
        </p>
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PDF Export Card */}
        <div className="glass-card p-8 border border-amber-500/30 rounded-3xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Certified PDF Statement</h3>
            <p className="text-xs text-slate-400 mt-1">
              Includes official Electricity Board letterhead, customer specs, monthly unit breakdown, and tariff payout calculations.
            </p>
          </div>
          <button
            onClick={() => generatePDFReport(customer, payments)}
            className="w-full py-3 rounded-xl font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg text-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download PDF Report
          </button>
        </div>

        {/* Excel Export Card */}
        <div className="glass-card p-8 border border-emerald-500/30 rounded-3xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Table className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Raw Data Excel Spreadsheet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Raw tabular data (.XLSX) ideal for accounting, tax filings, and custom financial modeling.
            </p>
          </div>
          <button
            onClick={() => generateExcelReport(customer, payments)}
            className="w-full py-3 rounded-xl font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg text-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Excel (.XLSX)
          </button>
        </div>

      </div>

    </div>
  );
};

export default ReportsPage;
