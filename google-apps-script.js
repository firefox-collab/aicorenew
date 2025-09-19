// Google Apps Script code to handle form submissions
// This code should be deployed as a web app in Google Apps Script

function doPost(e) {
  try {
    // Log the incoming request for debugging
    console.log('Received POST request');
    console.log('Full request object:', e);
    
    // Check if postData exists
    if (!e.postData || !e.postData.contents) {
      console.error('No postData found in request');
      return ContentService
        .createTextOutput(JSON.stringify({status: 'error', message: 'No data received in request'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    console.log('Request body:', e.postData.contents);
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data:', data);
    
    // Get or create the spreadsheet
    const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your Google Sheets ID
    
    if (spreadsheetId === 'YOUR_SPREADSHEET_ID') {
      throw new Error('Please replace YOUR_SPREADSHEET_ID with your actual Google Sheets ID');
    }
    
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    console.log('Opened spreadsheet:', spreadsheet.getName());
    
    // Determine which sheet to use based on form type
    let sheet;
    if (data.type === 'Appointment') {
      sheet = getOrCreateSheet(spreadsheet, 'Appointments');
      setupAppointmentHeaders(sheet);
      appendAppointmentData(sheet, data);
    } else if (data.type === 'Intake') {
      sheet = getOrCreateSheet(spreadsheet, 'Intake Forms');
      setupIntakeHeaders(sheet);
      appendIntakeData(sheet, data);
    } else if (data.type === 'Contact') {
      sheet = getOrCreateSheet(spreadsheet, 'Contact Forms');
      setupContactHeaders(sheet);
      appendContactData(sheet, data);
    } else {
      throw new Error('Unknown form type: ' + data.type);
    }
    
    console.log('Data successfully added to sheet:', sheet.getName());
    
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success', message: 'Data saved successfully'}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing form submission:', error);
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests for testing
  console.log('Received GET request');
  console.log('Parameters:', e.parameter);
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success', 
      message: 'Google Apps Script is working! Use POST requests to submit form data.',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.TEXT);
}

function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    console.log('Creating new sheet:', sheetName);
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

function setupContactHeaders(sheet) {
  // Check if headers already exist
  if (sheet.getLastRow() === 0) {
    console.log('Setting up contact headers');
    const headers = [
      'Timestamp',
      'Name',
      'Email',
      'Phone',
      'Message'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#00ffff');
    headerRange.setFontColor('black');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
  }
}

function setupAppointmentHeaders(sheet) {
  // Check if headers already exist
  if (sheet.getLastRow() === 0) {
    console.log('Setting up appointment headers');
    const headers = [
      'Timestamp',
      'Name',
      'Email',
      'Phone',
      'Appointment Date',
      'Appointment Time',
      'Services',
      'Message'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#00ffff');
    headerRange.setFontColor('black');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
  }
}

function setupIntakeHeaders(sheet) {
  // Check if headers already exist
  if (sheet.getLastRow() === 0) {
    console.log('Setting up intake headers');
    const headers = [
      'Timestamp',
      'Name',
      'Email',
      'Services Interested',
      'Company Size',
      'Communication Method',
      'Project Timeline',
      'Budget Range',
      'Current Infrastructure',
      'Challenges',
      'Interested Services',
      'Additional Comments'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#00ffff');
    headerRange.setFontColor('black');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
  }
}

function appendContactData(sheet, data) {
  console.log('Appending contact data');
  const row = [
    new Date(data.timestamp),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.message || ''
  ];
  
  sheet.appendRow(row);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, row.length);
}

function appendAppointmentData(sheet, data) {
  console.log('Appending appointment data');
  const row = [
    new Date(data.timestamp),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.date || '',
    data.time || '',
    data.services || '',
    data.message || ''
  ];
  
  sheet.appendRow(row);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, row.length);
}

function appendIntakeData(sheet, data) {
  console.log('Appending intake data');
  const row = [
    new Date(data.timestamp),
    data.name || '',
    data.email || '',
    data.services || '',
    data.companySize || '',
    data.communicationMethod || '',
    data.projectTimeline || '',
    data.budgetRange || '',
    data.currentInfrastructure || '',
    data.challenges || '',
    data.interestedServices || '',
    data.additionalComments || ''
  ];
  
  sheet.appendRow(row);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, row.length);
}

// Test function to verify setup
function testSetup() {
  const spreadsheetId = 'YOUR_SPREADSHEET_ID';
  
  if (spreadsheetId === 'YOUR_SPREADSHEET_ID') {
    console.log('ERROR: Please replace YOUR_SPREADSHEET_ID with your actual Google Sheets ID');
    return;
  }
  
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    console.log('SUCCESS: Connected to spreadsheet:', spreadsheet.getName());
    
    // Test creating sheets
    const contactSheet = getOrCreateSheet(spreadsheet, 'Contact Forms');
    setupContactHeaders(contactSheet);
    console.log('SUCCESS: Contact sheet ready');
    
    const appointmentSheet = getOrCreateSheet(spreadsheet, 'Appointments');
    setupAppointmentHeaders(appointmentSheet);
    console.log('SUCCESS: Appointment sheet ready');
    
    const intakeSheet = getOrCreateSheet(spreadsheet, 'Intake Forms');
    setupIntakeHeaders(intakeSheet);
    console.log('SUCCESS: Intake sheet ready');
    
    console.log('All sheets are ready!');
    
    // Test data submission
    const testContactData = {
      timestamp: new Date().toISOString(),
      name: 'Test User',
      email: 'test@example.com',
      phone: '555-0123',
      message: 'Test message',
      type: 'Contact'
    };
    
    appendContactData(contactSheet, testContactData);
    console.log('SUCCESS: Test contact data added');
    
  } catch (error) {
    console.log('ERROR:', error.toString());
  }
}