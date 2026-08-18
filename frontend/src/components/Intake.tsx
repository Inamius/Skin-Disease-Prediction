import { User, Sun, MapPin } from "lucide-react";
import { PatientProfile } from "@/lib/api";

interface Props {
  value: PatientProfile;
  onChange: (v: PatientProfile) => void;
}

export function PatientIntake({
  value,
  onChange,
}: Props) {
  const update = (
    k: keyof PatientProfile,
    v: any
  ) => {
    onChange({
      ...value,
      [k]: v,
    });
  };

  const toggleSymptom = (
    symptom: string
  ) => {
    if (
      value.symptoms.includes(
        symptom
      )
    ) {
      update(
        "symptoms",
        value.symptoms.filter(
          (s) => s !== symptom
        )
      );
    } else {
      update(
        "symptoms",
        [
          ...value.symptoms,
          symptom,
        ]
      );
    }
  };

  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <User className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">
          Patient Clinical Intake
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          value={value.name}
          onChange={(e) =>
            update(
              "name",
              e.target.value
            )
          }
          placeholder="Patient Name"
          className="h-11 rounded-xl bg-white/5 border border-white/10 px-4 outline-none"
        />

        <input
          type="number"
          value={value.age}
          onChange={(e) =>
            update(
              "age",
              Number(
                e.target.value
              )
            )
          }
          placeholder="Age"
          className="h-11 rounded-xl bg-white/5 border border-white/10 px-4 outline-none"
        />

        <select
          value={value.sex}
          onChange={(e) =>
            update(
              "sex",
              e.target.value
            )
          }
          className="h-11 rounded-xl bg-white/5 border border-white/10 px-4 outline-none"
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <div className="relative">
          <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />

          <input
            value={value.location}
            onChange={(e) =>
              update(
                "location",
                e.target.value
              )
            }
            placeholder="Body Location"
            className="w-full h-11 rounded-xl bg-white/5 border border-white/10 pl-11 pr-4 outline-none"
          />
        </div>

        <input
          value={value.duration}
          onChange={(e) =>
            update(
              "duration",
              e.target.value
            )
          }
          placeholder="Duration noticed"
          className="h-11 rounded-xl bg-white/5 border border-white/10 px-4 outline-none"
        />

        <div className="relative">
          <Sun className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />

          <select
            value={value.sunExposure}
            onChange={(e) =>
              update(
                "sunExposure",
                e.target.value
              )
            }
            className="w-full h-11 rounded-xl bg-white/5 border border-white/10 pl-11 pr-4 outline-none"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      <div>
        <p className="text-sm mb-3 text-muted-foreground">
          Symptoms
        </p>

        <div className="flex flex-wrap gap-2">
          {[
            "Itching",
            "Bleeding",
            "Pain",
            "Growing",
            "Color Change",
          ].map((s) => {
            const active =
              value.symptoms.includes(
                s
              );

            return (
              <button
                key={s}
                onClick={() =>
                  toggleSymptom(s)
                }
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={
            value.familyHistory
          }
          onChange={(e) =>
            update(
              "familyHistory",
              e.target.checked
            )
          }
        />
        Family history of skin cancer
      </label>
    </div>
  );
}