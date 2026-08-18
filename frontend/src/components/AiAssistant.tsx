import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Bot,
  ImageIcon,
  X,
  User,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Msg = {
  role: "user" | "assistant";
  content: string;
  time: string;
};

const suggestions = [
  "What is melanoma?",
  "ABCDE rule for skin cancer",
  "How dangerous is a mole?",
  "Skin cancer prevention tips",
  "What do you notice in this lesion image?",
];

function now() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TypingDots() {
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -4, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
          className="w-2 h-2 rounded-full bg-primary"
        />
      ))}
    </div>
  );
}

export function AIAssistant() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const typeReply = async (text: string) => {
    let built = "";

    setMessages((p) => [
      ...p,
      {
        role: "assistant",
        content: "",
        time: now(),
      },
    ]);

    for (let i = 0; i < text.length; i++) {
      built += text[i];

      setMessages((p) => {
        const copy = [...p];
        copy[copy.length - 1] = {
          ...copy[copy.length - 1],
          content: built,
        };
        return copy;
      });

      await new Promise((r) =>
        setTimeout(r, 6)
      );
    }
  };

  const onImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const reader = new FileReader();
    reader.onload = () =>
      setImage(reader.result as string);
    reader.readAsDataURL(f);
  };

  const ask = async (custom?: string) => {
    const text = custom || msg;

    if ((!text.trim() && !image) || loading)
      return;

    setMessages((p) => [
      ...p,
      {
        role: "user",
        content:
          text || "Analyze this uploaded image",
        time: now(),
      },
    ]);

    setMsg("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/v1/assistant",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message:
              text ||
              "Analyze this image medically",
            image,
            prediction:
              localStorage.getItem(
                "last_prediction"
              ),
            confidence:
              localStorage.getItem(
                "last_confidence"
              ),
          }),
        }
      );

      const data = await res.json();

      await typeReply(
        data.reply || "No response."
      );
    } catch {
      await typeReply(
        "Assistant unavailable."
      );
    }

    setImage(null);
    setLoading(false);
  };

  const lastPrediction =
    localStorage.getItem("last_prediction");

  const lastConfidence =
    localStorage.getItem("last_confidence");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="glass-card-hover rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center gap-4">
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0px rgba(0,0,0,0)",
                "0 0 25px rgba(0,180,255,.35)",
                "0 0 0px rgba(0,0,0,0)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center"
          >
            <Bot className="w-7 h-7 text-primary" />
          </motion.div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold">
              DermScan AI
            </h2>
            <p className="text-muted-foreground mt-1">
              Medical copilot with image
              reasoning
            </p>
          </div>

          {lastPrediction && (
            <div className="hidden lg:flex gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs border border-primary/20">
                Last: {lastPrediction}
              </span>

              <span className="px-3 py-1 rounded-full bg-white/5 text-xs border border-white/10">
                {lastConfidence}
              </span>
            </div>
          )}
        </div>

        {messages.length === 0 && (
          <div className="px-8 pt-6 flex flex-wrap gap-3">
            {suggestions.map((s) => (
              <motion.button
                whileHover={{
                  y: -2,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                key={s}
                onClick={() => ask(s)}
                className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm hover:bg-primary hover:text-white transition"
              >
                {s}
              </motion.button>
            ))}
          </div>
        )}

        <div
          ref={scrollRef}
          className="min-h-[540px] max-h-[540px] overflow-y-auto p-8 bg-gradient-to-b from-background/20 to-secondary/10"
        >
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <motion.div
                  animate={{
                    rotate: [0, 8, -8, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-14 h-14 text-primary mx-auto mb-5" />
                </motion.div>

                <h3 className="text-2xl font-semibold mb-2">
                  Your medical AI assistant
                </h3>

                <p className="text-muted-foreground text-lg">
                  Ask questions or upload a lesion
                  image.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className={`flex ${
                      m.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[78%] rounded-3xl px-6 py-5 shadow-xl ${
                        m.role === "user"
                          ? "bg-primary text-white"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
                        {m.role === "assistant" ? (
                          <Bot className="w-3.5 h-3.5" />
                        ) : (
                          <User className="w-3.5 h-3.5" />
                        )}

                        <Clock3 className="w-3 h-3" />
                        {m.time}
                      </div>

                      <div className="whitespace-pre-wrap leading-8 text-[16px]">
                        {m.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <div className="flex justify-start">
                  <div className="px-5 py-4 rounded-3xl bg-white/5 border border-white/10">
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {image && (
          <div className="px-6 pb-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative inline-block"
            >
              <img
                src={image}
                alt="preview"
                className="w-36 h-36 object-cover rounded-3xl border border-white/10"
              />

              <button
                onClick={() => setImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </motion.div>
          </div>
        )}

        <div className="p-6 border-t border-white/10 flex gap-4 items-center bg-black/10 backdrop-blur-xl">
          <label className="cursor-pointer h-24 w-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/10 transition">
            <ImageIcon className="w-7 h-7 text-primary" />
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={onImage}
            />
          </label>

          <textarea
            value={msg}
            onChange={(e) =>
              setMsg(e.target.value)
            }
            placeholder="Ask DermScan AI..."
            className="flex-1 h-24 rounded-3xl bg-white/5 border border-white/10 px-6 py-5 resize-none outline-none text-base"
          />

          <Button
            onClick={() => ask()}
            disabled={loading}
            className="h-24 px-10 rounded-3xl text-lg"
          >
            <Send className="w-5 h-5 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}