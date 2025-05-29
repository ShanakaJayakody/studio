
'use client';

export default function TopBar() {
  return (
    <div className="w-full shadow-md">
      <div className="h-12 bg-[hsl(var(--ucat-dark-blue-bg))] text-[hsl(var(--ucat-dark-blue-fg))] flex items-center px-6">
        <h1 className="text-xl font-semibold">UCAT Challenger</h1>
      </div>
      <div className="h-8 bg-[hsl(var(--ucat-light-blue-bar-bg))] text-[hsl(var(--ucat-light-blue-bar-fg))] flex items-center px-6">
        {/* Placeholder for section name or timer if needed in future */}
        <span className="text-sm">Exam In Progress</span>
      </div>
    </div>
  );
}
