function Hero() {
  return (
    <section className="hero-section">
      <div className="container py-5">
        <div className="row align-items-center">
          {/* LEFT TEXT */}
          <div className="col-lg-7">
            <p className="hero-intro mb-2">Hi, I'm</p>

            <h1 className="hero-title mb-2">
              Venkatesh <span className="hero-highlight">Karthan</span>
            </h1>

            <h2 className="hero-subtitle mb-3">MERN Stack Developer</h2>

            <p className="hero-text mb-4">
              I’m an aspiring MERN Stack Developer with a strong foundation in
              HTML, CSS, Bootstrap, JavaScript, and React. I enjoy building clean
              and responsive web applications that focus on clarity and
              usability. I’m continuously improving my skills by building
              real-world projects and exploring full stack development step by
              step.
            </p>

            <div className="d-flex gap-3 flex-wrap">
              <a href="#projects" className="btn btn-light btn-lg hero-btn">
                View Projects
              </a>
              <a
                href="#contact"
                className="btn btn-outline-light btn-lg hero-btn-outline"
              >
                Contact Me
              </a>
            </div>
          </div>

          {/* RIGHT INFO CARD */}
          <div className="col-lg-5 mt-4 mt-lg-0">
            <div className="hero-card">
              <p className="label mb-1">Based In</p>
              <h5 className="mb-3">Hyderabad, India</h5>

              <p className="label mb-1">Current Focus</p>
              <p className="mb-3">
                Building{" "}
                <span className="hero-highlight">
                  Full Stack MERN Projects
                </span>{" "}
                and strengthening backend & React skills.
              </p>

              <p className="label mb-1">Contact</p>
              <p className="mb-0 fw-semibold">
                📞 +91 93923 72089
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
