// src/services/ai/taskGenerator.ts

interface GeneratedTask {
  title: string;
  description: string;
}

interface TaskGenerationResult {
  tasks: GeneratedTask[];
}

export async function generateTasksWithAI(
  prompt: string
): Promise<TaskGenerationResult> {
  const lowerPrompt = prompt.toLowerCase();

  // =========================
  // APP DE LIVRAISON
  // =========================
  if (
    lowerPrompt.includes("livraison") ||
    lowerPrompt.includes("delivery")
  ) {
    return {
      tasks: [
        {
          title: "Créer l'authentification",
          description:
            "Permettre aux utilisateurs de créer un compte et se connecter.",
        },
        {
          title: "Créer le dashboard",
          description:
            "Afficher les commandes et les statistiques principales.",
        },
        {
          title: "Ajouter les restaurants",
          description:
            "Créer la gestion des restaurants et des menus.",
        },
        {
          title: "Créer le panier",
          description:
            "Permettre aux utilisateurs d'ajouter des produits au panier.",
        },
        {
          title: "Ajouter le paiement",
          description:
            "Intégrer un système de paiement sécurisé.",
        },
        {
          title: "Créer le suivi livraison",
          description:
            "Afficher le statut des livraisons en temps réel.",
        },
        {
          title: "Créer les notifications",
          description:
            "Envoyer des notifications pour les commandes.",
        },
      ],
    };
  }

  // =========================
  // SAAS / GESTION DE PROJET
  // =========================
  if (
    lowerPrompt.includes("saas") ||
    lowerPrompt.includes("gestion") ||
    lowerPrompt.includes("projet")
  ) {
    return {
      tasks: [
        {
          title: "Créer l'authentification",
          description:
            "Ajouter la connexion et l'inscription utilisateur.",
        },
        {
          title: "Créer les projets",
          description:
            "Permettre la création et la gestion des projets.",
        },
        {
          title: "Créer les tâches",
          description:
            "Ajouter un système de tâches avec statuts.",
        },
        {
          title: "Créer le dashboard",
          description:
            "Afficher les statistiques et projets récents.",
        },
        {
          title: "Ajouter les collaborateurs",
          description:
            "Permettre l'invitation des membres.",
        },
        {
          title: "Créer les commentaires",
          description:
            "Permettre les échanges entre collaborateurs.",
        },
        {
          title: "Créer les notifications",
          description:
            "Notifier les utilisateurs des changements.",
        },
      ],
    };
  }

  // =========================
  // E-COMMERCE
  // =========================
  if (
    lowerPrompt.includes("ecommerce") ||
    lowerPrompt.includes("e-commerce") ||
    lowerPrompt.includes("boutique") ||
    lowerPrompt.includes("shop")
  ) {
    return {
      tasks: [
        {
          title: "Créer les produits",
          description:
            "Ajouter la gestion des produits et catégories.",
        },
        {
          title: "Créer le panier",
          description:
            "Permettre l'ajout de produits au panier.",
        },
        {
          title: "Créer le checkout",
          description:
            "Développer le tunnel de commande.",
        },
        {
          title: "Ajouter le paiement",
          description:
            "Intégrer Stripe ou PayPal.",
        },
        {
          title: "Créer les commandes",
          description:
            "Afficher et gérer les commandes utilisateurs.",
        },
        {
          title: "Créer les avis clients",
          description:
            "Permettre aux clients de laisser des avis.",
        },
        {
          title: "Créer le dashboard admin",
          description:
            "Permettre la gestion complète de la boutique.",
        },
      ],
    };
  }

  // =========================
  // SITE VITRINE
  // =========================
  if (
    lowerPrompt.includes("site vitrine") ||
    lowerPrompt.includes("portfolio") ||
    lowerPrompt.includes("vitrine")
  ) {
    return {
      tasks: [
        {
          title: "Créer la landing page",
          description:
            "Développer une page d'accueil moderne.",
        },
        {
          title: "Créer la section services",
          description:
            "Présenter les services proposés.",
        },
        {
          title: "Créer la section contact",
          description:
            "Ajouter un formulaire de contact.",
        },
        {
          title: "Créer la navigation",
          description:
            "Ajouter un menu responsive.",
        },
        {
          title: "Optimiser le SEO",
          description:
            "Améliorer le référencement du site.",
        },
        {
          title: "Ajouter les animations",
          description:
            "Créer des animations modernes et fluides.",
        },
      ],
    };
  }

  // =========================
  // API REST
  // =========================
  if (
    lowerPrompt.includes("api") ||
    lowerPrompt.includes("rest")
  ) {
    return {
      tasks: [
        {
          title: "Configurer le serveur",
          description:
            "Initialiser le backend et la structure API.",
        },
        {
          title: "Créer l'authentification JWT",
          description:
            "Sécuriser les routes avec JWT.",
        },
        {
          title: "Créer les routes CRUD",
          description:
            "Ajouter les endpoints principaux.",
        },
        {
          title: "Connecter la base de données",
          description:
            "Configurer MongoDB ou PostgreSQL.",
        },
        {
          title: "Ajouter la validation",
          description:
            "Valider les données entrantes.",
        },
        {
          title: "Créer la documentation",
          description:
            "Documenter l'API avec Swagger.",
        },
        {
          title: "Ajouter les middlewares",
          description:
            "Créer la gestion des erreurs et logs.",
        },
      ],
    };
  }

  // =========================
  // APPLICATION MOBILE
  // =========================
  if (
    lowerPrompt.includes("mobile") ||
    lowerPrompt.includes("ios") ||
    lowerPrompt.includes("android")
  ) {
    return {
      tasks: [
        {
          title: "Créer les écrans",
          description:
            "Développer les interfaces mobiles.",
        },
        {
          title: "Créer la navigation",
          description:
            "Configurer la navigation entre pages.",
        },
        {
          title: "Ajouter l'authentification",
          description:
            "Permettre la connexion utilisateur.",
        },
        {
          title: "Connecter l'API",
          description:
            "Relier l'application au backend.",
        },
        {
          title: "Créer les notifications",
          description:
            "Ajouter les notifications push.",
        },
        {
          title: "Optimiser les performances",
          description:
            "Améliorer la fluidité de l'application.",
        },
      ],
    };
  }

  // =========================
  // BLOG
  // =========================
  if (
    lowerPrompt.includes("blog") ||
    lowerPrompt.includes("article")
  ) {
    return {
      tasks: [
        {
          title: "Créer les articles",
          description:
            "Ajouter la gestion des articles.",
        },
        {
          title: "Créer les catégories",
          description:
            "Organiser les contenus du blog.",
        },
        {
          title: "Créer les commentaires",
          description:
            "Permettre les réactions utilisateurs.",
        },
        {
          title: "Optimiser le SEO",
          description:
            "Améliorer le référencement des articles.",
        },
        {
          title: "Créer le dashboard admin",
          description:
            "Permettre la gestion du contenu.",
        },
      ],
    };
  }

  // =========================
  // FALLBACK
  // =========================
  return {
    tasks: [
      {
        title: "Analyser le projet",
        description:
          "Définir les besoins principaux de l'application.",
      },
      {
        title: "Créer le frontend",
        description:
          "Développer l'interface utilisateur principale.",
      },
      {
        title: "Créer le backend",
        description:
          "Développer l'API et la logique serveur.",
      },
      {
        title: "Créer la base de données",
        description:
          "Configurer le stockage des données.",
      },
      {
        title: "Tester l'application",
        description:
          "Vérifier le bon fonctionnement global.",
      },
      {
        title: "Déployer le projet",
        description:
          "Mettre l'application en production.",
      },
    ],
  };
}