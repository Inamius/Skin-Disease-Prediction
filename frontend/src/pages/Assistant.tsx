import { AppSidebar } from "@/components/AppSidebar";
import { AIAssistant } from "@/components/AiAssistant";

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />

      <div className="flex-1 ml-16 lg:ml-60 p-6">
        <AIAssistant />
      </div>
    </div>
  );
}