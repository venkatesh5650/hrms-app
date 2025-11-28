function Education() {
  return (
    <section className="section bg-light">
      <div className="container">
        <h2 className="section-title mb-3">Education</h2>
        <p className="section-subtitle mb-4">
          My academic background and formal education.
        </p>

        <div className="card shadow-sm education-card">
          <div className="card-body">
            <h5 className="card-title">
              Bachelor of Computer Applications (BCA)
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              Specialization: Computer Applications
            </h6>
            <p className="mb-1">
              <strong>College:</strong> Government City College Nayapul,
              Hyderabad
            </p>
            <p className="mb-1">
              <strong>Year of Completion:</strong> August 2024
            </p>
            <p className="mb-0">
              <strong>Location:</strong> Hyderabad, India
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Education;
