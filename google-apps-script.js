function doPost(e) {
  console.log('=== INCOMING REQUEST DEBUG ===');
  console.log('Event object:', JSON.stringify(e, null, 2));
  
  try {
    // Check if we have any event object at all
    if (!e) {
      console.error('No event object received');
      return createErrorResponse('No request data received');
    }
    
    let data = null;
    let dataSource = 'unknown';
    
    // Method 1: Check if data is in parameters (GET-style parameters)
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      console.log('Found data in parameters');
      data = e.parameter;
      dataSource = 'parameters';
    }
    
    // Method 2: Check postData if it exists
    else if (e.postData) {
      console.log('Found postData object');
      
      if (e.postData.contents) {
        console.log('Found data in postData.contents');
        try {
          data = JSON.parse(e.postData.contents);
          dataSource = 'postData.contents';
        } catch (parseError) {
          console.error('Failed to parse postData.contents:', parseError);
          console.log('Raw postData.contents:', e.postData.contents);
        }
      }
      
      if (!data && typeof e.postData.getDataAsString === 'function') {
        console.log('Trying postData.getDataAsString()');
        try {
          const dataString = e.postData.getDataAsString();
          console.log('Raw data string:', dataString);
          data = JSON.parse(dataString);
          dataSource = 'postData.getDataAsString()';
        } catch (parseError) {
          console.error('Failed to parse getDataAsString():', parseError);
        }
      }
    }
    
    // Method 3: Try to parse the entire event as data (fallback)
    if (!data && e.name) {
      console.log('Using event object directly as data');
      data = e;
      dataSource = 'direct';
    }
    
    // If still no data, create a test entry
    if (!data) {
      console.log('No data found, creating test entry');
      data = {
        name: 'Test Submission',
        email: 'test@example.com',
        phone: '555-0123',
        message: 'Test message - no data received from form',
        type: 'Contact'
      };
      dataSource = 'fallback';
    }
    
    console.log('Data source:', dataSource);
    console.log('Final data:', JSON.stringify(data, null, 2));
    
    // Validate required fields (be flexible with test data)
    if (!data.name && !data.email) {
      console.error('Missing required fields');
      return createErrorResponse('Missing required fields: name and email are required');
    }
    
    // Get or create the spreadsheet
    const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // Replace with your Google Sheets ID
    
    if (spreadsheetId === 'YOUR_SPREADSHEET_ID') {
      console.error('Spreadsheet ID not configured');
      return createErrorResponse('Please replace YOUR_SPREADSHEET_ID with your actual Google Sheets ID in the script');
    }
    
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      console.log('Successfully opened spreadsheet:', spreadsheet.getName());
    } catch (spreadsheetError) {
      console.error('Failed to open spreadsheet:', spreadsheetError);
      return createErrorResponse('Failed to open spreadsheet. Please check the spreadsheet ID: ' + spreadsheetError.toString());
    }
    
    // Determine form type and process accordingly
    const formType = data.type || 'Contact';
    console.log('Processing form type:', formType);
    
    let sheet;
    try {
      if (formType === 'Appointment') {
        sheet = getOrCreateSheet(spreadsheet, 'Appointments');
        setupAppointmentHeaders(sheet);
        appendAppointmentData(sheet, data);
      } else if (formType === 'Intake') {
        sheet = getOrCreateSheet(spreadsheet, 'Intake Forms');
        setupIntakeHeaders(sheet);
        appendIntakeData(sheet, data);
      } else {
        sheet = getOrCreateSheet(spreadsheet, 'Contact Forms');
        setupContactHeaders(sheet);
        appendContactData(sheet, data);
      }
      
      console.log('Successfully processed data for sheet:', sheet.getName());
      
    } catch (sheetError) {
      console.error('Error processing sheet operations:', sheetError);
      return createErrorResponse('Error saving to spreadsheet: ' + sheetError.toString());
    }
    
    return createSuccessResponse('Data saved successfully to ' + sheet.getName() + ' (Source: ' + dataSource + ')');
    
  } catch (error) {
    console.error('Unexpected error in doPost:', error);
    console.error('Error stack:', error.stack);
    return createErrorResponse('Unexpected error: ' + error.toString());
  }
}

