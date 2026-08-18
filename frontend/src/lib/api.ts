const API_BASE = "http://127.0.0.1:8000/api/v1";

export type PatientProfile = {
  name: string;
  age: number;
  sex: string;
  location: string;
  symptoms: string[];
  duration: string;
  familyHistory: boolean;
  sunExposure: string;
};

export type PredictionResult = {
  prediction: string;
  confidence: string;
  probability_data: {
    name: string;
    score: number;
  }[];
  inference_time_ms: number;
  image_type: string;
  note: string;
  advice: string;
  abcde: {
    asymmetry: number;
    border: number;
    color: number;
    diameter: number;
    evolution: string;
    risk_score: number;
  };
};

export type GradCAMResult = {
  heatmap_base64: string;
  overlay_base64: string;
  prediction: string;
  confidence: string;
  attention_score: number;
  bbox: number[];
  peak_attention: number[];
  explanation: string;
};

export type SegmentResult = {
  overlay_base64: string;
  area_percent: number;
  border_score: number;
  shape: string;
  confidence: string;
};

export type ScanHistoryEntry = {
  id: string;
  timestamp: string;
  imageName: string;
  imageDataUrl: string;
  result: PredictionResult;
  patient?: PatientProfile;
};

export async function predictLesion(
  file: File
): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${API_BASE}/predict`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const text =
      await res.text();

    throw new Error(
      "Predict failed: " + text
    );
  }

  return await res.json();
}

export async function getGradCAM(
  file: File
): Promise<GradCAMResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${API_BASE}/gradcam`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const text =
      await res.text();

    throw new Error(
      "GradCAM failed: " + text
    );
  }

  return await res.json();
}

export async function getSegmentation(
  file: File
): Promise<SegmentResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    `${API_BASE}/segment`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const text =
      await res.text();

    throw new Error(
      "Segmentation failed: " + text
    );
  }

  return await res.json();
}

export function saveScanToHistory(
  scan: ScanHistoryEntry
) {
  try {
    const existing =
      JSON.parse(
        localStorage.getItem(
          "scan_history"
        ) || "[]"
      );

    existing.unshift(scan);

    localStorage.setItem(
      "scan_history",
      JSON.stringify(existing)
    );
  } catch (e) {
    console.error(
      "Save history failed",
      e
    );
  }
}

export function getScanHistory(): ScanHistoryEntry[] {
  try {
    return JSON.parse(
      localStorage.getItem(
        "scan_history"
      ) || "[]"
    );
  } catch {
    return [];
  }
}

export function clearScanHistory() {
  try {
    localStorage.removeItem(
      "scan_history"
    );
  } catch (e) {
    console.error(
      "Clear history failed",
      e
    );
  }
}