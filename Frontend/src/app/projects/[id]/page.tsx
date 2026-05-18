import ProjectDetailsPage from "@/components/pages/ProjectDetailsPage";

type Props = {
  params: {
    id: string;
  };
};

export default function ProjectDetails({ params }: Props) {
  return <ProjectDetailsPage />;
}