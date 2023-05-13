import { Header } from "./header";
import { ProjectsView } from "./projects";

export default function Projects() {
  return (
    <div className="w-full h-full py-8 flex flex-col gap-8">
      <Header />
      <ProjectsView />
    </div>
  );
}
