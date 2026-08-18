import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  ScanLine,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export function ImageUpload({
  onFileSelect,
  isLoading,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;

      setFileName(file.name);
      setFileSize(
        (file.size / 1024).toFixed(1) + " KB"
      );

      const reader = new FileReader();
      reader.onload = (e) =>
        setPreview(e.target?.result as string);

      reader.readAsDataURL(file);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const clear = () => {
    setPreview(null);
    setFileName("");
    setFileSize("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="glass-card-hover overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 6, -6, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"
          >
            <ScanLine className="w-4 h-4 text-primary" />
          </motion.div>

          <div>
            <h3 className="text-sm font-semibold">
              Image Analysis Plate
            </h3>
            <p className="text-[10px] text-muted-foreground">
              Dermatoscopic Upload Interface
            </p>
          </div>
        </div>

        {preview && (
          <motion.button
            whileHover={{
              rotate: 90,
              scale: 1.08,
            }}
            whileTap={{
              scale: 0.92,
            }}
            onClick={clear}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/15 flex items-center justify-center"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-red-300" />
          </motion.button>
        )}
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="space-y-4"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/20"
              >
                <img
                  src={preview}
                  alt="preview"
                  className="w-full max-h-[320px] object-contain"
                />

                <motion.div
                  animate={{
                    y: [-120, 320],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute left-0 w-full h-24 bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent blur-xl pointer-events-none"
                />

                {isLoading && (
                  <div className="absolute inset-0 bg-black/45 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <motion.div
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full"
                      />

                      <p className="text-sm text-primary font-medium">
                        Neural Processing...
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {fileName}
                </span>

                <span>{fileSize}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              animate={{
                scale: dragOver ? 1.02 : 1,
              }}
              className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer p-12 text-center ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-white/10 bg-white/5"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() =>
                setDragOver(false)
              }
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);

                if (
                  e.dataTransfer.files[0]
                ) {
                  handleFile(
                    e.dataTransfer.files[0]
                  );
                }
              }}
              onClick={() =>
                inputRef.current?.click()
              }
            >
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="mx-auto mb-5 w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg"
              >
                <Upload className="w-8 h-8 text-primary" />
              </motion.div>

              <h3 className="text-lg font-semibold mb-2">
                Drop image to begin scan
              </h3>

              <p className="text-sm text-muted-foreground mb-5">
                PNG / JPG · Auto enhancement · AI segmentation
              </p>

              <div className="flex justify-center gap-2 mb-6 flex-wrap">
                {[
                  "Dermoscopy",
                  "Heatmap",
                  "Segmentation",
                  "ABCDE",
                ].map((x) => (
                  <span
                    key={x}
                    className="px-3 py-1 rounded-full text-[11px] bg-white/5 border border-white/10"
                  >
                    {x}
                  </span>
                ))}
              </div>

              <Button
                variant="secondary"
                disabled={isLoading}
                className="rounded-full px-6"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Browse Files
              </Button>

              <motion.div
                animate={{
                  opacity: [0.25, 0.7, 0.25],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="absolute top-5 right-5"
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          e.target.files?.[0] &&
          handleFile(e.target.files[0])
        }
      />
    </motion.div>
  );
}