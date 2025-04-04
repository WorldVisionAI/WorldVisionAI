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

// Mock data - in a real app, you would fetch this from an API
const getPredictionById = (id: string) => {
  const predictions = [
    {
      id: '1',
      title: '2025年までにビットコインは10万ドルを超えるか？',
      description:
        '2025年12月31日までに、ビットコインの価格が一度でも10万米ドルを超えた場合、この予測はYesとなります。主要な取引所（Binance、Coinbase、Krakenなど）の価格を参照します。',
      category: '為替',
      yesPercentage: 65,
      endDate: '2025-12-31',
      participants: 1243,
      history: [
        { date: '2024-01-01', yesPercentage: 45, participants: 120 },
        { date: '2024-02-01', yesPercentage: 48, participants: 245 },
        { date: '2024-03-01', yesPercentage: 52, participants: 410 },
        { date: '2024-04-01', yesPercentage: 58, participants: 620 },
        { date: '2024-05-01', yesPercentage: 62, participants: 890 },
        { date: '2024-06-01', yesPercentage: 65, participants: 1243 },
      ],
    },
    {
      id: '2',
      title: '次期アメリカ大統領選挙で民主党候補が勝利するか？',
      description:
        '2024年11月に行われるアメリカ合衆国大統領選挙において、民主党の候補者が勝利した場合、この予測はYesとなります。選挙人団の過半数を獲得し、正式に次期大統領として認められることを条件とします。',
      category: '政治',
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
      title: '次回の映画アカデミー賞作品賞を日本映画が受賞するか？',
      description:
        '2025年に開催される第97回アカデミー賞において、日本映画（日本で制作され、主に日本語で撮影された映画）が作品賞を受賞した場合、この予測はYesとなります。',
      category: 'エンタメ',
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
    },
    {
      id: '4',
      title: '2024年内にAppleが折りたたみiPhoneを発売するか？',
      description:
        '2024年12月31日までに、Appleが公式に折りたたみ式のiPhoneを発表し、一般販売を開始した場合、この予測はYesとなります。プロトタイプや限定版は含みません。',
      category: 'テクノロジー',
      yesPercentage: 35,
      endDate: '2024-12-31',
      participants: 2145,
      history: [
        { date: '2023-10-01', yesPercentage: 25, participants: 320 },
        { date: '2023-11-01', yesPercentage: 28, participants: 560 },
        { date: '2023-12-01', yesPercentage: 30, participants: 890 },
        { date: '2024-01-01', yesPercentage: 32, participants: 1240 },
        { date: '2024-02-01', yesPercentage: 34, participants: 1780 },
        { date: '2024-03-01', yesPercentage: 35, participants: 2145 },
      ],
    },
    {
      id: '5',
      title: '次回の東京オリンピックで日本のメダル獲得数は前回を上回るか？',
      description:
        '2028年ロサンゼルスオリンピックにおいて、日本選手団のメダル獲得総数が2021年東京オリンピックでの58個を上回った場合、この予測はYesとなります。',
      category: 'スポーツ',
      yesPercentage: 72,
      endDate: '2028-08-11',
      participants: 1532,
      history: [
        { date: '2023-08-01', yesPercentage: 60, participants: 210 },
        { date: '2023-10-01', yesPercentage: 63, participants: 450 },
        { date: '2023-12-01', yesPercentage: 67, participants: 780 },
        { date: '2024-02-01', yesPercentage: 70, participants: 1100 },
        { date: '2024-04-01', yesPercentage: 72, participants: 1532 },
      ],
    },
  ];

  return predictions.find((p) => p.id === id);
};

