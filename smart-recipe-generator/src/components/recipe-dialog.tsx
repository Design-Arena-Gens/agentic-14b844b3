"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import type { Recommendation } from "@/lib/recipe-engine";

type RecipeDialogProps = {
  open: boolean;
  onClose: () => void;
  recommendation: Recommendation | null;
};

export function RecipeDialog({ open, onClose, recommendation }: RecipeDialogProps) {
  if (!recommendation) {
    return null;
  }

  const { recipe, score, matchedIngredients, missingIngredients } = recommendation;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-3xl transform overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 p-8 shadow-2xl shadow-indigo-500/30 transition-all">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-6 top-6 rounded-full bg-white/5 p-2 text-slate-300 hover:bg-white/10"
                  aria-label="Close recipe details"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-5 w-5"
                  >
                    <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <Dialog.Title className="text-2xl font-semibold text-white">
                        {recipe.title}
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-slate-300/80">{recipe.description}</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-400/50 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100">
                      Match score: {score}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Metric label="Total time" value={`${recipe.totalTimeMinutes} mins`} />
                    <Metric label="Servings" value={`${recipe.servings}`} />
                    <Metric label="Calories" value={`${recipe.calories} kcal`} />
                    <Metric
                      label="Difficulty"
                      value={recipe.difficulty}
                      accent={
                        recipe.difficulty === "Easy"
                          ? "text-emerald-300"
                          : recipe.difficulty === "Medium"
                          ? "text-amber-300"
                          : "text-rose-300"
                      }
                    />
                  </div>

                  <section className="grid gap-6 rounded-2xl border border-white/5 bg-slate-900/70 p-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                        Ingredients you have
                      </h4>
                      {matchedIngredients.length > 0 ? (
                        <ul className="mt-3 space-y-2 text-sm text-slate-200">
                          {matchedIngredients.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                              <span className="capitalize">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-slate-400">
                          This recipe provides new inspiration to shop for.
                        </p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                        You might need
                      </h4>
                      {missingIngredients.length > 0 ? (
                        <ul className="mt-3 space-y-2 text-sm text-slate-200">
                          {missingIngredients.map((item) => (
                            <li key={item} className="flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                              <span className="capitalize">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-sm text-slate-400">
                          You have everything you need!
                        </p>
                      )}
                    </div>
                  </section>

                  <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                      Full ingredient list
                    </h4>
                    <ul className="mt-3 grid gap-2 text-sm text-slate-200 md:grid-cols-2">
                      {recipe.ingredients.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                          <span className="capitalize">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="rounded-2xl border border-white/5 bg-slate-900/70 p-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                      Step-by-step
                    </h4>
                    <ol className="mt-4 space-y-3 text-sm text-slate-200">
                      {recipe.instructions.map((step, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20 text-sm font-semibold text-emerald-200">
                            {index + 1}
                          </span>
                          <p>{step}</p>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section className="grid gap-4 rounded-2xl border border-white/5 bg-slate-900/70 p-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                        Macros per serving
                      </h4>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                        <MacroPill label="Protein" value={`${recipe.macros.protein} g`} />
                        <MacroPill label="Carbs" value={`${recipe.macros.carbs} g`} />
                        <MacroPill label="Fat" value={`${recipe.macros.fat} g`} />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                        Dietary notes
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {recipe.dietary.length > 0 ? (
                          recipe.dietary.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200/70">
                            No specific tags
                          </span>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

type MetricProps = {
  label: string;
  value: string;
  accent?: string;
};

function Metric({ label, value, accent }: MetricProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/70 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-lg font-semibold text-white ${accent ?? ""}`}>{value}</p>
    </div>
  );
}

type MacroPillProps = {
  label: string;
  value: string;
};

function MacroPill({ label, value }: MacroPillProps) {
  return (
    <span className="rounded-full bg-slate-800/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200">
      {label}: <span className="text-emerald-200">{value}</span>
    </span>
  );
}
