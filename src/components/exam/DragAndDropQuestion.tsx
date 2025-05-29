
'use client';

import type { Statement, UserAnswer } from '@/lib/types';
import { useExam } from '@/contexts/ExamContext';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DragAndDropQuestionProps {
  questionId: string;
  statements: Statement[];
  categories: string[];
}

type StatementPlacement = Record<string, string | null>; // statementId: categoryId | null (for unassigned)

const UNASSIGNED_POOL_ID = '__UNASSIGNED__';

export default function DragAndDropQuestion({ questionId, statements, categories }: DragAndDropQuestionProps) {
  const { selectAnswer, userAnswers } = useExam();
  const initialAnswer = userAnswers[questionId] as Record<string, string[]> | undefined;
  
  const [statementPlacements, setStatementPlacements] = useState<StatementPlacement>(() => {
    const placements: StatementPlacement = {};
    if (initialAnswer) {
      statements.forEach(s => placements[s.id] = null); // Initialize all as unassigned
      for (const category in initialAnswer) {
        initialAnswer[category].forEach(stmtId => {
          placements[stmtId] = category;
        });
      }
    } else {
      statements.forEach(s => placements[s.id] = UNASSIGNED_POOL_ID);
    }
    return placements;
  });

  const [draggedStatementId, setDraggedStatementId] = useState<string | null>(null);

  useEffect(() => {
    // Format answer for ExamContext: { categoryId: statementId[] }
    const newAnswer: Record<string, string[]> = {};
    categories.forEach(cat => newAnswer[cat] = []);
    
    for (const stmtId in statementPlacements) {
      const categoryId = statementPlacements[stmtId];
      if (categoryId && categoryId !== UNASSIGNED_POOL_ID && newAnswer[categoryId]) {
        newAnswer[categoryId].push(stmtId);
      }
    }
    selectAnswer(questionId, newAnswer);
  }, [statementPlacements, questionId, categories, selectAnswer]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, statementId: string) => {
    setDraggedStatementId(statementId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", statementId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, categoryId: string) => {
    e.preventDefault();
    if (draggedStatementId) {
      setStatementPlacements(prev => ({
        ...prev,
        [draggedStatementId]: categoryId
      }));
      setDraggedStatementId(null);
    }
  };

  const getStatementsInCategory = (categoryId: string) => {
    return statements.filter(s => statementPlacements[s.id] === categoryId);
  };

  return (
    <div className="mt-4 space-y-6">
      <div 
        className="p-4 border border-dashed rounded-lg min-h-[100px] bg-muted/30"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, UNASSIGNED_POOL_ID)}
        aria-label="Unassigned statements pool"
      >
        <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Unassigned Statements</h3>
        <div className="flex flex-wrap gap-2">
          {getStatementsInCategory(UNASSIGNED_POOL_ID).map(stmt => (
            <div
              key={stmt.id}
              draggable
              onDragStart={(e) => handleDragStart(e, stmt.id)}
              className="p-2 border rounded-md bg-background shadow-sm cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"
            >
              {stmt.text}
            </div>
          ))}
          {getStatementsInCategory(UNASSIGNED_POOL_ID).length === 0 && <p className="text-xs text-muted-foreground italic">Drag statements here to unassign.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(category => (
          <div
            key={category}
            className="p-4 border border-dashed rounded-lg min-h-[150px] bg-card shadow"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, category)}
            aria-label={`Category: ${category}`}
          >
            <h3 className="text-base font-semibold mb-3 text-center text-primary">{category}</h3>
            <div className="space-y-2">
              {getStatementsInCategory(category).map(stmt => (
                <div
                  key={stmt.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, stmt.id)}
                  className="p-2 border rounded-md bg-accent/10 shadow-sm cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"
                >
                  {stmt.text}
                </div>
              ))}
              {getStatementsInCategory(category).length === 0 && <p className="text-xs text-center text-muted-foreground italic">Drag statements here.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
