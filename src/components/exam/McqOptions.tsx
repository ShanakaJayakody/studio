
'use client';

import type { Option, UserAnswer } from '@/lib/types';
import { useExam } from '@/contexts/ExamContext';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from '@/lib/utils';

interface McqOptionsProps {
  questionId: string;
  options: Option[];
}

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
            "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/10",
            currentAnswer === option.id ? "bg-accent/20 border-accent ring-2 ring-accent" : "border-border"
          )}
        >
          <RadioGroupItem value={option.id} id={option.id} />
          <span className="font-medium text-sm">
            {String.fromCharCode(65 + index)}. {option.text}
          </span>
        </Label>
      ))}
    </RadioGroup>
  );
}
