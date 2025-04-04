'use client';

import type React from 'react';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { CalendarIcon, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function LaunchPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({ title, description, category, date });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen pb-20">
        <div className="container px-4 py-6 mx-auto max-w-md flex flex-col items-center justify-center min-h-[80vh]">
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-col items-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <CardTitle>予測が作成されました！</CardTitle>
                <CardDescription>
                  あなたの予測が正常に作成され、公開されました。
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-muted-foreground mb-4">
                カテゴリー: {category} | 終了日:{' '}
                {date
                  ? format(date, 'yyyy年MM月dd日', { locale: ja })
                  : '未設定'}
              </p>
              <p className="text-sm">{description}</p>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                別の予測を作成
              </Button>
              <Button asChild>
                <a href="/">賭けページへ</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <Navbar />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="container px-4 py-6 mx-auto max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          新しい予測を作成
        </h1>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>予測の詳細</CardTitle>
              <CardDescription>
                新しい予測トピックの詳細を入力してください。
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">予測タイトル</Label>
                <Input
                  id="title"
                  placeholder="例: 2025年までにビットコインは10万ドルを超えるか？"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">詳細説明</Label>
                <Textarea
                  id="description"
                  placeholder="予測の詳細や条件を説明してください"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">カテゴリー</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="カテゴリーを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="politics">政治</SelectItem>
                    <SelectItem value="entertainment">エンタメ</SelectItem>
                    <SelectItem value="finance">為替・金融</SelectItem>
                    <SelectItem value="technology">テクノロジー</SelectItem>
                    <SelectItem value="sports">スポーツ</SelectItem>
                    <SelectItem value="other">その他</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">終了日</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date
                        ? format(date, 'yyyy年MM月dd日', { locale: ja })
                        : '日付を選択'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={ja}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                予測を作成
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
      <Navbar />
    </main>
  );
}
