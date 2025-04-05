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
if (!process.env.NEXT_PUBLIC_RPC_URL) {
  throw new Error('NEXT_PUBLIC_RPC_URL is not set');
}
if (!process.env.OWNER_PRIVATE_KEY) {
  throw new Error('OWNER_PRIVATE_KEY is not set');
}
if (!process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS) {
  throw new Error('NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS is not set');
}

const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
const ownerWallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
const contractAddress = process.env.NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      createDate = new Date().toISOString(),
      walletAddress,
      isSpecialBet,
      isYes,
      amount,
      predictionId,
    } = body;

    // Validate inputs
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'string' && typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (typeof predictionId !== 'number') {
      return NextResponse.json(
        { error: 'Invalid prediction ID' },
        { status: 400 }
      );
    }

    // Prepare the row data for spreadsheet
    const rowData = [
      createDate,
      walletAddress,
      isSpecialBet,
      isYes,
      amount,
      predictionId,
    ];

    try {
      // First try to interact with the smart contract
      const contract = PredictionMarket__factory.connect(contractAddress, ownerWallet);
      
      // Convert amount to contract format (assuming WLD has 18 decimals)
      const amountInWei = ethers.parseEther(amount.toString());
      
      console.log('Sending transaction with params:', {
        walletAddress,
        amountInWei: amountInWei.toString(),
        isYes,
      });

      // Call the appropriate contract function based on the bet type
      const tx = isYes 
        ? await contract.betYesFor(walletAddress, amountInWei)
        : await contract.betNoFor(walletAddress, amountInWei);
      
      console.log('Transaction sent:', tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      if (!receipt) {
        throw new Error('Transaction failed: receipt is null');
      }
      console.log('Transaction confirmed:', receipt.hash);

      // If transaction is successful, then record in spreadsheet
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A:F`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [rowData],
        },
      });

      return NextResponse.json({ 
        success: true,
        transactionHash: tx.hash
      });

    } catch (error: any) {
      console.error('Contract interaction error:', error);
      
      // Check if it's a contract revert
      if (error.code === 'CALL_EXCEPTION' || error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        return NextResponse.json(
          { error: 'Smart contract error: ' + (error.reason || error.message) },
          { status: 400 }
        );
      }

      // Check if it's a network error
      if (error.code === 'NETWORK_ERROR') {
        return NextResponse.json(
          { error: 'Network error: Please check your connection' },
          { status: 503 }
        );
      }

      // For any other errors
      return NextResponse.json(
        { error: 'Transaction failed: ' + error.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
