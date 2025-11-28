function ProjectCard({ project }) {
  return (
    <div className="col-md-6 col-lg-6 mb-4">
      <div className="card h-100 shadow-sm project-card">
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="card-title mb-0">{project.name}</h5>
            <span className="badge bg-primary">{project.type}</span>
          </div>
          <p className="text-muted mb-2">{project.tagline}</p>
          <p className="card-text flex-grow-1">{project.description}</p>
          <p className="project-tech mt-2">
            <strong>Tech Stack: </strong>
            {project.techStack}
          </p>
          <div className="mt-3 d-flex gap-2 flex-wrap">
            <a
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-primary"
            >
              Live Demo
            </a>
            <a
              href={project.githubLink}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline-secondary"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
