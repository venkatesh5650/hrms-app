import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

function Projects() {
  return (
    <section className="section bg-light">
      <div className="container">
        <h2 className="section-title mb-3">Projects</h2>
        <p className="section-subtitle mb-4">
          A selection of my recent work showcasing both frontend and full stack
          development.
        </p>
        <div className="row">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
