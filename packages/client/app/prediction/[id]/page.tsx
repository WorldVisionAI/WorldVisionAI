'use client';

import { Navbar } from '@/components/navbar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowLeft, Check, Info, X } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { SwipeCard } from './swipe-card';
import { VerifyBlock } from '@/components/Verify';
import { PayBlock } from '@/components/Pay';
import { useWalletStore } from '@/store/wallet';
import { usePredictionContract } from '@/hooks/usePredictionContract';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCoolMode } from '@/hooks/useCoolMode';

// Mock data - in a real app, you would fetch this from an API
const getPredictionById = (id: string) => {
  const predictions = [
    {
      id: '1',
      title: 'Will Bitcoin exceed $100,000 by 2025?',
      description:
        'This prediction will be Yes if Bitcoin price exceeds $100,000 USD at any point before December 31, 2025. Reference prices will be taken from major exchanges (Binance, Coinbase, Kraken, etc.).',
      category: 'Currency',
      endDate: '2025-12-31',
      participants: 1243,
      history: [
        { date: '2024-01-01', yesPercentage: 35, participants: 120 },
        { date: '2024-02-01', yesPercentage: 68, participants: 245 },
        { date: '2024-03-01', yesPercentage: 42, participants: 410 },
        { date: '2024-04-01', yesPercentage: 28, participants: 620 },
        { date: '2024-05-01', yesPercentage: 52, participants: 890 },
        { date: '2024-06-01', yesPercentage: 85, participants: 1243 },
      ],
    },
    {
      id: '2',
      title: 'Will the Democratic candidate win the next US presidential election?',
      description:
        'This prediction will be Yes if the Democratic Party candidate wins the US presidential election in November 2024. The condition is winning the majority of electoral college votes and being officially recognized as president-elect.',
      category: 'Politics',
      yesPercentage: 48,
      endDate: '2024-11-05',
      participants: 3567,
      history: [
        { date: '2023-11-01', yesPercentage: 55, participants: 450 },
        { date: '2023-12-01', yesPercentage: 53, participants: 780 },
        { date: '2024-01-01', yesPercentage: 51, participants: 1200 },
        { date: '2024-02-01', yesPercentage: 49, participants: 1850 },
        { date: '2024-03-01', yesPercentage: 47, participants: 2400 },
        { date: '2024-04-01', yesPercentage: 48, participants: 3567 },
      ],
    },
    {
      id: '3',
      title: 'Will a Japanese film win the next Academy Award for Best Picture?',
      description:
        'This prediction will be Yes if a Japanese film (produced in Japan and primarily filmed in Japanese) wins Best Picture at the 97th Academy Awards in 2025.',
      category: 'Entertainment',
      yesPercentage: 12,
      endDate: '2025-03-01',
      participants: 876,
      history: [
        { date: '2024-01-01', yesPercentage: 8, participants: 120 },
        { date: '2024-02-01', yesPercentage: 9, participants: 230 },
        { date: '2024-03-01', yesPercentage: 10, participants: 450 },
        { date: '2024-04-01', yesPercentage: 11, participants: 670 },
        { date: '2024-05-01', yesPercentage: 12, participants: 876 },
      ],
    }
  ];

  return predictions.find((p) => p.id === id);
};

