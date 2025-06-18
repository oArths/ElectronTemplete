import ExcelJS from 'exceljs';
import { dialog } from 'electron';

async function exportArrayToExcel(data, sheetName = 'Data') {
    if (!data || data.length === 0) {
      throw new Error("No data available to export");
    }
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);
  
    // Assuming data is an array of objects and all objects have the same keys
    const columns = Object.keys(data[0]).map(key => ({ header: key, key: key }));
    worksheet.columns = columns;
  
    // Add rows to worksheet
    worksheet.addRows(data);
  
    // Prompt user to select save location
    const { filePath, canceled } = await dialog.showSaveDialog({
      buttonLabel: 'Save Excel',
      defaultPath: `${sheetName}.xlsx`,
      filters: [
        { name: 'Excel Files', extensions: ['xlsx'] }
      ]
    });

    if (canceled) {
      return "Cancelled";
    }
  
    if (filePath) {
      // Write to file
      await workbook.xlsx.writeFile(filePath);
      return "Success";
    } else {
      throw new Error("File path not provided");
    }
}

export default exportArrayToExcel;