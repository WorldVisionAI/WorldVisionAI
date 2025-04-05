"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function WithdrawPage() {
	const [selectedNetwork, setSelectedNetwork] = useState("optimism");

	const handleNetworkChange = (value: string) => {
		setSelectedNetwork(value);
	};

	const predictionResult = {
		id: 3,
		title: "Will a Japanese film win the next Academy Award for Best Picture?",
		category: "Entertainment",
		result: true,
		yourBet: "yes",
		betAmount: 100,
		potentialWinnings: 800,
		endDate: "2024-03-01",
		yesPercentage: 65,
		totalParticipants: 234,
		totalPool: 23400,
	};

	const handleWithdraw = () => {
		if (selectedNetwork === "worldchain") {
			toast(
				"Coming Soon: Worldchain withdrawals will be supported in the future",
				{
					description: "Please select Optimism network for now.",
				},
			);
			return;
		}

		toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
			loading: "Processing withdrawal...",
			success: "Successfully processed withdrawal!",
			error: "Failed to process withdrawal.",
		});
	};

	return (
		<main className="min-h-screen pb-20">
			<div className="container px-4 py-6 mx-auto max-w-4xl">
				<div className="flex items-center mb-6">
					<Button variant="ghost" size="icon" asChild className="h-10 w-10">
						<Link href="/">
							<ArrowLeft className="h-5 w-5" />
						</Link>
					</Button>
					<h1 className="text-2xl font-bold ml-2">Prediction Result</h1>
				</div>
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>{predictionResult.title}</CardTitle>
						<CardDescription>
							Ended on{" "}
							{new Date(predictionResult.endDate).toLocaleDateString("en-US")}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2 mb-6">
							<div
								className={`p-2 rounded-full ${predictionResult.result ? "bg-green-100" : "bg-red-100"}`}
							>
								{predictionResult.result ? (
									<Check className="h-4 w-4 text-green-500" />
								) : (
									<X className="h-4 w-4 text-red-500" />
								)}
							</div>
							<span className="font-medium">
								Final Result: {predictionResult.result ? "Yes" : "No"}
							</span>
						</div>

						<div className="space-y-4 mb-6">
							<div className="p-4 rounded-lg bg-muted">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-muted-foreground">
											Your Prediction
										</p>
										<p className="font-medium">
											{predictionResult.yourBet.toUpperCase()}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Bet Amount</p>
										<p className="font-medium">
											{predictionResult.betAmount} WLD
										</p>
									</div>
									{/* <div>
                    <p className="text-sm text-muted-foreground">Final Odds</p>
                    <p className="font-medium">Yes {predictionResult.yesPercentage}% / No {100 - predictionResult.yesPercentage}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Participants</p>
                    <p className="font-medium">{predictionResult.totalParticipants}</p>
                  </div> */}
								</div>
							</div>

							<div className="p-4 rounded-lg bg-muted">
								{/* <h3 className="font-medium mb-4">Withdrawal Summary</h3> */}
								<div className="space-y-2">
									{/* <div className="flex justify-between">
                    <span>Original Bet</span>
                    <span>{predictionResult.betAmount} WLD</span>
                  </div> */}
									<div className="flex justify-between">
										<span>Result</span>
										<span
											className={
												predictionResult.result ===
												(predictionResult.yourBet === "yes")
													? "text-green-500"
													: "text-red-500"
											}
										>
											{predictionResult.result ===
											(predictionResult.yourBet === "yes")
												? "Won"
												: "Lost"}
										</span>
									</div>
									<div className="flex justify-between font-medium">
										<span>Available to Withdraw</span>
										<span
											className={
												predictionResult.result ===
												(predictionResult.yourBet === "yes")
													? "text-green-500"
													: "text-red-500"
											}
										>
											{predictionResult.result ===
											(predictionResult.yourBet === "yes")
												? `${predictionResult.potentialWinnings} WLD`
												: "0 WLD"}
										</span>
									</div>

									{predictionResult.result ===
										(predictionResult.yourBet === "yes") && (
										<div className="mt-6">
											<h4 className="font-medium mb-3">
												Select Network for Withdrawal
											</h4>
											<RadioGroup
												defaultValue="optimism"
												className="flex flex-col gap-4"
												onValueChange={handleNetworkChange}
											>
												<div className="flex items-center space-x-3 p-5 border rounded-lg hover:bg-muted cursor-pointer">
													<RadioGroupItem
														value="optimism"
														id="optimism"
														className="h-5 w-5"
													/>
													<div className="flex items-center space-x-3">
														<Image
															src="/opt.png"
															alt="Optimism Logo"
															width={24}
															height={24}
															className="rounded-full"
														/>
														<Label
															htmlFor="optimism"
															className="text-lg cursor-pointer"
														>
															Optimism
														</Label>
													</div>
												</div>
												<div className="flex items-center space-x-3 p-5 border rounded-lg hover:bg-muted cursor-pointer">
													<RadioGroupItem
														value="worldchain"
														id="worldchain"
														className="h-5 w-5"
													/>
													<div className="flex items-center space-x-3">
														<Image
															src="/coin.png"
															alt="Worldcoin Logo"
															width={24}
															height={24}
															className="rounded-full"
														/>
														<Label
															htmlFor="worldchain"
															className="text-lg cursor-pointer"
														>
															Worldchain
														</Label>
													</div>
												</div>
											</RadioGroup>
										</div>
									)}
								</div>
							</div>
						</div>

						<div className=" gap-4">
							<Button
								className="w-full"
								onClick={handleWithdraw}
								disabled={
									predictionResult.result !==
									(predictionResult.yourBet === "yes")
								}
							>
								{predictionResult.result ===
								(predictionResult.yourBet === "yes")
									? `Withdraw to ${selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}`
									: "No Winnings Available"}
							</Button>
							<div className="flex gap-4 items-center justify-center mt-6">
								<p className="text-sm text-muted-foreground">Powered by</p>
								<Image
									src="/hyperlane.png"
									alt="Hyperlane Logo"
									width={120}
									height={30}
									className="rounded-md"
								/>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
			<Navbar />
		</main>
	);
}
