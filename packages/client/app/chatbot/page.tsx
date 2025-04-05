'use client';

import type React from 'react';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, SendHorizontal, Sparkles, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SUGGESTED_QUESTIONS = ['Tell me about the future price of Bitcoin.'];

const MARKET_DATA = {
  market_name: 'Will Bitcoin exceed $100,000 by 2025?',
  current_forecast: {
    yes: 68.5,
    no: 31.5,
  },
  forecast_history: [
    { date: '2025-01-01', yes: 45.0, no: 55.0 },
    { date: '2025-01-02', yes: 47.2, no: 52.8 },
    { date: '2025-01-03', yes: 50.1, no: 49.9 },
    { date: '2025-03-30', yes: 68.5, no: 31.5 },
  ],
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatbotPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm WorldVisionAI's assistant. Do you have any questions about prediction markets or current topics? I can provide information on various areas, such as economics, politics, entertainment, and technology.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await fetch(
        'https://3eg04e3frd.execute-api.us-east-1.amazonaws.com/world-vision-ai',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: Math.random().toString(36).substring(7),
            message: input,
            marketData: MARKET_DATA,
          }),
        },
      );

      if (result.ok) {
        const data = await result.json();
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.answer,
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleInputChange({
      target: { value: question },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  };

  return (
    <main className="min-h-screen pb-20">
      <div className="container px-4 py-6 mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">AI Chat</h1>

        <Card className="mb-4 shadow-sm">
          <CardContent className="p-4">
            <p className="text-base text-muted-foreground">
              Feel free to ask any questions related to predictions or
              background information. The AI will provide you with the latest
              information and analysis.
            </p>
          </CardContent>
        </Card>

        <div className="bg-muted rounded-lg p-4 mb-4 h-[60vh] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={`message-${index}-${message.role}`}
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
              Suggested Questions
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((question, index) => (
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
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Enter your question..."
            className="flex-1 min-h-[40px] max-h-[40px] text-base resize-none"
            disabled={isLoading}
            rows={1}
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="lg">
            <SendHorizontal className="h-5 w-5 mr-2" />
            Send
          </Button>
        </form>
      </div>
      <Navbar />
    </main>
  );
}
