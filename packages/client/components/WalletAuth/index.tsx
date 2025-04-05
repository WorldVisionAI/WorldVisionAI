"use client";

import { useWalletStore } from "@/store/wallet";
import type { WalletState } from "@/store/wallet";
import { signInWithWallet } from "@/utils/signInWithWallet";
import { MiniKit } from "@worldcoin/minikit-js";

interface SignInResponse {
	status: "success" | "error";
}

export const WalletAuth = () => {
	const walletAddress = useWalletStore(
		(state: WalletState) => state.walletAddress,
	);
	const setWalletAddress = useWalletStore(
		(state: WalletState) => state.setWalletAddress,
	);

	const signOut = async () => {
		await fetch("/api/session", {
			method: "DELETE",
		});
		setWalletAddress(null);
	};

	const handleSignIn = async () => {
		const res = (await signInWithWallet()) as SignInResponse;
		if (res?.status === "success") {
			const walletAddress = MiniKit.walletAddress;
			if (!walletAddress) return;
			setWalletAddress(walletAddress);
			console.log("walletAddress", walletAddress);
			console.log("sign in success");
			return;
		}
		console.log("sign in error");
	};

	return (
		<div>
			{walletAddress ? (
				<>
					<p>Wallet Address: {walletAddress}</p>
					<button onClick={signOut} type="button">
						Sign Out
					</button>
				</>
			) : (
				<button onClick={handleSignIn} type="button">
					Sign in with Wallet
				</button>
			)}
		</div>
	);
};