function doGet(e) {
  console.log('=== GET REQUEST DEBUG ===');
  console.log('GET parameters:', e ? e.parameter : 'No event object');
  
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Google Apps Script is working! Use POST requests to submit form data.',
      timestamp: new Date().toISOString(),
      receivedParams: e ? Object.keys(e.parameter || {}) : []
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function createSuccessResponse(message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: message,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'error',
      message: message,
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
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
  if (sheet.getLastRow() === 0) {
    console.log('Setting up contact headers');
    const headers = ['Timestamp', 'Name', 'Email', 'Phone', 'Message', 'Source'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#00ffff');
    headerRange.setFontColor('#000000');
    
    sheet.autoResizeColumns(1, headers.length);
  }
}

function setupAppointmentHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    console.log('Setting up appointment headers');
    const headers = ['Timestamp', 'Name', 'Email', 'Phone', 'Date', 'Time', 'Services', 'Message', 'Source'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#00ffff');
    headerRange.setFontColor('#000000');
    
    sheet.autoResizeColumns(1, headers.length);
  }
}

function setupIntakeHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    console.log('Setting up intake headers');
    const headers = [
      'Timestamp', 'Name', 'Email', 'Services', 'Company Size', 
      'Communication Method', 'Timeline', 'Budget', 'Infrastructure', 
      'Challenges', 'Interested Services', 'Comments', 'Source'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#00ffff');
    headerRange.setFontColor('#000000');
    
    sheet.autoResizeColumns(1, headers.length);
  }
}

function appendContactData(sheet, data) {
  console.log('Appending contact data');
  const row = [
    new Date(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.message || '',
    'Web Form'
  ];
  
  sheet.appendRow(row);
  sheet.autoResizeColumns(1, row.length);
}

function appendAppointmentData(sheet, data) {
  console.log('Appending appointment data');
  const row = [
    new Date(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.date || '',
    data.time || '',
    data.services || '',
    data.message || '',
    'Web Form'
  ];
  
  sheet.appendRow(row);
  sheet.autoResizeColumns(1, row.length);
}

function appendIntakeData(sheet, data) {
  console.log('Appending intake data');
  const row = [
    new Date(),
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
    data.additionalComments || '',
    'Web Form'
  ];
  
  sheet.appendRow(row);
  sheet.autoResizeColumns(1, row.length);
}

// Enhanced test function
function testSetup() {
  console.log('=== TESTING SETUP ===');
  
  const spreadsheetId = 'YOUR_SPREADSHEET_ID';
  
  if (spreadsheetId === 'YOUR_SPREADSHEET_ID') {
    console.log('❌ ERROR: Please replace YOUR_SPREADSHEET_ID with your actual Google Sheets ID');
    return false;
  }
  
  try {
    // Test spreadsheet access
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    console.log('✅ SUCCESS: Connected to spreadsheet:', spreadsheet.getName());
    
    // Test sheet creation and headers
    const contactSheet = getOrCreateSheet(spreadsheet, 'Contact Forms');
    setupContactHeaders(contactSheet);
    console.log('✅ SUCCESS: Contact sheet ready');
    
    const appointmentSheet = getOrCreateSheet(spreadsheet, 'Appointments');
    setupAppointmentHeaders(appointmentSheet);
    console.log('✅ SUCCESS: Appointment sheet ready');
    
    const intakeSheet = getOrCreateSheet(spreadsheet, 'Intake Forms');
    setupIntakeHeaders(intakeSheet);
    console.log('✅ SUCCESS: Intake sheet ready');
    
    // Test data submission
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '555-0123',
      message: 'Test message from setup function',
      type: 'Contact'
    };
    
    appendContactData(contactSheet, testData);
    console.log('✅ SUCCESS: Test data added to Contact Forms sheet');
    
    console.log('🎉 All tests passed! Your setup is working correctly.');
    return true;
    
  } catch (error) {
    console.log('❌ ERROR:', error.toString());
    console.log('Error details:', error.stack);
    return false;
  }
}

// Test function to simulate a POST request with fallback data
function testPostRequest() {
  console.log('=== TESTING POST REQUEST ===');
  
  // Simulate the event object that would come from a form submission
  const mockEvent = {
    parameter: {
      name: 'Test User from POST',
      email: 'testpost@example.com',
      phone: '555-0456',
      message: 'Test message from POST simulation',
      type: 'Contact'
    }
  };
  
  const result = doPost(mockEvent);
  console.log('POST test result:', result.getContent());
  
  return result;
}