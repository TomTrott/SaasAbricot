//mock data for projects and tasks
export const tasks = [
  {
    id: "1",
    title: "Landing page",
    description: "Créer la page d'accueil",
    status: "TODO",
    priority: "HIGH",
    dueDate: "2025-03-09",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-01",
    projectId: "project-1",
    creatorId: "user-1",
    project: "Site vitrine",
    comments: 2,
  },

  {
    id: "2",
    title: "Design mobile",
    description: "Responsive tablette/mobile",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "2025-03-11",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-01",
    projectId: "project-1",
    creatorId: "user-1",
    project: "Application",
    comments: 5,
  },

  {
    id: "3",
    title: "API Auth",
    description: "Connexion utilisateur",
    status: "TODO",
    priority: "LOW",
    dueDate: "2025-03-12",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-01",
    projectId: "project-2",
    creatorId: "user-1",
    project: "Backend",
    comments: 1,
  },

  {
    id: "4",
    title: "Dashboard",
    description: "Création du tableau de bord",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2025-03-14",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-01",
    projectId: "project-2",
    creatorId: "user-1",
    project: "Abricot",
    comments: 4,
  },

  {
    id: "5",
    title: "Navbar",
    description: "Menu responsive",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    dueDate: "2025-03-15",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-01",
    projectId: "project-3",
    creatorId: "user-1",
    project: "Frontend",
    comments: 2,
  },

  {
    id: "6",
    title: "Kanban",
    description: "Vue colonnes des tâches",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2025-03-16",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-01",
    projectId: "project-3",
    creatorId: "user-1",
    project: "UI Design",
    comments: 6,
  },

  {
    id: "7",
    title: "Footer",
    description: "Footer global",
    status: "DONE",
    priority: "LOW",
    dueDate: "2025-03-05",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-01",
    projectId: "project-4",
    creatorId: "user-1",
    project: "Frontend",
    comments: 1,
  },

  {
    id: "8",
    title: "Login",
    description: "Page de connexion",
    status: "DONE",
    priority: "MEDIUM",
    dueDate: "2025-03-06",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-01",
    projectId: "project-4",
    creatorId: "user-1",
    project: "Abricot",
    comments: 3,
  },

  {
    id: "9",
    title: "Register",
    description: "Page d'inscription",
    status: "DONE",
    priority: "LOW",
    dueDate: "2025-03-07",
    createdAt: "2025-03-01",
    updatedAt: "2025-03-01",
    projectId: "project-4",
    creatorId: "user-1",
    project: "Abricot",
    comments: 2,
  },
];

// Mock data for projects and members

export type ProjectMemberRole =
  | "OWNER"
  | "ADMIN"
  | "CONTRIBUTOR";

export type ProjectMember = {
  id: string;
  role: ProjectMemberRole;
  joinedAt: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    avatar: string;
  };
};

export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  tasksCompleted: number;
  totalTasks: number;
  members: ProjectMember[];
};

export const projects: Project[] = [
  {
    id: "project_1",
    name: "API REST V2",
    description: "Développement de la nouvelle version de l'API REST avec authentification JWT",
    createdAt: "2026-05-01",
    updatedAt: "2026-05-10",
    ownerId: "user_1",
    tasksCompleted: 2,
    totalTasks: 8,
    members: [
      {
        id: "member_1",
        role: "OWNER",
        joinedAt: "2026-05-01",
        user: {
          id: "user_1",
          firstname: "Alice",
          lastname: "Dupont",
          avatar: "AD",
        },
      },
      {
        id: "member_2",
        role: "CONTRIBUTOR",
        joinedAt: "2026-05-02",
        user: {
          id: "user_2",
          firstname: "Bastien",
          lastname: "Colin",
          avatar: "BC",
        },
      },
      {
        id: "member_3",
        role: "CONTRIBUTOR",
        joinedAt: "2026-05-03",
        user: {
          id: "user_3",
          firstname: "Clara",
          lastname: "Vidal",
          avatar: "CV",
        },
      },
    ],
  },
  {
    id: "project_2",
    name: "Dashboard Analytics",
    description:
      "Création d'un tableau de bord analytique avec graphiques temps réel",
    createdAt: "2026-05-03",
    updatedAt: "2026-05-12",
    ownerId: "user_1",
    tasksCompleted: 5,
    totalTasks: 10,
    members: [
      {
        id: "member_4",
        role: "OWNER",
        joinedAt: "2026-05-03",
        user: {
          id: "user_1",
          firstname: "Alice",
          lastname: "Dupont",
          avatar: "AD",
        },
      },
      {
        id: "member_5",
        role: "ADMIN",
        joinedAt: "2026-05-05",
        user: {
          id: "user_4",
          firstname: "David",
          lastname: "Morel",
          avatar: "DM",
        },
      },
      {
        id: "member_6",
        role: "CONTRIBUTOR",
        joinedAt: "2026-05-06",
        user: {
          id: "user_5",
          firstname: "Emma",
          lastname: "Robert",
          avatar: "ER",
        },
      },
    ],
  },
  {
    id: "project_3",
    name: "Application Mobile",
    description:
      "Développement de l'application mobile iOS et Android",
    createdAt: "2026-05-06",
    updatedAt: "2026-05-14",
    ownerId: "user_2",
    tasksCompleted: 7,
    totalTasks: 12,
    members: [
      {
        id: "member_7",
        role: "OWNER",
        joinedAt: "2026-05-06",
        user: {
          id: "user_2",
          firstname: "Bastien",
          lastname: "Colin",
          avatar: "BC",
        },
      },
      {
        id: "member_8",
        role: "CONTRIBUTOR",
        joinedAt: "2026-05-07",
        user: {
          id: "user_1",
          firstname: "Alice",
          lastname: "Dupont",
          avatar: "AD",
        },
      },
      {
        id: "member_9",
        role: "CONTRIBUTOR",
        joinedAt: "2026-05-08",
        user: {
          id: "user_6",
          firstname: "Lucas",
          lastname: "Martin",
          avatar: "LM",
        },
      },
    ],
  },
  {
    id: "project_4",
    name: "Refonte Frontend",
    description:
      "Migration complète du frontend vers React et TypeScript",
    createdAt: "2026-05-08",
    updatedAt: "2026-05-14",
    ownerId: "user_3",
    tasksCompleted: 9,
    totalTasks: 14,
    members: [
      {
        id: "member_10",
        role: "OWNER",
        joinedAt: "2026-05-08",
        user: {
          id: "user_3",
          firstname: "Clara",
          lastname: "Vidal",
          avatar: "CV",
        },
      },
      {
        id: "member_11",
        role: "ADMIN",
        joinedAt: "2026-05-09",
        user: {
          id: "user_1",
          firstname: "Alice",
          lastname: "Dupont",
          avatar: "AD",
        },
      },
      {
        id: "member_12",
        role: "CONTRIBUTOR",
        joinedAt: "2026-05-10",
        user: {
          id: "user_5",
          firstname: "Emma",
          lastname: "Robert",
          avatar: "ER",
        },
      },
    ],
  },
];