import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePDFReport = (customer, payments, kpis) => {
  const doc = new jsPDF();

  // Header Colors & Branding
  doc.setFillColor(15, 23, 42); // Dark slate
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(245, 158, 11); // Amber
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SMART SOLAR ENERGY SYSTEM', 14, 20);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('CEYLON ELECTRICITY BOARD - NET ACCOUNTING STATEMENT', 14, 28);
  doc.text(`Generated Date: ${new Date().toLocaleDateString()}`, 140, 28);

  // Customer Information Box
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Customer System Details', 14, 52);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Customer Name: ${customer.name || 'Thisara Kanishka'}`, 14, 60);
  doc.text(`Customer ID: ${customer.customerId || 'CUST-1001'}`, 14, 66);
  doc.text(`Solar Package: ${customer.package || 'Gold Ultra 10kW'}`, 14, 72);
  doc.text(`Feed-in Tariff: Rs. ${customer.tariff ? customer.tariff.toFixed(2) : '48.00'} / kWh`, 14, 78);

  doc.text(`Panel Capacity: ${customer.panelCapacity || 10} kW`, 120, 60);
  doc.text(`Battery Capacity: ${customer.batteryCapacity || 10} kWh`, 120, 66);
  doc.text(`Installation Date: ${customer.installationDate || '2024-01-15'}`, 120, 72);
  doc.text(`System Status: ACTIVE GRID FEED`, 120, 78);

  // Monthly Table
  const tableRows = payments.map(p => [
    p.month,
    `${p.generated_units} kWh`,
    `${p.consumed_units} kWh`,
    `${p.exported_units} kWh`,
    `Rs. ${Number(p.rate).toFixed(2)}`,
    `Rs. ${Number(p.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    p.payment_status
  ]);

  doc.autoTable({
    startY: 86,
    head: [['Month', 'Generated', 'Consumed', 'Exported', 'Tariff Rate', 'Total Earnings', 'Status']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [245, 158, 11], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 8, cellPadding: 3 }
  });

  // Footer Sign-off
  const finalY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('This is an electronically generated statement certified by the Electricity Board Smart Solar Metering Engine.', 14, finalY);

  doc.save(`Solar_Grid_Statement_${customer.customerId || 'CUST-1001'}.pdf`);
};
