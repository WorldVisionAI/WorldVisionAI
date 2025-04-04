import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Add system message if not present
  const systemMessage = {
    role: 'system',
    content:
      'あなたはWorldvisionAIの予測市場アシスタントです。ユーザーの質問に対して、予測市場や経済、政治、エンターテイメントなどの分野に関する情報を提供してください。予測に関する分析や背景情報を詳しく説明し、ユーザーが賢明な判断を下せるようサポートしてください。',
  };

  const messagesWithSystem =
    messages[0]?.role === 'system' ? messages : [systemMessage, ...messages];

  const result = streamText({
    model: openai('gpt-4o'),
    messages: messagesWithSystem,
  });

  return result.toDataStreamResponse();
}
