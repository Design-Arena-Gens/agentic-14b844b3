import { NextResponse } from "next/server";

const CLARIFAI_MODEL_ID = "food-item-v1";
const CLARIFAI_API_URL = `https://api.clarifai.com/v2/models/${CLARIFAI_MODEL_ID}/outputs`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.CLARIFAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Clarifai API key is not configured on the server." },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const clarifaiResponse = await fetch(CLARIFAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [
          {
            data: {
              image: {
                base64,
              },
            },
          },
        ],
      }),
    });

    const json = await clarifaiResponse.json();

    if (!clarifaiResponse.ok) {
      const errorMessage =
        json?.status?.description ?? "Unable to detect ingredients. Try another photo.";
      return NextResponse.json({ error: errorMessage }, { status: clarifaiResponse.status });
    }

    const concepts = json?.outputs?.[0]?.data?.concepts;
    if (!Array.isArray(concepts)) {
      return NextResponse.json({ ingredients: [] }, { status: 200 });
    }

    const ingredients = concepts
      .filter(
        (concept: { name?: string; value?: number }) =>
          typeof concept.name === "string" && typeof concept.value === "number" && concept.value >= 0.85,
      )
      .slice(0, 12)
      .map((concept: { name: string }) => concept.name);

    return NextResponse.json({ ingredients }, { status: 200 });
  } catch (error) {
    console.error("Clarifai detection failed:", error);
    return NextResponse.json(
      { error: "Something went wrong while processing the image. Please try again." },
      { status: 500 },
    );
  }
}
