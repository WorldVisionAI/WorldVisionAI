import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Check, TrendingUp, X } from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage() {
  const completedPredictions = [
    {
      id: 101,
      title: '2023年内にビットコインは5万ドルを超えるか？',
      category: '為替',
      result: true,
      yourBet: 'yes',
      betAmount: 100,
      winnings: 80,
      endDate: '2023-12-31',
      yesPercentage: 62,
    },
    {
      id: 102,
      title: '2024年1月のFRB会合で利下げが決定されるか？',
      category: '為替',
      result: false,
      yourBet: 'no',
      betAmount: 200,
      winnings: 120,
      endDate: '2024-01-31',
      yesPercentage: 38,
    },
    {
      id: 103,
      title: '2023年アカデミー賞作品賞を「オッペンハイマー」が受賞するか？',
      category: 'エンタメ',
      result: true,
      yourBet: 'no',
      betAmount: 150,
      winnings: -150,
      endDate: '2024-03-10',
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
        <h1 className="text-2xl font-bold mb-6 text-center">予測結果</h1>

        <Tabs defaultValue="results" className="mb-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="results">結果</TabsTrigger>
            <TabsTrigger value="stats">統計</TabsTrigger>
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
                          終了日:{' '}
                          {new Date(prediction.endDate).toLocaleDateString(
                            'ja-JP',
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
                            prediction.result ? 'bg-green-100' : 'bg-red-100'
                          } mr-2`}
                        >
                          {prediction.result ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <span>結果: {prediction.result ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="text-sm">
                        最終オッズ: Yes {prediction.yesPercentage}% / No{' '}
                        {100 - prediction.yesPercentage}%
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-muted mb-4">
                      <div className="flex justify-between mb-1">
                        <span>あなたの予測:</span>
                        <span
                          className={
                            prediction.yourBet === 'yes'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }
                        >
                          {prediction.yourBet === 'yes' ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>ベット額:</span>
                        <span>{prediction.betAmount} ポイント</span>
                      </div>
                      <div className="flex justify-between">
                        <span>結果:</span>
                        <span
                          className={
                            prediction.winnings > 0
                              ? 'text-green-500'
                              : 'text-red-500'
                          }
                        >
                          {prediction.winnings > 0
                            ? `+${prediction.winnings}`
                            : prediction.winnings}{' '}
                          ポイント
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
                <CardTitle>あなたの予測統計</CardTitle>
                <CardDescription>これまでの予測成績の概要</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          総ベット数
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
                        <p className="text-sm text-muted-foreground">正解率</p>
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
                          総獲得ポイント
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
                        <p className="text-sm text-muted-foreground">
                          ランキング
                        </p>
                        <h3 className="text-2xl font-bold">
                          {userStats.rank}/{userStats.totalUsers}
                        </h3>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary opacity-70" />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">カテゴリー別成績</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>政治</span>
                        <span>75% 正解</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: '75%' }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>為替・金融</span>
                        <span>60% 正解</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: '60%' }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>エンタメ</span>
                        <span>40% 正解</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: '40%' }}
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
