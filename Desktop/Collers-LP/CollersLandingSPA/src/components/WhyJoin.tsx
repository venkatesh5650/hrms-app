import "./WhyJoin.css";

function WhyJoin() {
  return (
    <section className="why-section reveal" id="why">
      <div className="section-inner why-inner">
        <div className="why-card">
          <h2>Why join us</h2>

          <p className="why-lead">
            Join a trusted platform built for sneaker enthusiasts, collectors,
            and resellers who want a smarter way to manage their collections.
          </p>

          <ul className="why-list">
            <li>Access exclusive and verified sneaker collections.</li>
            <li>Track market trends and real-time price updates.</li>
            <li>Buy, sell, and manage your collection with confidence.</li>
          </ul>

          <button className="btn primary">Sign up now</button>
        </div>

        <div className="why-visual">
          <div className="why-image-wrapper">
            <img
              src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1764228142/Video_op82tj.png"
              alt="Video Thumbnail"
              className="why-video-thumb"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyJoin;
