import { useState } from "react";

function Contact() {
  const email = "karthanvenkateshvenkatesh@gmail.com";
  const github = "https://github.com/venkatesh5650";
  const linkedin = "https://www.linkedin.com/in/karthan-venkatesh/";
  const phone = "+91 93923 72089";

  const [showMessage, setShowMessage] = useState(false);

  const handleEmailClick = () => {
    // Copy email to clipboard
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(email).catch(() => {});
    }

    // Try to open mail app
    window.location.href = `mailto:${email}?subject=MERN%20Developer%20Portfolio%20Enquiry&body=Hi%20Venkatesh,%0D%0A%0D%0AI%20visited%20your%20portfolio%20and%20would%20like%20to%20connect%20with%20you.`;

    // Show success message (no alert)
    setShowMessage(true);

    // Auto-hide message after 4 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <h2 className="section-title mb-3">Contact</h2>
        <p className="section-subtitle mb-4">
          Interested in working together or have any questions? Feel free to
          reach out.
        </p>

        <div className="row">
          <div className="col-md-6 mb-4">
            <h5 className="mb-3">Let&apos;s Connect</h5>
            <p className="mb-1">
              <strong>Email:</strong>{" "}
              <a href={`mailto:${email}`} className="contact-link">
                {email}
              </a>
            </p>
            <p className="mb-1">
              <strong>Phone:</strong>{" "}
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="contact-link"
              >
                {phone}
              </a>
            </p>
            <p className="mb-1">
              <strong>GitHub:</strong>{" "}
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="contact-link"
              >
                {github}
              </a>
            </p>
            <p className="mb-1">
              <strong>LinkedIn:</strong>{" "}
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="contact-link"
              >
                {linkedin}
              </a>
            </p>
            <p className="mb-0">
              <strong>Location:</strong> Hyderabad, India
            </p>
          </div>

          <div className="col-md-6">
            <h5 className="mb-3">Quick Message</h5>
            <p className="text-muted">
              Click the button below to contact me. Your email will be copied
              automatically if your mail app doesn’t open.
            </p>

            <button onClick={handleEmailClick} className="btn btn-primary me-2">
              Send Email
            </button>

            <a
              href="https://wa.me/919392372089"
              target="_blank"
              rel="noreferrer"
              className="btn btn-success"
            >
              WhatsApp Me
            </a>

            {/* ✅ Clean success message instead of alert */}
            {showMessage && (
              <div className="email-toast mt-3">
                ✅ Email copied! If your mail app didn’t open, paste it into
                Gmail or any email app.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
