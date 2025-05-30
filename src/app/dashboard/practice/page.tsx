
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { BookOpenText, GitFork, Calculator, GraduationCap } from "lucide-react"; // Updated imports

const practiceCategories = [
  {
    title: "Verbal Reasoning",
    description: "Assess your ability to critically evaluate written information.",
    link: "/dashboard/practice/verbal-reasoning", // Placeholder, actual page not created yet
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "abstract reasoning",
    icon: <BookOpenText className="h-8 w-8 text-primary mb-2" /> // Changed icon
  },
  {
    title: "Decision Making",
    description: "Test your skills in making sound decisions and judgements using complex information.",
    link: "/dashboard/practice/exams", // Links to the exam listing page
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "decision analysis",
    icon: <GitFork className="h-8 w-8 text-primary mb-2" /> // Changed icon
  },
  {
    title: "Quantitative Reasoning",
    description: "Evaluate your capacity to solve numerical problems.",
    link: "/dashboard/practice/quantitative-reasoning", // Placeholder
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "data charts",
    icon: <Calculator className="h-8 w-8 text-primary mb-2" /> // Changed icon
  },
  {
    title: "Full Exams",
    description: "Simulate the complete UCAT experience with full-length mock exams.",
    link: "/dashboard/practice/exams",
    imageUrl: "https://placehold.co/600x400.png",
    aiHint: "exam hall",
    icon: <GraduationCap className="h-8 w-8 text-primary mb-2" /> // Kept icon
  },
];

export default function PracticePage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Practice Sections</CardTitle>
          <CardDescription className="text-lg">
            Choose a section below to start your targeted UCAT preparation.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        {practiceCategories.map((category) => (
          <Link href={category.link} key={category.title} legacyBehavior>
            <a className="block hover:no-underline">
              <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="relative w-full h-48">
                  <Image
                    src={category.imageUrl}
                    alt={category.title}
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint={category.aiHint}
                  />
                </div>
                <CardHeader className="flex-grow">
                  <div className="flex items-center space-x-3 mb-2">
                    {category.icon}
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
