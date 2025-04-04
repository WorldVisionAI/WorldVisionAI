'use client';
import { Card, CardContent } from '@/components/ui/card';
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { Check, X } from 'lucide-react';

interface SwipeCardProps {
  title: string;
  onSwipe: (direction: 'yes' | 'no') => void;
}

export function SwipeCard({ title, onSwipe }: SwipeCardProps) {
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  const yesOpacity = useTransform(x, [0, 100, 200], [0.3, 1, 1]);
  const noOpacity = useTransform(x, [-200, -100, 0], [1, 1, 0.3]);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleDragEnd = (event: DragEvent, info: any) => {
    if (info.offset.x > 100) {
      controls.start({ x: 500, opacity: 0 });
      onSwipe('yes');
    } else if (info.offset.x < -100) {
      controls.start({ x: -500, opacity: 0 });
      onSwipe('no');
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  return (
    <div className="relative touch-none select-none">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, rotate, opacity }}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="cursor-grab active:cursor-grabbing"
        whileTap={{ scale: 0.98 }}
      >
        <Card className="transition-shadow hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-8">
              <motion.div
                className="p-4 rounded-full bg-red-100"
                style={{ opacity: noOpacity }}
              >
                <X className="h-8 w-8 text-red-500" />
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-bold">{title}</h3>
              </div>
              <motion.div
                className="p-4 rounded-full bg-green-100"
                style={{ opacity: yesOpacity }}
              >
                <Check className="h-8 w-8 text-green-500" />
              </motion.div>
            </div>
            <div className="text-center py-12">
              <motion.p
                className="text-lg font-medium"
                style={{
                  opacity: useTransform(
                    x,
                    [-100, -50, 0, 50, 100],
                    [1, 0.8, 0.5, 0.8, 1],
                  ),
                }}
              >
                {x.get() > 50
                  ? 'はい (Yes)'
                  : x.get() < -50
                    ? 'いいえ (No)'
                    : 'スワイプして予測'}
              </motion.p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
