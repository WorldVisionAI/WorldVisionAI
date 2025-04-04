'use client';

import { Navbar } from '@/components/navbar';
import { FloatingHeader } from '@/components/floating-header';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';

export default function Home() {
  const featuredPredictions = [
    {
      id: 1,
      title: 'Will Bitcoin exceed $100,000 by 2025?',
      category: 'Currency',
      yesPercentage: 65,
      endDate: '2025-12-31',
    },
    {
      id: 2,
      title: 'Will the Democratic candidate win the next US presidential election?',
      category: 'Politics',
      yesPercentage: 48,
      endDate: '2024-11-05',
    },
    {
      id: 3,
      title: 'Will a Japanese film win the next Academy Award for Best Picture?',
      category: 'Entertainment',
      yesPercentage: 12,
      endDate: '2025-03-01',
    },
  ];

  return (
    <main className="min-h-screen pb-20">
      <FloatingHeader />
      <div className="container px-4 py-6 mx-auto max-w-4xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-1">
            <h1 className="text-4xl font-bold tracking-tight">WorldVisionAI</h1>
            <Image
              src="/world.png"
              alt="World Vision AI Logo"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          <p className="text-muted-foreground mt-2 max-w-md">
            A new prediction market platform where you can predict the future, place bets, and deeply understand through AI chat
          </p>
          <div className="flex gap-4 mt-6">
            <Button
              onClick={() => {
                document.getElementById('featured-predictions')?.scrollIntoView({
                  behavior: 'smooth'
                });
              }}
            >
              Join Predictions
            </Button>
            <Button variant="outline" asChild>
              <Link href="/chatbot">Ask World AI</Link>
            </Button>
          </div>
        </div>

        <section id="featured-predictions" className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Predictions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredPredictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardHeader className="pb-2">
                  <div>
                    <CardTitle className="text-base">
                      {prediction.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className={`h-2.5 rounded-full ${prediction.yesPercentage >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${prediction.yesPercentage}%` }}
                      />
                    </div>
                    <span className="whitespace-nowrap">{prediction.yesPercentage}% Yes</span>
                  </div>
                  <div className="flex justify-end mb-4">
                    <span className="text-muted-foreground text-sm">
                      Until {new Date(prediction.endDate).toLocaleDateString('en-US')}
                    </span>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/bet/${prediction.id}`}>Join Bet</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-4">
            <Button 
              variant="outline" 
              onClick={() => toast.info('Coming soon! More predictions will be added in the future.')}
            >
              View All Predictions
            </Button>
          </div>
        </section>

        {/* <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">予測を作成</CardTitle>
              <PlusCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                新しい予測トピックを作成し、コミュニティと共有しましょう
              </p>
              <Button
                size="sm"
                className="mt-4 w-full"
                variant="outline"
                asChild
              >
                <Link href="/launch">作成する</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">賭けに参加</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                様々なトピックに対して予測を行い、賭けに参加しましょう
              </p>
              <Button
                size="sm"
                className="mt-4 w-full"
                variant="outline"
                asChild
              >
                <Link href="/bet">参加する</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">結果を確認</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                過去の予測結果を確認し、あなたの成績を見てみましょう
              </p>
              <Button
                size="sm"
                className="mt-4 w-full"
                variant="outline"
                asChild
              >
                <Link href="/results">確認する</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                AIとチャット
              </CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                予測に関する質問や詳細情報をAIチャットボットに尋ねましょう
              </p>
              <Button
                size="sm"
                className="mt-4 w-full"
                variant="outline"
                asChild
              >
                <Link href="/chatbot">チャットする</Link>
              </Button>
            </CardContent>
          </Card>
        </section> */}
      </div>
      <Navbar />
    </main>
  );
}
