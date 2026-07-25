import * as XLSX from 'xlsx';

export const generateExcelReport = (customer, payments) => {
  const data = payments.map(p => ({
    'Month': p.month,
    'Generated Units (kWh)': p.generated_units,
    'Consumed Units (kWh)': p.consumed_units,
    'Exported Units (kWh)': p.exported_units,
    'Rate Per Unit (Rs)': p.rate,
    'Total Earnings (Rs)': p.amount,
    'Payment Status': p.payment_status,
    'Payment Date': p.payment_date
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Solar Monthly Payments');

  XLSX.writeFile(workbook, `Solar_Grid_Data_${customer.customerId || 'CUST-1001'}.xlsx`);
};
