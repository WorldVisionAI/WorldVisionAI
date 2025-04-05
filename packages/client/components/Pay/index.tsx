'use client';
import { useCoolMode } from '@/hooks/useCoolRoundMode';
import {
  MiniKit,
  type PayCommandInput,
  Tokens,
  tokenToDecimals,
} from '@worldcoin/minikit-js';

const sendPayment = async (amount: number) => {
  try {
    const res = await fetch('/api/initiate-payment', {
      method: 'POST',
    });

    const { id } = await res.json();

    console.log(id);

    const payload: PayCommandInput = {
      reference: id,
      to: '0x5eFd4B32c4ccbB09912f3Db83Bc43FD33E239f09', // Test address
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(amount, Tokens.WLD).toString(),
        },
      ],
      description: 'Watch this is a test',
    };
    if (MiniKit.isInstalled()) {
      return await MiniKit.commandsAsync.pay(payload);
    }
    return null;
  } catch (error: unknown) {
    console.log('Error sending payment', error);
    return null;
  }
};

const handlePayment = async (amount: number) => {
  if (!MiniKit.isInstalled()) {
    console.error('MiniKit is not installed');
    return false;
  }
  try {
    const sendPaymentResponse = await sendPayment(amount);
    const response = sendPaymentResponse?.finalPayload;
    if (!response) {
      console.error('No payment response received');
      return false;
    }

    if (response.status === 'success') {
      try {
        console.log('Sending payment confirmation with payload:', response);
        const confirmationPayload = {
          payload: response,
          amount: amount,
          timestamp: new Date().toISOString(),
          status: response.status,
        };

        const res = await fetch('/api/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(confirmationPayload),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const payment = await res.json();
        console.log('Payment confirmation response:', payment);
        if (payment.success) {
          console.log('Payment successful!');
          return true;
        }
        console.error('Payment verification failed. Full response:', payment);
        return false;
      } catch (error) {
        console.error('Payment confirmation failed:', error);
        return false;
      }
    }
    console.error('Payment status not successful:', response.status);
    return false;
  } catch (error) {
    console.error('Payment process failed:', error);
    return false;
  }
};

interface PayBlockProps {
  amount: number;
  onSuccess: () => void;
}

export const PayBlock = ({ amount, onSuccess }: PayBlockProps) => {
  const buttonRef = useCoolMode('/coin.png');
  const handlePay = async () => {
    const success = await handlePayment(amount);
    if (success) {
      onSuccess();
    }
  };

  return (
    <button
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
      onClick={handlePay}
      ref={buttonRef}
      type="button"
    >
      <span>{amount} Pay WLD</span>
    </button>
  );
};
