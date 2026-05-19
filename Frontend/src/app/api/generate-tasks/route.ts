import { NextResponse } from "next/server";
import { generateTasksWithAI } from "@/services/ai/taskGenerator";

export async function POST(req: Request) {
  try {
    // Récupérer les données du corps de la requête
    const body = await req.json();

    console.log("BODY :", body);
    // Appeler la fonction pour générer les tâches avec l'IA
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