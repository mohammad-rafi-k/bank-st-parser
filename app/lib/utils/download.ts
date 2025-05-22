'use client';

import * as XLSX from 'xlsx';

export function downloadData(data: any, format: 'json' | 'csv' | 'xlsx') {
  const transactions = data.transactions || [];
  const fileName = `bank-statement-${new Date().toISOString().split('T')[0]}`;

  switch (format) {
    case 'json':
      downloadJson(data, `${fileName}.json`);
      break;
    case 'csv':
      downloadCsv(transactions, `${fileName}.csv`);
      break;
    case 'xlsx':
      downloadXlsx(transactions, `${fileName}.xlsx`);
      break;
  }
}

function downloadJson(data: any, fileName: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, fileName);
}

function downloadCsv(transactions: any[], fileName: string) {
  const headers = ['Date', 'Description', 'Amount', 'Type', 'Balance'];
  const csvContent = [
    headers.join(','),
    ...transactions.map(t => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      t.balance
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, fileName);
}

function downloadXlsx(transactions: any[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(transactions);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadBlob(blob, fileName);
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
