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
import Link from 'next/link';

export default function BetPage() {
  const predictions = [
    {
      id: 1,
      title: '2025年までにビットコインは10万ドルを超えるか？',
      category: '為替',
      yesPercentage: 65,
      endDate: '2025-12-31',
      participants: 1243,
    },
    {
      id: 2,
      title: '次期アメリカ大統領選挙で民主党候補が勝利するか？',
      category: '政治',
      yesPercentage: 48,
      endDate: '2024-11-05',
      participants: 3567,
    },
    {
      id: 3,
      title: '次回の映画アカデミー賞作品賞を日本映画が受賞するか？',
      category: 'エンタメ',
      yesPercentage: 12,
      endDate: '2025-03-01',
      participants: 876,
    },
    {
      id: 4,
      title: '2024年内にAppleが折りたたみiPhoneを発売するか？',
      category: 'テクノロジー',
      yesPercentage: 35,
      endDate: '2024-12-31',
      participants: 2145,
    },
    {
      id: 5,
      title: '次回の東京オリンピックで日本のメダル獲得数は前回を上回るか？',
      category: 'スポーツ',
      yesPercentage: 72,
      endDate: '2028-08-11',
      participants: 1532,
    },
  ];

  const categories = [
    { id: 'all', name: 'すべて' },
    { id: 'politics', name: '政治' },
    { id: 'entertainment', name: 'エンタメ' },
    { id: 'finance', name: '為替・金融' },
    { id: 'technology', name: 'テクノロジー' },
    { id: 'sports', name: 'スポーツ' },
  ];

  return (
    <main className="min-h-screen pb-20">
      <div className="container px-4 py-6 mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">予測に賭ける</h1>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="flex overflow-x-auto hide-scrollbar mb-4 pb-1">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="min-w-max"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid gap-4">
                {predictions
                  .filter(
                    (p) =>
                      category.id === 'all' ||
                      p.category.toLowerCase() === category.id,
                  )
                  .map((prediction) => (
                    <Card key={prediction.id} className="shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">
                              {prediction.title}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              終了日:{' '}
                              {new Date(prediction.endDate).toLocaleDateString(
                                'ja-JP',
                              )}{' '}
                              | 参加者:{' '}
                              {prediction.participants.toLocaleString()}人
                            </CardDescription>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {prediction.category}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
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
                        <Button className="w-full h-12 text-base" asChild>
                          <Link href={`/bet/${prediction.id}`}>賭けに参加</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <Navbar />
    </main>
  );
}
