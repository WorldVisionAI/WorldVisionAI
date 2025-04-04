'use client';

import type React from 'react';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useChat } from 'ai/react';
import { Bot, SendHorizontal, Sparkles, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function ChatbotPage() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: topic
        ? [
            {
              id: '1',
              role: 'system',
              content:
                'あなたはWorldvisionAIの予測市場アシスタントです。ユーザーの質問に対して、予測市場や経済、政治、エンターテイメントなどの分野に関する情報を提供してください。予測に関する分析や背景情報を詳しく説明し、ユーザーが賢明な判断を下せるようサポートしてください。',
            },
            {
              id: '2',
              role: 'user',
              content: `「${topic}」について詳しく教えてください。この予測に関連する背景情報や、考慮すべき要素を教えてください。`,
            },
          ]
        : [
            {
              id: '1',
              role: 'system',
              content:
                'あなたはWorldvisionAIの予測市場アシスタントです。ユーザーの質問に対して、予測市場や経済、政治、エンターテイメントなどの分野に関する情報を提供してください。予測に関する分析や背景情報を詳しく説明し、ユーザーが賢明な判断を下せるようサポートしてください。',
            },
            {
              id: '2',
              role: 'assistant',
              content:
                'こんにちは！WorldvisionAIのアシスタントです。予測市場や現在のトピックについて何か質問がありますか？経済、政治、エンターテイメント、テクノロジーなど、様々な分野についてお答えできます。',
            },
          ],
    });

  const [suggestedQuestions, setSuggestedQuestions] = useState([
    'ビットコインの将来価格について教えてください',
    '次の大統領選挙の見通しはどうですか？',
    '予測市場の仕組みを説明してください',
    '投資判断をする際に考慮すべき要素は？',
  ]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSuggestedQuestion = (question: string) => {
    const fakeEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>;

    // Set the input value to the suggested question
    handleInputChange({
      target: { value: question },
    } as React.ChangeEvent<HTMLInputElement>);

    // Submit the form with the suggested question
    setTimeout(() => {
      handleSubmit(fakeEvent);
    }, 100);
  };

  return (
    <main className="min-h-screen pb-20">
      <div className="container px-4 py-6 mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          AIチャットボット
        </h1>

        <Card className="mb-4 shadow-sm">
          <CardContent className="p-4">
            <p className="text-base text-muted-foreground">
              予測に関する質問や、背景情報について気軽に質問してください。AIが最新の情報と分析を提供します。
            </p>
          </CardContent>
        </Card>

        <div className="bg-muted rounded-lg p-4 mb-4 h-[60vh] overflow-y-auto">
          {messages
            .filter((message) => message.role !== 'system')
            .map((message, index) => (
              <div
                key={message.id || `message-${index}-${message.role}`}
                className={`flex mb-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex max-w-[85%] ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`flex items-center justify-center h-10 w-10 rounded-full ${
                      message.role === 'user'
                        ? 'bg-primary ml-2'
                        : 'bg-secondary mr-2'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <Bot className="h-5 w-5 text-secondary-foreground" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg text-base ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-secondary mr-2">
                  <Bot className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="p-3 rounded-lg bg-secondary text-secondary-foreground">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-current rounded-full animate-bounce" />
                    <div
                      className="h-2 w-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="h-2 w-2 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length <= 3 && (
          <div className="mb-4">
            <p className="text-base font-medium mb-2 flex items-center">
              <Sparkles className="h-4 w-4 mr-1 text-primary" />
              おすすめの質問
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={`question-${index}-${question}`}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-sm"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="質問を入力してください..."
            className="flex-1 h-12 text-base"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="lg">
            <SendHorizontal className="h-5 w-5 mr-2" />
            送信
          </Button>
        </form>
      </div>
      <Navbar />
    </main>
  );
}
