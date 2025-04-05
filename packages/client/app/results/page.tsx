import { Navbar } from "@/components/navbar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Check, TrendingUp, X } from "lucide-react";

export default function ResultsPage() {
	const completedPredictions = [
		{
			id: 101,
			title: "Will Bitcoin exceed $50,000 by the end of 2023?",
			category: "Forex",
			result: true,
			yourBet: "yes",
			betAmount: 100,
			winnings: 80,
			endDate: "2023-12-31",
			yesPercentage: 62,
		},
		{
			id: 102,
			title:
				"Will the FRB decide to cut interest rates at the January 2024 meeting?",
			category: "Forex",
			result: false,
			yourBet: "no",
			betAmount: 200,
			winnings: 120,
			endDate: "2024-01-31",
			yesPercentage: 38,
		},
		{
			id: 103,
			title:
				'Will "Oppenheimer" win the Academy Award for Best Picture in 2023?',
			category: "Entertainment",
			result: true,
			yourBet: "no",
			betAmount: 150,
			winnings: -150,
			endDate: "2024-03-10",
			yesPercentage: 75,
		},
	];

	const userStats = {
		totalBets: 15,
		correctPredictions: 9,
		accuracy: 60,
		totalWinnings: 1250,
		rank: 342,
		totalUsers: 5432,
	};

	return (
		<main className="min-h-screen pb-20">
			<div className="container px-4 py-6 mx-auto max-w-4xl">
				<h1 className="text-2xl font-bold mb-6 text-center">
					Prediction Results
				</h1>

				<Tabs defaultValue="results" className="mb-6">
					<TabsList className="grid grid-cols-2 mb-4">
						<TabsTrigger value="results">Results</TabsTrigger>
						<TabsTrigger value="stats">Statistics</TabsTrigger>
					</TabsList>

					<TabsContent value="results">
						<div className="grid gap-4">
							{completedPredictions.map((prediction) => (
								<Card key={prediction.id}>
									<CardHeader className="pb-2">
										<div className="flex justify-between items-start">
											<div>
												<CardTitle className="text-base">
													{prediction.title}
												</CardTitle>
												<CardDescription>
													End Date:{" "}
													{new Date(prediction.endDate).toLocaleDateString(
														"en-US",
													)}
												</CardDescription>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<div className="flex justify-between items-center mb-4">
											<div className="flex items-center">
												<div
													className={`p-2 rounded-full ${
														prediction.result ? "bg-green-100" : "bg-red-100"
													} mr-2`}
												>
													{prediction.result ? (
														<Check className="h-4 w-4 text-green-500" />
													) : (
														<X className="h-4 w-4 text-red-500" />
													)}
												</div>
												<span>Result: {prediction.result ? "Yes" : "No"}</span>
											</div>
										</div>

										<div className="text-sm text-right text-muted-foreground mb-4">
											Final Odds: Yes {prediction.yesPercentage}% / No{" "}
											{100 - prediction.yesPercentage}%
										</div>

										<div className="p-3 rounded-lg bg-muted mb-4">
											<div className="flex justify-between mb-1">
												<span>Your Prediction:</span>
												<span
													className={
														prediction.yourBet === "yes"
															? "text-green-500"
															: "text-red-500"
													}
												>
													{prediction.yourBet === "yes" ? "Yes" : "No"}
												</span>
											</div>
											<div className="flex justify-between mb-1">
												<span>Bet Amount:</span>
												<span>{prediction.betAmount} WLD</span>
											</div>
											<div className="flex justify-between">
												<span>Result:</span>
												<span
													className={
														prediction.winnings > 0
															? "text-green-500"
															: "text-red-500"
													}
												>
													{prediction.winnings > 0
														? `+${prediction.winnings}`
														: prediction.winnings}{" "}
													WLD
												</span>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</TabsContent>

					<TabsContent value="stats">
						<Card className="mb-6">
							<CardHeader>
								<CardTitle>Your Prediction Statistics</CardTitle>
								<CardDescription>
									Overview of your prediction performance
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 gap-4">
									<div className="p-4 rounded-lg bg-muted">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-muted-foreground">
													Total Bets
												</p>
												<h3 className="text-2xl font-bold">
													{userStats.totalBets}
												</h3>
											</div>
											<BarChart3 className="h-8 w-8 text-primary opacity-70" />
										</div>
									</div>
									<div className="p-4 rounded-lg bg-muted">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-muted-foreground">
													Accuracy
												</p>
												<h3 className="text-2xl font-bold">
													{userStats.accuracy}%
												</h3>
											</div>
											<div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/20">
												<Check className="h-5 w-5 text-primary" />
											</div>
										</div>
									</div>
									<div className="p-4 rounded-lg bg-muted">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-muted-foreground">
													Total Points Earned
												</p>
												<h3 className="text-2xl font-bold">
													{userStats.totalWinnings}
												</h3>
											</div>
											<TrendingUp className="h-8 w-8 text-green-500" />
										</div>
									</div>
									<div className="p-4 rounded-lg bg-muted">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-muted-foreground">Ranking</p>
												<h3 className="text-2xl font-bold">
													{userStats.rank}/{userStats.totalUsers}
												</h3>
											</div>
											<TrendingUp className="h-8 w-8 text-primary opacity-70" />
										</div>
									</div>
								</div>

								<div className="mt-6">
									<h3 className="font-medium mb-2">Performance by Category</h3>
									<div className="space-y-2">
										<div>
											<div className="flex justify-between text-sm mb-1">
												<span>Politics</span>
												<span>75% Correct</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
												<div
													className="bg-primary h-2 rounded-full"
													style={{ width: "75%" }}
												/>
											</div>
										</div>
										<div>
											<div className="flex justify-between text-sm mb-1">
												<span>Forex & Finance</span>
												<span>60% Correct</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
												<div
													className="bg-primary h-2 rounded-full"
													style={{ width: "60%" }}
												/>
											</div>
										</div>
										<div>
											<div className="flex justify-between text-sm mb-1">
												<span>Entertainment</span>
												<span>40% Correct</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
												<div
													className="bg-primary h-2 rounded-full"
													style={{ width: "40%" }}
												/>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
			<Navbar />
		</main>
	);
}
