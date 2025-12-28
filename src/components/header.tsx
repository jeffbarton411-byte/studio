import Link from 'next/link';
import { FileText, GanttChartSquare } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center mx-auto">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <GanttChartSquare className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">FormFlow Pro</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Home
          </Link>
          <Link
            href="/admin"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Admin
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button asChild>
            <Link href="/apply">
              <FileText className="mr-2 h-4 w-4" />
              New Application
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
