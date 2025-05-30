
// This file is no longer used and can be deleted.
// The functionality has been moved to /src/app/exams/[examId]/page.tsx
// to support dynamic exam IDs.

// To delete this file, you can inform the user:
// "The file /src/app/exams/decision-making/page.tsx is now obsolete and can be removed,
// as its functionality has been consolidated into the dynamic route /src/app/exams/[examId]/page.tsx."

// For now, I will leave it empty or with a comment.
// If the build system complains about an empty file or this structure,
// a minimal valid Next.js page component can be placed here,
// for example, redirecting to /dashboard/practice/exams.

// Minimal content to avoid build errors if file is not deleted immediately:
export default function DeprecatedDecisionMakingPage() {
  if (typeof window !== 'undefined') {
    window.location.href = '/dashboard/practice/exams';
  }
  return null; // Or a loading/redirecting message
}
