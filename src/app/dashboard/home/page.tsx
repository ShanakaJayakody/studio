
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck, TrendingUp, Target } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Welcome to UCAT Challenger!</CardTitle>
          <CardDescription className="text-lg">
            Your journey to UCAT success starts here. Sharpen your skills and conquer the exam.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Navigate through the sections using the sidebar. Dive into targeted practice, review your performance, 
            and track your progress as you prepare for the UCAT.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard
              icon={<BookOpenCheck className="h-8 w-8 text-primary" />}
              title="Targeted Practice"
              description="Focus on specific UCAT sections like Decision Making, Verbal Reasoning, and more."
            />
            <InfoCard
              icon={<TrendingUp className="h-8 w-8 text-primary" />}
              title="Track Progress"
              description="Monitor your results and identify areas for improvement with detailed feedback."
            />
            <InfoCard
              icon={<Target className="h-8 w-8 text-primary" />}
              title="Exam Simulation"
              description="Experience realistic exam conditions to build confidence and timing skills."
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Go to the <strong>Practice</strong> section to begin an exam or drill specific skills.</li>
            <li>Check the <strong>Results</strong> section to review your past attempts.</li>
            <li>Remember, consistent practice is key to mastering the UCAT!</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <Card className="bg-primary/5 hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        {icon}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
