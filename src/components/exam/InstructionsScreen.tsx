
'use client';

import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function InstructionsScreen() {
  const { startExam } = useExam();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[hsl(var(--background))]">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-[hsl(var(--primary))]">Decision Making Test Instructions</CardTitle>
          <CardDescription className="text-center">
            Welcome to the Decision Making simulation. Please read the instructions carefully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[40vh] p-4 border rounded-md bg-muted/20">
            <h3 className="text-lg font-semibold mb-2 text-[hsl(var(--primary))]">Test Format:</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>This test assesses your decision-making skills based on provided premises.</li>
              <li>Each question will present a set of premises followed by several conclusion statements.</li>
              <li>For each conclusion, you must decide if it logically follows ('Yes') or does not logically follow ('No') from the given premises.</li>
              <li>Select 'Yes' or 'No' for every statement.</li>
              <li>Navigate using "Next" and "Previous" buttons or keyboard shortcuts.</li>
              <li>You can "Flag" questions to review later.</li>
              <li>A "Calculator" is available (simulated).</li>
              <li>Your progress (Question X of Y) is displayed at the bottom.</li>
              <li>Click "End Exam" to submit your answers and see your results.</li>
            </ul>
            <h3 className="text-lg font-semibold mt-4 mb-2 text-[hsl(var(--primary))]">Keyboard Shortcuts:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Alt</kbd> + <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">N</kbd> : Next Question</li>
              <li><kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Alt</kbd> + <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">P</kbd> : Previous Question</li>
              <li><kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Alt</kbd> + <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">F</kbd> : Flag/Unflag Question</li>
              <li><kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Alt</kbd> + <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">C</kbd> : Open Calculator</li>
            </ul>
            <p className="mt-4 text-sm">
              Base your decisions solely on the information provided in the premises. Do not use outside knowledge. Good luck!
            </p>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={startExam} 
            size="lg" 
            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 transition-all duration-300 transform hover:scale-105"
          >
            Start Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
