'use client';

import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/store/wallet';
import { signInWithWallet } from '@/utils/signInWithWallet';
import { MiniKit } from '@worldcoin/minikit-js';

export function FloatingHeader() {
  const userName = useWalletStore((state: any) => state.userName);
  const setWalletAddress = useWalletStore((state: any) => state.setWalletAddress);

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
    <header className="pt-4">
      <div className="container flex h-12 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Add your logo or site name here if needed */}
        </div>
        <nav className="flex items-center gap-4">
          {userName ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{userName}</span>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={handleSignIn}>
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
} 
