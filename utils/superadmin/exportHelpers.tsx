export const exportPDF = (filters: {
  branch: string;
  month: string;
  year: string;
}) => {
  // Nanti bisa pakai html2pdf atau jsPDF di sini
  console.log('Export PDF:', filters);
  alert('PDF berhasil diekspor (dummy handler)');
};

export const exportExcel = (filters: {
  branch: string;
  month: string;
  year: string;
}) => {
  // Nanti bisa pakai SheetJS (xlsx) atau fetch ke backend
  console.log('Export Excel:', filters);
  alert('Excel berhasil diekspor (dummy handler)');
};
