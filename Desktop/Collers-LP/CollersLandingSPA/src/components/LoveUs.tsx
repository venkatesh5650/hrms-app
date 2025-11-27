import './LoveUs.css';

function LoveUs() {
  return (
    <section className="love-section reveal" id="resources">
      <div className="section-inner">
        <div className="love-header">
          <div>
            <p className="love-caption">Because they love us</p>
            <h2>What they say about us</h2>
          </div>

          <div className="love-arrows">
            <button className="circle-btn" aria-label="Previous testimonial">←</button>
            <button className="circle-btn active" aria-label="Next testimonial">→</button>
          </div>
        </div>

        <div className="love-grid">
          <article className="love-card">
            <div className="love-brand">
              <div className="brand-icon">A</div>
              <div>
                <h4>Alex Morgan</h4>
                <p>Product Manager</p>
              </div>
            </div>
            <p className="love-text">
              Collers helped our team discover rare sneakers effortlessly. The platform is smooth,
              reliable, and perfect for managing large collections with confidence.
            </p>
          </article>

          <article className="love-card">
            <div className="love-brand">
              <div className="brand-icon">S</div>
              <div>
                <h4>Sophia Williams</h4>
                <p>Startup Founder</p>
              </div>
            </div>
            <p className="love-text">
              From buying to reselling, Collers made the entire process simple and transparent.
              It’s now an essential tool for our sneaker trading business.
            </p>
          </article>

          <article className="love-card">
            <div className="love-brand">
              <div className="brand-icon">R</div>
              <div>
                <h4>Rohit Sharma</h4>
                <p>UI/UX Designer</p>
              </div>
            </div>
            <p className="love-text">
              I love how clean and intuitive the interface is. Managing my sneaker collection is
              now faster, more organized, and visually satisfying.
            </p>
          </article>

          <article className="love-card">
            <div className="love-brand">
              <div className="brand-icon">E</div>
              <div>
                <h4>Emily Carter</h4>
                <p>Marketing Lead</p>
              </div>
            </div>
            <p className="love-text">
              The analytics and product insights on Collers helped us understand market trends and
              customer demand better than any other tool we’ve used.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default LoveUs;
