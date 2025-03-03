
import { Toaster } from "@/components/ui/sonner";
import BrainstormEditor from "@/components/BrainstormEditor";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 h-[calc(100vh-2rem)]">
        <BrainstormEditor />
      </main>
    </div>
  );
}
