"use client";

import { useWalletStore } from '@/store/wallet';
import { signInWithWallet } from '@/utils/signInWithWallet';
import { MiniKit } from '@worldcoin/minikit-js'

export const WalletAuth = () => {
  const walletAddress = useWalletStore((state: any) => state.walletAddress);
  const setWalletAddress = useWalletStore((state: any) => state.setWalletAddress);

  const signOut = async () => {
    await fetch('/api/session', {
      method: 'DELETE',
    });
    setWalletAddress(null);
  };

  const handleSignIn = async () => {
    const res: any = await signInWithWallet()
    if (res?.status === 'success') {
      const walletAddress = MiniKit.walletAddress
      if (!walletAddress) return
      setWalletAddress(walletAddress)
      console.log('walletAddress', walletAddress)
      console.log("sign in success")
      return
    }
    console.log("sign in error")
  }

  return (
    <div>
      {walletAddress ? (
        <>
          <p>Wallet Address: {walletAddress}</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={handleSignIn}>Sign in with Wallet</button>
      )}
    </div>
  );
};
