'use client'; // Required for Next.js

import { useWalletStore } from '@/store/wallet';
import type { WalletState } from '@/store/wallet';
import { signInWithWallet } from '@/utils/signInWithWallet';
import { MiniKit } from '@worldcoin/minikit-js';
import { type ReactNode, useEffect } from 'react';

interface SignInResponse {
  status: 'success' | 'error';
}

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  const setWalletAddress = useWalletStore(
    (state: WalletState) => state.setWalletAddress,
  );
  const setUserName = useWalletStore((state: WalletState) => state.setUserName);

  // 初期化時にセッションをチェック
  useEffect(() => {
    const f = async () => {
      const res = (await signInWithWallet()) as SignInResponse;
      if (res?.status === 'success') {
        const walletAddress = MiniKit.walletAddress;
        console.log(walletAddress);
        if (!walletAddress) return;
        setWalletAddress(walletAddress);

        const userName = await MiniKit.getUserByAddress(walletAddress);
        if (!userName.username) return;
        setUserName(userName.username);
        console.log(userName.username);
      }
    };

    const checkSession = async () => {
      const response = await fetch('/api/session');
      const { walletAddress, userName } = await response.json();
      console.log(walletAddress, userName);
      if (walletAddress && userName) {
        setWalletAddress(walletAddress);
        setUserName(userName);
      } else {
        f();
      }
    };

    const timer = setTimeout(() => {
      checkSession();
    }, 1000);

    return () => clearTimeout(timer);
  }, [setWalletAddress, setUserName]);

  useEffect(() => {
    MiniKit.install();
    console.log(MiniKit.isInstalled());
  }, []);

  return <>{children}</>;
}
