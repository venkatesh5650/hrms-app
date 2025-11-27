import './GrowCollection.css';

function GrowCollection() {
  return (
    <section className="grow-section reveal" id="grow">
      <div className="section-inner grow-inner">
        <div className="grow-text">
          <h2>Grow your sneaker collection</h2>

          <p className="grow-desc">
            Discover trending sneakers, track your collection value, and expand your portfolio
            with confidence. Collers helps you manage, buy, and grow your sneaker assets in one
            powerful platform.
          </p>

          <ul className="grow-tabs">
            <li className="active">Trending Sneakers</li>
            <li>New Arrivals</li>
            <li>Limited Editions</li>
            <li>Top Brands</li>
            <li>Price Drops</li>
            <li>Most Collected</li>
          </ul>
        </div>

        <div className="grow-image-wrapper">
          <img
            src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1764228346/exact_gfu12s.png"
            alt="Grow Collection"
            className="grow-image"
          />
        </div>
      </div>
    </section>
  );
}

export default GrowCollection;
