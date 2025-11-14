"use client";

import { useMemo, useState } from "react";
import { allIngredients } from "@/lib/recipe-engine";

type IngredientInputProps = {
  selectedIngredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
};

const MAX_FILE_SIZE_MB = 5;
const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export function IngredientInput({
  selectedIngredients,
  onAddIngredient,
  onRemoveIngredient,
}: IngredientInputProps) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [detected, setDetected] = useState<string[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  const normalizedSelected = useMemo(
    () => selectedIngredients.map((item) => item.toLowerCase()),
    [selectedIngredients],
  );

  const filteredSuggestions = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return [];
    return allIngredients
      .filter(
        (ingredient) =>
          ingredient.includes(trimmedQuery) && !normalizedSelected.includes(ingredient),
      )
      .slice(0, 8);
  }, [query, normalizedSelected]);

  const handleAdd = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned) {
      setError("Add at least one ingredient.");
      return;
    }
    const normalized = cleaned.toLowerCase();
    if (normalizedSelected.includes(normalized)) {
      setError("That ingredient is already added.");
      return;
    }
    onAddIngredient(cleaned);
    setQuery("");
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleAdd(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleAdd(suggestion);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    setDetectionError(null);
    setDetected([]);
    if (!nextFile) {
      setFile(null);
      setUploadError(null);
      return;
    }
    if (!SUPPORTED_IMAGE_TYPES.includes(nextFile.type)) {
      setUploadError("Unsupported file type. Please upload a JPG, PNG, or WebP image.");
      setFile(null);
      return;
    }
    if (nextFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      setFile(null);
      return;
    }
    setFile(nextFile);
    setUploadError(null);
  };

  const detectIngredients = async () => {
    if (!file) {
      setUploadError("Select an image to detect ingredients.");
      return;
    }
    setIsDetecting(true);
    setDetectionError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/clarifai", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error ?? "Image recognition failed.");
      }
      const data = (await response.json()) as { ingredients?: string[] };
      const ingredients = data.ingredients ?? [];
      setDetected(ingredients);
      if (!ingredients.length) {
        setDetectionError("No ingredients recognized. Try a clearer image.");
      }
    } catch (err) {
      setDetectionError(
        err instanceof Error ? err.message : "Unable to process the image right now.",
      );
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-xl shadow-indigo-500/10">
      <header className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold text-white">Ingredients on hand</h2>
        <p className="text-sm text-slate-200/70">
          Search or add ingredients manually, or snap a photo to let AI detect pantry items
          for you.
        </p>
      </header>

      <form className="relative" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="ingredient-input">
          Ingredient
        </label>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 ring-1 ring-transparent transition focus-within:ring-2 focus-within:ring-emerald-400/70">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-5 w-5 text-slate-300/60"
          >
            <path d="m19 19-3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={11} cy={11} r={6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            id="ingredient-input"
            placeholder="Type an ingredient and press Enter"
            className="flex-1 bg-transparent text-base text-white placeholder:text-slate-400"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setError(null);
            }}
            onFocus={() => setError(null)}
            autoComplete="off"
          />
          <button
            type="submit"
            className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-emerald-400"
          >
            Add
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}

        {filteredSuggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-[72px] z-20 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-lg shadow-slate-950/60">
            {filteredSuggestions.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-slate-200 transition hover:bg-emerald-400/10"
                >
                  {suggestion}
                  <span className="text-xs uppercase tracking-wide text-slate-400">
                    add
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>

      {selectedIngredients.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {selectedIngredients.map((ingredient) => (
            <span
              key={ingredient}
              className="group flex items-center gap-2 rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-medium text-emerald-200 ring-1 ring-emerald-400/50"
            >
              {ingredient}
              <button
                type="button"
                onClick={() => onRemoveIngredient(ingredient)}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-100 transition group-hover:bg-emerald-300/50 group-hover:text-emerald-950"
                aria-label={`Remove ${ingredient}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 rounded-2xl border border-white/5 bg-slate-900/50 p-6 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-white/90">
            Upload pantry or fridge photo
            <span className="ml-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              optional
            </span>
          </label>
          <input
            type="file"
            accept={SUPPORTED_IMAGE_TYPES.join(",")}
            onChange={handleFileChange}
            className="block w-full cursor-pointer rounded-xl border border-dashed border-white/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-950 hover:file:bg-emerald-300"
          />
          {uploadError && <p className="text-sm text-rose-300">{uploadError}</p>}
          {file && (
            <p className="text-xs text-slate-400">
              Selected: <span className="font-medium text-slate-200">{file.name}</span>{" "}
              · {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={isDetecting}
            onClick={detectIngredients}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-400 px-5 py-3 text-sm font-semibold text-indigo-950 transition hover:bg-indigo-300 disabled:cursor-not-allowed disabled:bg-indigo-400/60"
          >
            {isDetecting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-900/30 border-t-indigo-900/90" />
                Detecting…
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="h-5 w-5"
                >
                  <path
                    d="M4 7v10m0-10c0-.943 0-1.414.293-1.707C4.586 5 5.057 5 6 5h12c.943 0 1.414 0 1.707.293C20 5.586 20 6.057 20 7m-16 0c0 .943 0 1.414.293 1.707C4.586 9 5.057 9 6 9h12c.943 0 1.414 0 1.707-.293C20 8.414 20 7.943 20 7m0 0v10c0 .943 0 1.414-.293 1.707C19.414 19 18.943 19 18 19H6c-.943 0-1.414 0-1.707-.293C4 18.414 4 17.943 4 17m6-4h4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Detect Ingredients
              </>
            )}
          </button>
          <p className="text-xs text-slate-400">
            Powered by Clarifai Food Model. Recognition works best with good lighting and a
            clear view of ingredients.
          </p>
          {detectionError && <p className="text-sm text-rose-300">{detectionError}</p>}
        </div>
      </div>

      {detected.length > 0 && (
        <div className="mt-6 space-y-3 rounded-2xl border border-emerald-500/30 bg-emerald-400/10 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-200">
            Suggested ingredients
          </p>
          <div className="flex flex-wrap gap-2">
            {detected.map((ingredient) => (
              <button
                key={ingredient}
                type="button"
                onClick={() => handleAdd(ingredient)}
                className="rounded-full bg-slate-950/70 px-4 py-2 text-sm font-medium capitalize text-emerald-100 ring-1 ring-emerald-400/40 transition hover:bg-emerald-400 hover:text-emerald-950"
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
