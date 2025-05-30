
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ListChecks, Award, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect } from "react";
import { format, addDays, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils"; // Added missing import

// Helper function to generate calendar days
const generateMonthDays = (year: number, month: number, practiceData: Record<string, 'some' | 'lots' | undefined>) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const displayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth -1; // Monday start
  
  const days = [];
  for (let i = 0; i < displayOffset; i++) {
    days.push({ day: null, practice: undefined });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    days.push({ day: i, practice: practiceData[dateStr] });
  }
  return days;
};


export default function HomePage() {
  const { currentUser } = useAuth();
  const [examDate, setExamDate] = useState<Date | undefined>(addDays(new Date(), 50));
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (examDate) {
      setDaysRemaining(differenceInDays(examDate, new Date()));
    } else {
      setDaysRemaining(null);
    }
  }, [examDate]);

  const userDisplayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "User";

  // Mock practice data for the calendar: YYYY-MM-DD
  const mockPracticeData: Record<string, 'some' | 'lots' | undefined> = {
    '2025-05-19': 'some', '2025-05-20': 'lots', '2025-05-21': 'some',
    '2025-05-22': 'lots', '2025-05-23': 'some', '2025-05-24': 'lots', '2025-05-30': 'lots',
    '2025-06-03': 'some', '2025-06-10': 'lots', '2025-06-17': 'some',
  };

  const may2025Days = generateMonthDays(2025, 4, mockPracticeData); // Month is 0-indexed (4 for May)
  const june2025Days = generateMonthDays(2025, 5, mockPracticeData); // 5 for June

  const calendarDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const renderCalendarMonth = (monthName: string, days: { day: number | null, practice?: 'some' | 'lots' }[]) => (
    <div className="flex-1">
      <h4 className="text-sm font-medium text-center mb-2">{monthName}</h4>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
        {calendarDays.map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, index) => (
          <div
            key={`${monthName}-day-${index}`}
            className={cn(
              "h-8 w-full flex items-center justify-center rounded text-xs",
              d.day ? "border" : "border-transparent",
              d.practice === 'some' && 'bg-orange-200 border-orange-300',
              d.practice === 'lots' && 'bg-primary/70 text-primary-foreground border-primary',
              !d.practice && d.day && 'bg-card hover:bg-muted/50'
            )}
          >
            {d.day}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Welcome {userDisplayName}</h1>
        <p className="text-muted-foreground text-lg">
          Ready to ace the UCAT? Here's your personalized dashboard.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Setup Your Prep */}
        <Card className="lg:col-span-1 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Setup Your Prep</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-muted-foreground mb-1">Your Name:</label>
              <Input id="userName" type="text" value={userDisplayName} readOnly className="bg-muted/50" />
            </div>
            <div>
              <label htmlFor="examDate" className="block text-sm font-medium text-muted-foreground mb-1">Date of Your Exam:</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !examDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {examDate ? format(examDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={examDate}
                    onSelect={setExamDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {daysRemaining !== null && (
                <p className="text-sm text-primary mt-1 text-right">
                  {daysRemaining > 0 ? `${daysRemaining} day(s) remaining` : (daysRemaining === 0 ? "Today is the day!" : "Exam date has passed")}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="consistency" className="block text-sm font-medium text-muted-foreground mb-1">Daily Plan Consistency:</label>
              <div className="p-3 bg-muted/50 rounded-md border">
                <p className="text-sm">6 Day(s) Completed</p> {/* Placeholder */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Activity Calendar */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Activity Calendar</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" disabled><ChevronLeft className="h-5 w-5" /></Button>
              <span className="text-sm font-medium">May 2025</span> {/* Placeholder */}
              <Button variant="ghost" size="icon" disabled><ChevronRight className="h-5 w-5" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              {renderCalendarMonth("May", may2025Days)}
              {renderCalendarMonth("June", june2025Days)}
            </div>
            <div className="mt-4 flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <span className="h-3 w-3 rounded-sm bg-orange-200 border border-orange-300"></span>
                <span>Some practice</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="h-3 w-3 rounded-sm bg-primary/70 border border-primary"></span>
                <span>Lots of practice</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<ListChecks className="h-8 w-8 text-primary" />}
          title="Activities Completed"
          value="32" // Placeholder
        />
        <StatCard
          icon={<Award className="h-8 w-8 text-green-500" />}
          title="Average Score"
          value="9.2%" // Placeholder
          valueColor="text-green-500"
        />
        <StatCard
          icon={<Clock className="h-8 w-8 text-red-500" />}
          title="Time Practiced"
          value="16h 34m" // Placeholder
          valueColor="text-red-500"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  valueColor?: string;
}

function StatCard({ icon, title, value, valueColor = "text-primary" }: StatCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
        {icon}
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={cn("text-3xl font-bold", valueColor)}>{value}</p>
      </CardContent>
    </Card>
  );
}