export default function BetDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const prediction = getPredictionById(id);

  const [betAmount, setBetAmount] = useState('1');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [betChoice, setBetChoice] = useState<'yes' | 'no' | null>(null);
  const [betPlaced, setBetPlaced] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isFreeSpecialBet, setIsFreeSpecialBet] = useState(false);
  const [showSwipeCard, setShowSwipeCard] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

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

  const confirmBet = () => {
    if (!isVerified) {
      return;
    }
    // Here you would typically send the bet to your backend
    console.log(`Placed ${isFreeSpecialBet ? 'FREE SPECIAL' : ''} bet of ${betAmount} points on ${betChoice} for prediction ${id}`);
    setBetPlaced(true);
  };

  if (!prediction) {
    return (
      <main className="min-h-screen pb-20">
        <div className="container px-4 py-6 mx-auto max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            予測が見つかりません
          </h1>
          <Button asChild>
            <Link href="/bet">予測一覧に戻る</Link>
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
              <Link href="/bet">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold ml-2">ベット完了</h1>
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
                あなたは「{betChoice === 'yes' ? 'はい' : 'いいえ'}」に
                {betAmount}WLD賭けました
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>現在のオッズ:</span>
                  <span>
                    Yes: {prediction.yesPercentage}% / No:{' '}
                    {100 - prediction.yesPercentage}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>終了日:</span>
                  <span>
                    {new Date(prediction.endDate).toLocaleDateString('ja-JP')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>参加者数:</span>
                  <span>{prediction.participants.toLocaleString()}人</span>
                </div>
              </div>
            </CardContent>
          </Card>
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
            <Link href="/bet">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold ml-2">予測の詳細</h1>
        </div>

        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">{prediction.title}</CardTitle>
            <CardDescription className="text-base">
              カテゴリー: {prediction.category} | 終了日:{' '}
              {new Date(prediction.endDate).toLocaleDateString('ja-JP')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="mb-4">
              <AccordionItem value="description">
                <AccordionTrigger className="text-sm py-2">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    予測の詳細
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm">{prediction.description}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Yes {prediction.yesPercentage}%</span>
                <span>No {100 - prediction.yesPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                <div
                  className="bg-primary h-3 rounded-full"
                  style={{ width: `${prediction.yesPercentage}%` }}
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              現在 {prediction.participants.toLocaleString()} 人が参加中
            </div>
          </CardContent>
        </Card>

        {showConfirmation ? (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">ベットの確認</CardTitle>
              <CardDescription className="text-base">
                以下の内容で賭けを行います。確認してください。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">{prediction.title}</h3>
                <p className="text-sm text-muted-foreground">
                  カテゴリー: {prediction.category} | 終了日:{' '}
                  {new Date(prediction.endDate).toLocaleDateString('ja-JP')}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex justify-between mb-2">
                  <span>あなたの選択:</span>
                  <span
                    className={
                      betChoice === 'yes'
                        ? 'text-green-500 font-bold'
                        : 'text-red-500 font-bold'
                    }
                  >
                    {betChoice === 'yes' ? 'はい (Yes)' : 'いいえ (No)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ベット種別:</span>
                  <span className={isFreeSpecialBet ? "text-purple-600 font-bold" : ""}>
                    {isFreeSpecialBet ? '特別無料ベット' : '通常ベット'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ベット額:</span>
                  <span>{betAmount} WLD</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowConfirmation(false)}
              >
                キャンセル
              </Button>
              <Button size="lg" onClick={confirmBet}>
                確定する
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="normal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="normal">通常ベット</TabsTrigger>
                <TabsTrigger value="worldid">World ID認証</TabsTrigger>
              </TabsList>

              <TabsContent value="normal">
                <Card className="mb-6 mt-3 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">ベット額を設定</CardTitle>
                    <CardDescription className="text-base">
                      賭けるWLD数を入力してください
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="amount" className="text-base">
                          WLD数
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
                      <CardTitle className="text-xl">World ID認証で特典を獲得</CardTitle>
                      <CardDescription className="text-base">
                        World IDで認証すると、1日1回無料の特別ベットができます！
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
                        特別ベット枠
                      </CardTitle>
                      <CardDescription className="text-base">
                        認証済みユーザー限定の無料ベット枠が利用可能です
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full"
                        variant={isFreeSpecialBet ? "secondary" : "default"}
                        onClick={() => {
                          setIsFreeSpecialBet(!isFreeSpecialBet);
                          if (!isFreeSpecialBet) {
                            setBetAmount('100');
                          }
                        }}
                      >
                        {isFreeSpecialBet ? '通常ベットに切り替え' : '特別ベットを使用'}
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
                    左右にスワイプして予測
                  </h2>
                  <p className="text-base text-muted-foreground">
                    右にスワイプで「はい」、左にスワイプで「いいえ」
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
