function Footer() {
  return (
    <footer className="footer py-3 mt-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <span className="text-muted">
          © {new Date().getFullYear()} Venkatesh Karthan. All rights reserved.
        </span>
        <span className="text-muted small">
          Built with React, Bootstrap, and continuous learning.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
