import { useState, useCallback } from "react";
import { ABCDECard } from "@/components/ABCDE";
import { SegmentationCard } from "@/components/SegmentationCard";
import { Zap, Activity, FileDown } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ModelInfoCards } from "@/components/ModelInfoCards";
import { ImageUpload } from "@/components/ImageUpload";
import { PredictionResultCard } from "@/components/PredictionResult";
import { ProbabilityChart } from "@/components/ProbabilityChart";
import { TournamentCard } from "@/components/TournamentCard";
import { RawPayload } from "@/components/RawPayload";
import { GradCAMViewer } from "@/components/GradCAMViewer";
import { ClinicalRiskCard } from "@/components/ClinicalRiskCard";
import { ScanLoader } from "@/components/ScanLoader";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
// import { PatientIntake } from "@/components/Intake";
// import { type PatientProfile } from "@/lib/api";

import {
  predictLesion,
  getGradCAM,
  saveScanToHistory,
  getSegmentation,
  type SegmentResult,
  type PredictionResult,
  type GradCAMResult,
} from "@/lib/api";

import { generateReport } from "@/lib/pdf-report";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ClinicalAdvice } from "@/components/ClinicalAdvice";

export default function Index() {
  const [file, setFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [segment, setSegment] = useState<SegmentResult | null>(null);
  const [gradcam, setGradcam] = useState<GradCAMResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [gradcamLoading, setGradcamLoading] = useState(false);
  const [, setHistoryRefresh] = useState(0);
  // const [patient, setPatient] =
  // useState<PatientProfile>({
  //   name: "",
  //   age: 25,
  //   sex: "Male",
  //   location: "",
  //   symptoms: [],
  //   duration: "",
  //   familyHistory: false,
  //   sunExposure: "Medium",
  // });

  const { toast } = useToast();

  const handleFileSelect = useCallback((f: File) => {
    setFile(f);

    const reader = new FileReader();
    reader.onload = (e) =>
      setImageDataUrl(e.target?.result as string);

    reader.readAsDataURL(f);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);
    setGradcam(null);
    setSegment(null);

    try {
      const res = await predictLesion(file);
      setResult(res);

      localStorage.setItem("last_prediction", res.prediction);
      localStorage.setItem("last_confidence", res.confidence);

      saveScanToHistory({
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        imageName: file.name,
        imageDataUrl,
        result: res,
      });

      setHistoryRefresh((c) => c + 1);

      setGradcamLoading(true);

      getSegmentation(file)
        .then((s) => setSegment(s))
        .catch(() => {});

      getGradCAM(file)
        .then((gc) => {
          setGradcam(gc);
          setGradcamLoading(false);
        })
        .catch(() => {
          setGradcamLoading(false);
        });
    } catch (e: any) {
      toast({
        title: "Analysis Failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [file, imageDataUrl, toast]);

  const handleExportPDF = useCallback(() => {
    if (!result) return;

    generateReport(result, imageDataUrl, gradcam);

    toast({
      title: "Report Downloaded",
      description: "PDF report saved successfully.",
    });
  }, [result, imageDataUrl, gradcam, toast]);

  return (
    <div className="min-h-screen bg-background flex relative">
  <AnimatedBackground />
  <div className="scan-line" />
      <AppSidebar />

      <div className="flex-1 ml-16 lg:ml-60">
        <main className="p-8 space-y-6 max-w-7xl">
          <ModelInfoCards />

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="space-y-4">
  {/* <PatientIntake
    value={patient}
    onChange={setPatient}
  /> */}

  <ImageUpload
                onFileSelect={handleFileSelect}
                isLoading={loading}
              />

              <div className="flex gap-3">
                <motion.div
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    onClick={handleAnalyze}
                    disabled={!file || loading}
                    className="w-full h-11 text-sm font-semibold gap-2 shadow-lg hover:shadow-primary/30 transition-all"
                    size="lg"
                  >
                    <Zap className="w-4 h-4" />
                    {loading
                      ? "Executing Neural Scan..."
                      : "Execute Neural Scan"}
                  </Button>
                </motion.div>

                {result && (
                  <motion.div
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleExportPDF}
                      variant="outline"
                      className="h-11 gap-2 text-sm shadow-lg"
                      disabled={!gradcam}
                    >
                      <FileDown className="w-4 h-4" />
                      PDF
                    </Button>
                  </motion.div>
                )}
              </div>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <PredictionResultCard result={result} />
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.45 }}
                >
                  <ClinicalRiskCard result={result} />
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.45 }}
                >
                  <ClinicalAdvice result={result} />
                </motion.div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.45 }}
                >
                  <ABCDECard result={result} />
                </motion.div>
              )}
            </div>

            <div className="space-y-4">
              {loading ? (
                <ScanLoader />
              ) : result ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.45 }}
                  >
                    <ProbabilityChart result={result} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.45 }}
                  >
                    <GradCAMViewer
                      gradcam={gradcam}
                      originalImage={imageDataUrl}
                      isLoading={gradcamLoading}
                    />
                  </motion.div>

                  {segment && (
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.45 }}
                    >
                      <SegmentationCard segment={segment} />
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.45 }}
                  >
                    <RawPayload result={result} />
                  </motion.div>
                </>
              ) : (
                <>
                  <div className="glass-card p-6 h-64 flex flex-col items-center justify-center text-center">
                    <Activity className="w-10 h-10 text-muted-foreground/20 mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Upload an image and execute scan
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">
                      Results will appear here
                    </p>
                  </div>

                  <TournamentCard />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}