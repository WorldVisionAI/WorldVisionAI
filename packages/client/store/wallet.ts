import { create } from "zustand";

interface WalletState {
    walletAddress: string | null;
    userName: string | null;
    setWalletAddress: (address: string | null) => void;
    setUserName: (name: string | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
    walletAddress: null,
    userName: null,
    setWalletAddress: (address) => set({ walletAddress: address }),
    setUserName: (name) => set({ userName: name }),
}));
