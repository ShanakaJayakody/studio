
'use client';

import type { Option } from '@/lib/types';
import { useExam } from '@/contexts/ExamContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface McqOptionsProps {
  questionId: string;
  options: Option[];
}

const isImageUrl = (text: string) => {
  return text.startsWith('http://') || text.startsWith('https://');
};

export default function McqOptions({ questionId, options }: McqOptionsProps) {
  const { selectAnswer, userAnswers } = useExam();
  const currentAnswer = userAnswers[questionId] as string | undefined;

  const handleSelect = (optionId: string) => {
    selectAnswer(questionId, optionId);
  };

  return (
    <RadioGroup
      value={currentAnswer}
      onValueChange={handleSelect}
      className="space-y-3 mt-4"
      aria-label="Multiple choice options"
    >
      {options.map((option, index) => (
        <Label
          key={option.id}
          htmlFor={option.id}
          className={cn(
            "flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/10",
            currentAnswer === option.id ? "bg-accent/20 border-accent ring-2 ring-accent" : "border-border"
          )}
        >
          <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
          <div className="flex flex-col text-black">
            {isImageUrl(option.text) ? (
              <div className="relative w-full max-w-xs h-auto aspect-auto">
                <Image
                  src={option.text}
                  alt={`Option image`}
                  width={300}
                  height={200}
                  className="rounded-md border object-contain"
                  data-ai-hint="diagram option"
                />
              </div>
            ) : (
              <span className="text-base">{option.text}</span>
            )}
          </div>
        </Label>
      ))}
    </RadioGroup>
  );
}
