
'use client';

export default function TopBar() {
  return (
    <div className="w-full shadow-md">
      <div className="h-12 bg-[hsl(var(--ucat-dark-blue-bg))] text-[hsl(var(--ucat-dark-blue-fg))] flex items-center px-6">
        <h1 className="text-xl font-semibold">Decision Making Test</h1> {/* Updated title */}
      </div>
      <div className="h-8 bg-[hsl(var(--ucat-light-blue-bar-bg))] text-[hsl(var(--ucat-light-blue-bar-fg))] flex items-center px-6">
        <span className="text-sm">Section: Decision Making</span> {/* Updated section info */}
      </div>
    </div>
  );
}
