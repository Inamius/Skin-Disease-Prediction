import { AppSidebar } from "@/components/AppSidebar";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Body3DSelector } from "@/components/Body3DSelector";

export default function BodyMapPage() {
  return (
    <div className="min-h-screen bg-background flex relative">
      <AnimatedBackground />
      <div className="scan-line" />

      <AppSidebar />

      <div className="flex-1 ml-16 lg:ml-60 p-8">
        <div className="max-w-7xl mx-auto">
          <Body3DSelector />
        </div>
      </div>
    </div>
  );
}