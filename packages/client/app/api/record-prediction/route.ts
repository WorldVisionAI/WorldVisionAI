import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { PredictionMarket__factory } from '@/src/contracts';

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

// Ethereum setup
const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const ownerWallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY || '', provider);
const contractAddress = process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS || '';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      createDate = new Date().toISOString(), // Create date
      walletAddress,   // Wallet address
      isSpecialBet,    // Special bet (true/false)
      isYes,           // Yes/No (true/false)
      amount,        // Bet count (value)
      predictionId,  // Prediction ID
    } = body;

    // Prepare the row data
    const rowData = [
      createDate,
      walletAddress,
      isSpecialBet,
      isYes,
      amount,
      predictionId,
    ];

    // Append the data to the spreadsheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:F`, // Updated range to include predictionId
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData],
      },
    });

    // Interact with the smart contract
    const contract = PredictionMarket__factory.connect(contractAddress, ownerWallet);
    
    // Convert amount to contract format (assuming WLD has 18 decimals)
    const amountInWei = ethers.parseEther(amount.toString());
    
    // Call the appropriate contract function based on the bet type
    const tx = isYes 
      ? await contract.betYesFor(walletAddress, amountInWei)
      : await contract.betNoFor(walletAddress, amountInWei);
    
    // Wait for transaction confirmation
    await tx.wait();

    return NextResponse.json({ 
      success: true,
      transactionHash: tx.hash
    });
  } catch (error) {
    console.error('Error recording prediction:', error);
    return NextResponse.json(
      { error: 'Failed to record prediction' },
      { status: 500 }
    );
  }
} 
