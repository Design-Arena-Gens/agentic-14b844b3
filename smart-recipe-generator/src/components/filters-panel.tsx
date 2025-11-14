"use client";

import type { DietaryTag, Difficulty } from "@/types/recipe";
import type { RecommendationFilters } from "@/lib/recipe-engine";
import { useMemo } from "react";

const dietaryLabels: Record<DietaryTag, string> = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  "gluten-free": "Gluten-free",
};

const cookTimeOptions = [
  { label: "Any", value: undefined },
  { label: "≤ 15 min", value: 15 },
  { label: "≤ 30 min", value: 30 },
  { label: "≤ 45 min", value: 45 },
  { label: "≤ 60 min", value: 60 },
];

const difficultyOptions: Difficulty[] = ["Easy", "Medium", "Hard"];

type FiltersPanelProps = {
  filters: RecommendationFilters;
  onChange: (filters: RecommendationFilters) => void;
  onReset: () => void;
};

export function FiltersPanel({ filters, onChange, onReset }: FiltersPanelProps) {
  const isFiltered = useMemo(() => {
    return (
      filters.dietary.length > 0 ||
      filters.difficulties.length > 0 ||
      typeof filters.maxCookTime !== "undefined"
    );
  }, [filters.dietary.length, filters.difficulties.length, filters.maxCookTime]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl shadow-emerald-500/10">
      <header className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Fine-tune results</h3>
          <p className="text-xs text-slate-300/80">
            Filter by lifestyle, cook time, and difficulty to hone in on the perfect meal.
          </p>
        </div>
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold uppercase tracking-wide text-emerald-300 hover:text-emerald-200"
          >
            Reset
          </button>
        )}
      </header>

      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-100">Dietary preferences</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(dietaryLabels) as DietaryTag[]).map((tag) => {
              const isActive = filters.dietary.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    const next = isActive
                      ? filters.dietary.filter((value) => value !== tag)
                      : [...filters.dietary, tag];
                    onChange({ ...filters, dietary: next });
                  }}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    isActive
                      ? "border-emerald-400 bg-emerald-400/20 text-emerald-100"
                      : "border-white/10 bg-slate-950/60 text-slate-200 hover:border-emerald-300/60 hover:text-emerald-100"
                  }`}
                >
                  {dietaryLabels[tag]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-100">Max cook time</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {cookTimeOptions.map(({ label, value }) => {
              const isActive = filters.maxCookTime === value;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filters,
                      maxCookTime: value,
                    })
                  }
                  className={`rounded-xl border px-3 py-2 text-sm transition ${
                    isActive
                      ? "border-indigo-400 bg-indigo-400/20 text-indigo-100"
                      : "border-white/10 bg-slate-950/60 text-slate-200 hover:border-indigo-300/60 hover:text-indigo-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-100">Difficulty</p>
          <div className="flex flex-wrap gap-2">
            {difficultyOptions.map((difficulty) => {
              const isActive = filters.difficulties.includes(difficulty);
              return (
                <button
                  key={difficulty}
                  type="button"
                  onClick={() => {
                    const next = isActive
                      ? filters.difficulties.filter((value) => value !== difficulty)
                      : [...filters.difficulties, difficulty];
                    onChange({ ...filters, difficulties: next });
                  }}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    isActive
                      ? "border-fuchsia-400 bg-fuchsia-400/20 text-fuchsia-100"
                      : "border-white/10 bg-slate-950/60 text-slate-200 hover:border-fuchsia-400/60 hover:text-fuchsia-100"
                  }`}
                >
                  {difficulty}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
