import "./Hero.css";

function Hero() {
  return (
    <section id="hero" className="hero reveal">
      <div className="section-inner hero-inner">
        <div className="hero-text">
          <p className="hero-caption">Collectible Sneakers</p>

          <h1 className="hero-title">
            Discover, Collect & Trade Premium Sneakers
          </h1>

          <p className="hero-desc">
            Explore a curated marketplace of rare and trending sneakers from top brands. 
            Buy, sell, and grow your sneaker collection with ease and confidence on one 
            powerful platform.
          </p>

          <div className="hero-actions">
            <button className="btn primary">Sign up now</button>
            <button className="btn secondary">Watch Demo</button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-shape main" />
            <div className="hero-shape accent" />

            <img
              src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1764223787/Col_qjtfli.png"
              alt="Hero Shoe"
              className="hero-image"
            />

            <div className="shoe-placeholder">Shoe image</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
