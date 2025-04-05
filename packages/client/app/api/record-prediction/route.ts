import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = '1Ad-ZV4Jgnjmo55nkJL2ClVP-03nLwPnMUT_MnNXHJfw';
const SHEET_NAME = 'transaction';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      predictionId, 
      predictionTitle, 
      choice, 
      amount, 
      walletAddress,
      timestamp = new Date().toISOString()
    } = body;

    // Prepare the row data
    const rowData = [
      timestamp,
      predictionId,
      predictionTitle,
      choice,
      amount,
      walletAddress
    ];

    // Append the data to the spreadsheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording prediction:', error);
    return NextResponse.json(
      { error: 'Failed to record prediction' },
      { status: 500 }
    );
  }
} 