export default function BetDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const prediction = getPredictionById(id);
  const { yesPercentage, loading, error } = usePredictionContract(parseInt(id));
  const userName = useWalletStore((state: any) => state.userName);
  const walletAddress = useWalletStore((state: any) => state.walletAddress);
  const buttonRef = useCoolMode("/coin.png");

  const [betAmount, setBetAmount] = useState('1');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [betChoice, setBetChoice] = useState<'yes' | 'no' | null>(null);
  const [betPlaced, setBetPlaced] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isFreeSpecialBet, setIsFreeSpecialBet] = useState(false);
  const [showSwipeCard, setShowSwipeCard] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const handleSwipe = (direction: 'yes' | 'no') => {
    if (!isVerified && !isPaid) {
      return;
    }
    setBetChoice(direction);
    setShowConfirmation(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaid(true);
    setShowSwipeCard(true);
  };

  const confirmBet = async () => {
    if (isFreeSpecialBet && !isVerified) {
      return;
    }
    if (!prediction) {
      return;
    }
    setIsConfirming(true);
    try {
      // Record the prediction in Google Spreadsheet and on-chain
      const response = await fetch('/api/record-prediction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createDate: new Date().toISOString(),
          walletAddress: walletAddress,
          isSpecialBet: isFreeSpecialBet,
          isYes: betChoice === 'yes',
          amount: betAmount,
          predictionId: parseInt(id),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to record prediction');
      }

      setTransactionHash(result.transactionHash);
      console.log(`Placed ${isFreeSpecialBet ? 'FREE SPECIAL' : ''} prediction of ${betAmount} points on ${betChoice} for prediction ${id}. Transaction hash: ${result.transactionHash}`);
      setBetPlaced(true);
    } catch (error: any) {
      console.error('Error confirming bet:', error);
      // TODO: Show error toast or modal to user
      alert(error.message || 'Failed to place bet. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  if (!prediction) {
    return (
      <main className="min-h-screen pb-20">
        <div className="container px-4 py-6 mx-auto max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Prediction not found
          </h1>
          <Button asChild>
            <Link href="/">Back to Predictions</Link>
          </Button>
        </div>
        <Navbar />
      </main>
    );
  }

  if (betPlaced) {
    return (
      <main className="min-h-screen pb-20">
        <div className="container px-4 py-6 mx-auto max-w-md">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold ml-2">Bet Complete</h1>
          </div>

          <Card className="mb-6 shadow-sm">
            <CardHeader>
              <div className="flex justify-center items-center mb-4">
                {betChoice === 'yes' ? (
                  <div className="bg-green-100 p-5 rounded-full">
                    <Check className="h-14 w-14 text-green-500" />
                  </div>
                ) : (
                  <div className="bg-red-100 p-5 rounded-full">
                    <X className="h-14 w-14 text-red-500" />
                  </div>
                )}
              </div>
              <CardTitle className="text-center text-xl">
                {prediction.title}
              </CardTitle>
              <CardDescription className="text-center text-base mt-2">
                You prediction {betAmount}WLD on "{betChoice === 'yes' ? 'Yes' : 'No'}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Current Odds:</span>
                  <span>
                    Yes: {yesPercentage.toFixed(1)}% / No:{' '}
                    {(100 - yesPercentage).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>End Date:</span>
                  <span>
                    {new Date(prediction.endDate).toLocaleDateString('en-US')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Participants:</span>
                  <span>{prediction.participants.toLocaleString()} people</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {transactionHash && (
            <Card className="shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
              <Link 
                href={`https://worldscan.org/tx/${transactionHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Details</CardTitle>
                  <CardDescription>Click to view on Explorer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-3 rounded-lg break-all font-mono text-sm">
                    {transactionHash}
                  </div>
                </CardContent>
              </Link>
            </Card>
          )}
        </div>
        <Navbar />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="container px-4 py-6 mx-auto max-w-md">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild className="h-10 w-10">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-2">Prediction Details</h1>
        </div>

        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{prediction.title}</CardTitle>
            <CardDescription className="text-base">
              Category: {prediction.category} | End Date:{' '}
              {new Date(prediction.endDate).toLocaleDateString('en-US')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="mb-4">
              <AccordionItem value="description">
                <AccordionTrigger className="text-sm py-2">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Prediction Details
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">{prediction.description}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mb-4">
              {loading ? (
                <div className="w-full h-3 bg-gray-200 animate-pulse rounded-full" />
              ) : error ? (
                <div className="text-red-500 text-sm">Failed to load prediction data</div>
              ) : (
                <>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Yes {yesPercentage.toFixed(1)}%</span>
                    <span>No {(100 - yesPercentage).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                    <div
                      className={`h-3 rounded-full ${yesPercentage >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${yesPercentage}%` }}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              {prediction.participants.toLocaleString()} people participating
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Prediction History</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      ...prediction.history.slice(0, -1),
                      {
                        date: new Date().toISOString().split('T')[0],
                        yesPercentage: loading ? prediction.history[prediction.history.length - 1].yesPercentage : yesPercentage,
                        participants: prediction.participants
                      }
                    ]}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 10,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, 'Yes Percentage']}
                      labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    />
                    <Line
                      type="natural"
                      dataKey="yesPercentage"
                      stroke="#000000"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#000000" }}
                      activeDot={{ r: 6, fill: "#000000" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {showConfirmation ? (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Confirm Your Bet</CardTitle>
              <CardDescription className="text-base">
                Please confirm your prediction details below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{prediction.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Category: {prediction.category} | End Date:{' '}
                  {new Date(prediction.endDate).toLocaleDateString('en-US')}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex justify-between mb-2">
                  <span>Your Choice:</span>
                  <span
                    className={
                      betChoice === 'yes'
                        ? 'text-green-500 font-bold'
                        : 'text-red-500 font-bold'
                    }
                  >
                    {betChoice === 'yes' ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Bet Type:</span>
                  <span className={isFreeSpecialBet ? "text-purple-600 font-bold" : ""}>
                    {isFreeSpecialBet ? 'Special Free Bet' : 'Regular Bet'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Bet Amount:</span>
                  <span>{betAmount} WLD</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowConfirmation(false)}
                disabled={isConfirming}
              >
                Cancel
              </Button>
              <Button 
                size="lg" 
                onClick={confirmBet}
                disabled={isConfirming}
              >
                {isConfirming ? 'Confirming...' : 'Confirm'}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="normal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="normal">Regular Bet</TabsTrigger>
                <TabsTrigger value="worldid">World ID Verification</TabsTrigger>
              </TabsList>

              <TabsContent value="normal">
                <Card className="mb-6 mt-3 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Set Bet Amount</CardTitle>
                    <CardDescription className="text-base">
                      Enter the amount of WLD you want to prediction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="amount" className="text-base">
                          WLD Amount
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          value={betAmount}
                          onChange={(e) => setBetAmount(e.target.value)}
                          min="10"
                          step="10"
                          className="text-lg h-12 mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setBetAmount('1')}
                        >
                          1
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setBetAmount('5')}
                        >
                          5
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setBetAmount('10')}
                        >
                          10
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => setBetAmount('50')}
                        >
                          50
                        </Button>
                      </div>
                      {!isPaid && (
                        <div className="mt-4">
                          <PayBlock onSuccess={handlePaymentSuccess} amount={parseInt(betAmount)} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="worldid">
                {!isVerified ? (
                  <Card className="mb-6 mt-3 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl">Get Benefits with World ID Verification</CardTitle>
                      <CardDescription className="text-base">
                        Verify with World ID to get one free special prediction per day!
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center">
                        <VerifyBlock onVerificationSuccess={() => setIsVerified(true)} />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="mb-6 mt-3 shadow-sm bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        Special Bet Available
                      </CardTitle>
                      <CardDescription className="text-base">
                        Free prediction slot available for verified users
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full"
                        variant={isFreeSpecialBet ? "secondary" : "default"}
                        onClick={() => {
                          setIsFreeSpecialBet(!isFreeSpecialBet);
                          if (!isFreeSpecialBet) {
                            setBetAmount('1');
                          }
                        }}
                      >
                        {isFreeSpecialBet ? 'Switch to Regular Bet' : 'Use Special Bet'}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {(showSwipeCard || isVerified) && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-medium mb-2">
                    Swipe to Make Your Prediction
                  </h2>
                  <p className="text-base text-muted-foreground">
                    Swipe right for "Yes", left for "No"
                  </p>
                </div>

                <SwipeCard title={prediction.title} onSwipe={handleSwipe} />
              </>
            )}
          </>
        )}
      </div>
      <Navbar />
    </main>
  );
}
