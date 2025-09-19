// Google Apps Script code to handle form submissions
// This code should be deployed as a web app in Google Apps Script

function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get or create the spreadsheet
    const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your Google Sheets ID
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
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
    }
    
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

function getOrCreateSheet(spreadsheet, sheetName) {
  let sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  return sheet;
}

function setupAppointmentHeaders(sheet) {
  // Check if headers already exist
  if (sheet.getLastRow() === 0) {
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
    headerRange.setBackground('#27ae60');
    headerRange.setFontColor('white');
  }
}

function setupIntakeHeaders(sheet) {
  // Check if headers already exist
  if (sheet.getLastRow() === 0) {
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
    headerRange.setBackground('#27ae60');
    headerRange.setFontColor('white');
  }
}

function appendAppointmentData(sheet, data) {
  const row = [
    new Date(data.timestamp),
    data.name,
    data.email,
    data.phone,
    data.date,
    data.time,
    data.services,
    data.message
  ];
  
  sheet.appendRow(row);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, row.length);
}

function appendIntakeData(sheet, data) {
  const row = [
    new Date(data.timestamp),
    data.name,
    data.email,
    data.services,
    data.companySize,
    data.communicationMethod,
    data.projectTimeline,
    data.budgetRange,
    data.currentInfrastructure,
    data.challenges,
    data.interestedServices,
    data.additionalComments
  ];
  
  sheet.appendRow(row);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, row.length);
}

// Optional: Function to send email notifications
function sendEmailNotification(data) {
  const subject = `New ${data.type} Submission - ${data.name}`;
  const body = `
    New ${data.type.toLowerCase()} submission received:
    
    Name: ${data.name}
    Email: ${data.email}
    ${data.phone ? `Phone: ${data.phone}` : ''}
    ${data.date ? `Date: ${data.date}` : ''}
    ${data.time ? `Time: ${data.time}` : ''}
    
    Please check the Google Sheet for full details.
  `;
  
  // Replace with your email
  const emailAddress = 'your-email@example.com';
  
  try {
    MailApp.sendEmail(emailAddress, subject, body);
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}