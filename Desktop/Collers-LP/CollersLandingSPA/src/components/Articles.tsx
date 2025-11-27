import './Articles.css';

function Articles() {
  return (
    <section className="articles-section reveal" id="articles">
      <div className="section-inner">
        <div className="articles-header">
          <h2>Articles by Collectors</h2>
          <button className="link-btn">
            More Articles <span>→</span>
          </button>
        </div>

        <div className="articles-grid">
          <article className="article-card">
            <div className="article-image-wrapper">
              <img
                src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1764227275/95d0ce9b9581c176aeb8158a3de5eaa84e65ef72_g1pav4.jpg"
                alt="Sneaker Storage"
                className="article-img"
              />
            </div>
            <div className="article-body">
              <h3>How to Start Your Sneaker Collection</h3>
              <p>
                A beginner-friendly guide to choosing your first sneakers,
                building a strong collection, and avoiding common mistakes.
              </p>
              <button className="text-link">Read article</button>
            </div>
          </article>

          <article className="article-card">
            <div className="article-image-wrapper">
              <img
                src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1764227276/bd99a97c05d217b6762e275f8947f94619aa3461_uukauh.jpg"
                alt="Sneaker Marketplace"
                className="article-img"
              />
            </div>
            <div className="article-body">
              <h3>Top 10 Sneakers Every Collector Should Own</h3>
              <p>
                Discover the most valuable and iconic sneakers that continue to
                dominate the global sneaker market.
              </p>
              <button className="text-link">Read article</button>
            </div>
          </article>

          <article className="article-card">
            <div className="article-image-wrapper">
              <img
                src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1764227279/aacbe618a3f5f3d01dbd2b45bb346a735541522b_hgle5m.jpg"
                alt="Sneaker Care"
                className="article-img"
              />
            </div>
            <div className="article-body">
              <h3>How to Maintain and Protect Your Sneakers</h3>
              <p>
                Learn professional cleaning, storage, and protection tips to
                keep your sneakers in perfect condition for years.
              </p>
              <button className="text-link">Read article</button>
            </div>
          </article>

          <article className="article-card">
            <div className="article-image-wrapper">
              <img
                src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1764227456/f203e3545c332499cb4e77d6094e6871b3b3f8aa_1_eprjst.jpg"
                alt="Sneaker Investment"
                className="article-img"
              />
            </div>
            <div className="article-body">
              <h3>Sneaker Reselling: A Beginner’s Investment Guide</h3>
              <p>
                Understand resale value, market trends, and how to turn your
                sneaker passion into a profitable business.
              </p>
              <button className="text-link">Read article</button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Articles;
