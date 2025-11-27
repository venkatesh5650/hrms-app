import './BestSection.css';

function BestSection() {
  return (
    <section className="best-section reveal" id="pricing">
      <div className="section-inner">
        <div className="best-header">
          <h2>The best of the best</h2>
          <button className="btn primary">Sign up now</button>
        </div>

        <div className="best-grid">
          <article className="best-card">
            <div className="best-image-wrapper">
              <img
                src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1764228639/1c5867c1ae5c8652360f15ed8928bae486c8af2a_1_pygowb.jpg"
                alt="Shoe"
                className="shoe-image"
              />
            </div>
            <div className="best-body">
              <h3>Title</h3>
              <p>
                Excepteur ea ad adipisicing qui ea pariatur aliquip vitae
                habitasse.
              </p>
              <button className="buy-btn">
                <span>Buy Now</span>
                <span className="arrow">→</span>
              </button>
            </div>
          </article>

          <article className="best-card">
            <div className="best-image-wrapper">
              <img
                src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1764228601/c5b9139cf57074dcff92be506ebd3ca26296b822_1_um8vmg.jpg"
                alt="Shoe"
                className="shoe-image"
              />
            </div>
            <div className="best-body">
              <h3>Title</h3>
              <p>
                Excepteur ea ad adipisicing qui ea pariatur aliquip vitae
                habitasse.
              </p>
              <button className="buy-btn">
                <span>Buy Now</span>
                <span className="arrow">→</span>
              </button>
            </div>
          </article>

          <article className="best-card">
            <div className="best-image-wrapper">
              <img
                src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1764227674/dca186a50d88eb3d3af7ffd32f03165632eb5422_1_twf1di.jpg"
                alt="Shoe"
                className="shoe-image"
              />
            </div>
            <div className="best-body">
              <h3>Title</h3>
              <p>
                Excepteur ea ad adipisicing qui ea pariatur aliquip vitae
                habitasse.
              </p>
              <button className="buy-btn">
                <span>Buy Now</span>
                <span className="arrow">→</span>
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default BestSection;
