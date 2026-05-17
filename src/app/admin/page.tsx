import ApplicationsTable from "@/app/admin/applications-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ArrowLeft, Bug } from "lucide-react";

export default async function AdminPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-4xl font-bold font-headline tracking-tight">drive4mmm Command Center</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Monitor and manage carrier applications in real-time.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="glass" asChild>
            <Link href="/debug"><Bug className="mr-2 h-4 w-4" /> System Health</Link>
          </Button>
          <Button asChild className="shadow-lg shadow-primary/20">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Public Portal</Link>
          </Button>
        </div>
      </div>

      <div className="glass rounded-xl p-6 border-white/5 subtle-glow">
        <ApplicationsTable />
      </div>
    </div>
  );
}
