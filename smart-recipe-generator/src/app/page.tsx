"use client";

import { useMemo, useState } from "react";
import { IngredientInput } from "@/components/ingredient-input";
import { FiltersPanel } from "@/components/filters-panel";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeDialog } from "@/components/recipe-dialog";
import {
  getRecommendations,
  allRecipes,
  type Recommendation,
  type RecommendationFilters,
} from "@/lib/recipe-engine";

const createDefaultFilters = (): RecommendationFilters => ({
  dietary: [],
  difficulties: [],
  maxCookTime: undefined,
});

export default function Home() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [filters, setFilters] = useState<RecommendationFilters>(() => createDefaultFilters());
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);

  const recommendations = useMemo(() => {
    if (!hasGenerated) return [];
    return getRecommendations(selectedIngredients, filters);
  }, [filters, hasGenerated, selectedIngredients]);

  const activeRecommendation: Recommendation | null = useMemo(() => {
    if (!activeRecipeId) return null;
    return recommendations.find((item) => item.recipe.id === activeRecipeId) ?? null;
  }, [activeRecipeId, recommendations]);

  const handleGenerate = () => {
    if (selectedIngredients.length === 0) {
      setGenerateError("Add at least one ingredient to generate recommendations.");
      setHasGenerated(false);
      return;
    }
    setGenerateError(null);
    setHasGenerated(true);
  };

  const totalRecipes = allRecipes.length;

  return (
    <main className="min-h-screen px-6 pb-16 pt-12 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/70 to-transparent p-10 shadow-2xl shadow-emerald-500/20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.28),_transparent_55%)]" />
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.25),_transparent_65%)]" />
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                Smart Recipe Generator
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Discover dishes tailored to your pantry, lifestyle, and time.
              </h1>
              <p className="max-w-2xl text-base text-slate-200/80">
                Drop in ingredients, apply dietary filters, and let our matching engine serve
                up chef-approved recipes from a curated collection of {totalRecipes} dishes.
              </p>
            </div>
            <div className="flex flex-none flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200/80">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Dietary tags</p>
                <p className="text-lg font-semibold text-white">20+ friendly options</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Average prep</p>
                <p className="text-lg font-semibold text-white">30 minutes</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">AI boost</p>
                <p className="text-lg font-semibold text-white">Clarifai Food Vision</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.75fr_1fr]">
          <IngredientInput
            selectedIngredients={selectedIngredients}
            onAddIngredient={(ingredient) =>
              setSelectedIngredients((prev) => [...prev, ingredient])
            }
            onRemoveIngredient={(ingredient) =>
              setSelectedIngredients((prev) => prev.filter((item) => item !== ingredient))
            }
          />
          <FiltersPanel
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(createDefaultFilters())}
          />
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Personalized results</h2>
              <p className="text-sm text-slate-200/70">
                Ingredient matching, dietary alignment, and cook-time insights in one glance.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-900/70 shadow-[0_0_12px_rgba(5,150,105,0.6)]" />
              Generate recipes
            </button>
          </div>
          {generateError && <p className="mt-3 text-sm text-rose-300">{generateError}</p>}

          {!hasGenerated ? (
            <div className="mt-8 grid gap-6 rounded-3xl border border-dashed border-white/10 bg-slate-950/60 p-10 text-center text-slate-300/70">
              <p className="text-lg font-medium text-white">
                Add ingredients and click “Generate recipes” to see your personalized matches.
              </p>
              <p className="text-sm text-slate-400">
                Tip: Upload a quick fridge photo to detect ingredients automatically.
              </p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-rose-400/40 bg-rose-400/10 p-8 text-center">
              <p className="text-lg font-semibold text-rose-100">
                We couldn’t find any strong matches.
              </p>
              <p className="mt-2 text-sm text-rose-100/80">
                Try broadening your ingredients or adjusting filters to uncover more ideas.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-8">
              <div className="grid gap-5 text-sm text-slate-300/80 sm:grid-cols-3">
                <SummaryCard
                  label="Top match score"
                  value={`${recommendations[0].score}/100`}
                  description="Best aligned with your ingredients and filters."
                />
                <SummaryCard
                  label="Ready in"
                  value={`${recommendations[0].recipe.totalTimeMinutes} mins`}
                  description="Total time for the leading recommendation."
                />
                <SummaryCard
                  label="Matching ingredients"
                  value={`${recommendations[0].matchedIngredients.length}`}
                  description="Overlap between your pantry and this recipe."
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {recommendations.map((recommendation) => (
                  <RecipeCard
                    key={recommendation.recipe.id}
                    recommendation={recommendation}
                    onSelect={setActiveRecipeId}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <RecipeDialog
        open={Boolean(activeRecommendation)}
        onClose={() => setActiveRecipeId(null)}
        recommendation={activeRecommendation}
      />
    </main>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  description: string;
};

function SummaryCard({ label, value, description }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-inner shadow-slate-950/60">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-300/70">{description}</p>
    </div>
  );
}
