
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, PlayCircle } from "lucide-react";

const availableExams = [
  {
    title: "UCAT Decision Making Test",
    description: "A full simulation of the Decision Making section of the UCAT exam.",
    link: "/exams/decision-making", // Link to the actual DM test
    duration: "37 Minutes",
    questions: "35 Questions" 
  },
  // Add more exams here as they are developed
];

export default function ExamsPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Available Exams</CardTitle>
          <CardDescription className="text-lg">
            Select an exam below to begin your simulation.
          </CardDescription>
        </CardHeader>
      </Card>

      {availableExams.length > 0 ? (
        <div className="space-y-6">
          {availableExams.map((exam) => (
            <Card key={exam.title} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center">
                      <FileText className="h-6 w-6 mr-3 text-primary"/>
                      {exam.title}
                    </CardTitle>
                    <CardDescription className="mt-1">{exam.description}</CardDescription>
                  </div>
                  <Link href={exam.link} passHref legacyBehavior>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <a><PlayCircle className="mr-2 h-5 w-5" /> Start Exam</a>
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                  <span>Duration: {exam.duration}</span>
                  <span>Questions: {exam.questions}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No exams available at the moment. Please check back later.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
