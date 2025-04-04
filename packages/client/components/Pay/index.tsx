"use client";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";

const sendPayment = async (amount: number) => {
  try {
    const res = await fetch(`/api/initiate-payment`, {
      method: "POST",
    });

    const { id } = await res.json();

    console.log(id);

    const payload: PayCommandInput = {
      reference: id,
      to: "0x5eFd4B32c4ccbB09912f3Db83Bc43FD33E239f09", // Test address
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(amount, Tokens.WLD).toString(),
        },
      ],
      description: "Watch this is a test",
    };
    if (MiniKit.isInstalled()) {
      return await MiniKit.commandsAsync.pay(payload);
    }
    return null;
  } catch (error: unknown) {
    console.log("Error sending payment", error);
    return null;
  }
};

const handlePayment = async (amount: number) => {
  if (!MiniKit.isInstalled()) {
    console.error("MiniKit is not installed");
    return;
  }
  const sendPaymentResponse = await sendPayment(amount);
  const response = sendPaymentResponse?.finalPayload;
  if (!response) {
    return;
  }

  if (response.status == "success") {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/confirm-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: response }),
    });
    const payment = await res.json();
    if (payment.success) {
      // Congrats your payment was successful!
      console.log("SUCCESS!");
    } else {
      // Payment failed
      console.log("FAILED!");
    }
  }
};

interface PayBlockProps {
  amount: number;
  onSuccess: () => void;
}

export const PayBlock = ({ amount, onSuccess }: PayBlockProps) => {
  const handlePay = async () => {
    await handlePayment(amount);
    onSuccess();
  };

  return (
    <button 
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
      onClick={handlePay}
    >
      <span>{amount} Pay WLD</span>
    </button>
  );
};
