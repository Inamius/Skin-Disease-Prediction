import jsPDF from "jspdf";
import type { PredictionResult } from "./api";

const RISK_MAP: Record<string, string> = {
  "Melanoma": "HIGH",
  "Basal cell carcinoma": "HIGH",
  "Actinic keratoses": "MEDIUM",
  "Vascular lesions": "MEDIUM",
  "Dermatofibroma": "LOW",
  "Benign keratosis": "LOW",
  "Melanocytic nevi": "LOW",
};

export async function generateReport(
  result: PredictionResult,
  imageDataUrl?: string,
  gradcam?: any
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const primary = [56, 189, 248] as const;
  const dark = [9, 9, 11] as const;

  // ================= HEADER =================
  doc.setFillColor(dark[0], dark[1], dark[2]);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("DermScan Pro", 14, 18);

  doc.setTextColor(180, 180, 180);
  doc.setFontSize(10);
  doc.text("AI Dermatology Report", 14, 26);

  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);
  doc.text(`Report ID: DS-${Date.now().toString(36).toUpperCase()}`, pageWidth - 65, 34);

  y = 52;

  // ================= IMAGE + RESULT =================
  if (imageDataUrl) {
    try {
      doc.setDrawColor(primary[0], primary[1], primary[2]);
      doc.rect(14, y, 50, 50);
      doc.addImage(imageDataUrl, "PNG", 15, y + 1, 48, 48);
    } catch {}

    const textX = 72;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text("PRIMARY DIAGNOSIS", textX, y + 8);

    doc.setFontSize(18);
    doc.text(result.prediction || "-", textX, y + 20);

    const risk = RISK_MAP[result.prediction] || "MEDIUM";

    doc.setFontSize(10);
    if (risk === "HIGH") doc.setTextColor(220, 38, 38);
    else if (risk === "MEDIUM") doc.setTextColor(245, 158, 11);
    else doc.setTextColor(34, 197, 94);

    doc.text(`Risk Level: ${risk}`, textX, y + 28);

    // 🔥 CONFIDENCE
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Confidence: ${result.confidence || "-"}`, textX, y + 36);

    // 🔥 AI CONFIDENCE (NEW)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(primary[0], primary[1], primary[2]);
    doc.text(`AI Confidence Level: ${result.confidence || "-"}`, textX, y + 42);

    // 🔥 IMAGE TYPE
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Image Type: ${result.image_type || "-"}`, textX, y + 50);

    y += 60;
  }

  // ================= GRADCAM =================
  if (gradcam?.overlay_base64) {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Model Attention (Grad-CAM)", 14, y);

    try {
      doc.addImage(
        `data:image/png;base64,${gradcam.overlay_base64}`,
        "PNG",
        14,
        y + 5,
        60,
        50
      );
    } catch {}

    y += 60;
  }

  // ================= PROBABILITIES =================
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Prediction Distribution", 14, y);

  y += 6;

  doc.setFillColor(240, 240, 240);
  doc.rect(14, y, pageWidth - 28, 8, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("CLASS", 18, y + 5.5);
  doc.text("PROBABILITY", pageWidth - 50, y + 5.5);

  y += 10;

  doc.setFont("helvetica", "normal");

  (result.probability_data || []).slice(0, 5).forEach((item) => {
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);

    doc.text(item.name, 18, y + 4);
    doc.text(`${item.score.toFixed(2)}%`, pageWidth - 50, y + 4);

    const barWidth = (item.score / 100) * 80;

    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.roundedRect(80, y + 1, barWidth, 4, 1, 1, "F");

    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(80, y + 1, 80, 4, 1, 1, "S");

    y += 8;
  });

  // ================= AI NOTE =================
  y += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("AI Observation", 14, y);

  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(result.note || "-", 14, y, { maxWidth: 180 });

  // ================= ADVICE =================
  y += 14;

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text("Suggested Guidance", 14, y);

  y += 6;
  doc.setTextColor(primary[0], primary[1], primary[2]);
  doc.setFontSize(10);
  doc.text(result.advice || "-", 14, y, { maxWidth: 180 });

  // ================= DISCLAIMER =================
  y += 16;

  doc.setDrawColor(245, 158, 11);
  doc.line(14, y, pageWidth - 14, y);

  y += 6;

  doc.setFontSize(7);
  doc.setTextColor(140);
  doc.text(
    "This report is AI-generated for screening purposes only. Not a clinical diagnosis.",
    14,
    y
  );
  y += 4;
  doc.text(
    "Consult a dermatologist for medical advice.",
    14,
    y
  );

  // ================= FOOTER =================
  const footerY = doc.internal.pageSize.getHeight() - 10;

  doc.setFillColor(dark[0], dark[1], dark[2]);
  doc.rect(0, footerY - 5, pageWidth, 15, "F");

  doc.setTextColor(120);
  doc.setFontSize(7);
  doc.text(
    "DermScan Pro | AI Dermatology System | HAM10000 Dataset",
    14,
    footerY
  );

  doc.save(`DermScan_Report_${Date.now()}.pdf`);
}