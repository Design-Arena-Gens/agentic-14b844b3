"use client";

import Image from "next/image";
import type { Recommendation } from "@/lib/recipe-engine";

type RecipeCardProps = {
  recommendation: Recommendation;
  onSelect: (id: string) => void;
};

const difficultyBadgeStyles: Record<string, string> = {
  Easy: "bg-emerald-400/15 text-emerald-200 border-emerald-400/40",
  Medium: "bg-amber-400/15 text-amber-200 border-amber-400/40",
  Hard: "bg-rose-400/15 text-rose-200 border-rose-400/40",
};

export function RecipeCard({ recommendation, onSelect }: RecipeCardProps) {
  const { recipe, score, matchedIngredients, missingIngredients, reasons } =
    recommendation;
  const { image, title, description, difficulty, cookTimeMinutes, tags } = recipe;
  const fallbackImage = `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80&sat=-12&blend=111827&blend-mode=multiply&sig=${encodeURIComponent(recipe.id)}`;
  const imageSrc =
    image && image.startsWith("http")
      ? `${image}${image.includes("?") ? "&" : "?"}auto=format&fit=crop&w=900&q=80`
      : fallbackImage;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-lg shadow-slate-950/40 transition hover:-translate-y-1 hover:border-emerald-300/40 hover:shadow-emerald-500/20">
      <div className="relative h-48 w-full overflow-hidden border-b border-white/5">
        <Image
          src={imageSrc}
          alt={title}
          fill
          unoptimized
          priority={false}
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 350px, 100vw"
        />
        <div className="absolute left-4 top-4 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200 ring-1 ring-emerald-300/60">
          Score {score}
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-lg font-semibold text-white">{title}</h4>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${difficultyBadgeStyles[difficulty]}`}
          >
            {difficulty}
          </span>
        </div>

        <p className="text-sm text-slate-300/80 line-clamp-3">{description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Cook time</p>
            <p className="text-sm font-semibold text-white">{cookTimeMinutes} min</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Ingredient fit</p>
            <p className="text-sm font-semibold text-white">
              {matchedIngredients.length} match
              {matchedIngredients.length === 1 ? "" : "es"}
              {missingIngredients.length > 0 && (
                <span className="ml-2 text-xs font-medium text-slate-400">
                  {missingIngredients.length} missing
                </span>
              )}
            </p>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-300/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <ul className="space-y-2 rounded-2xl border border-white/5 bg-slate-950/60 p-4 text-xs text-slate-300/80">
          {reasons.slice(0, 3).map((reason, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => onSelect(recipe.id)}
          className="w-full rounded-2xl bg-emerald-400/90 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
        >
          View recipe
        </button>
      </div>
    </article>
  );
}
