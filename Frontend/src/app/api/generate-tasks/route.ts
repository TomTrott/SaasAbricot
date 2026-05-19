import { NextResponse } from "next/server";
import { generateTasksWithAI } from "@/services/ai/taskGenerator";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("BODY :", body);

    const result = await generateTasksWithAI(body.prompt);

    console.log("RESULT :", result);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API ERROR :", error);

    return NextResponse.json(
      {
        error: error.message || "Erreur serveur",
      },
      {
        status: 500,
      }
    );
  }
}