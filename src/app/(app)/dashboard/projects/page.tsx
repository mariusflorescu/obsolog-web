import { Header } from "../../../../components/project/header";
import { ProjectsView } from "../../../../components/project/projects";

export default function Projects() {
  return (
    <div className="w-full h-full py-8 flex flex-col gap-8">
      <Header />
      <ProjectsView />
    </div>
  );
}
