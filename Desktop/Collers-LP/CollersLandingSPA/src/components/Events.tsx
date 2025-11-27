import './Events.css';

function Events() {
  return (
    <section className="events-section reveal" id="events">
      <div className="section-inner">
        <div className="events-header">
          <h2>Upcoming sneaker events</h2>
          <button className="link-btn">
            Explore Events <span>→</span>
          </button>
        </div>

        <div className="events-grid">
          <article className="event-card">
            <p className="event-label">Launch Event</p>
            <h3>Global Sneaker Expo 2025</h3>

            <div className="event-image-wrapper">
              <img
                src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1764227660/47a6c08abf0df7426325e809618f746ca7541e41_lsygss.jpg"
                alt="Sneaker Expo"
                className="event-img"
              />
            </div>

            <p className="event-desc">
              Join the world’s biggest sneaker exhibition featuring exclusive
              drops, collectors, and global sneaker brands.
            </p>
            <button className="text-link">
              Buy Tickets <span>→</span>
            </button>
          </article>

          <article className="event-card">
            <p className="event-label">Workshop</p>
            <h3>Sneaker Trading Masterclass</h3>

            <div className="event-image-wrapper">
              <img
                src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1764227660/44cff23e60e74c13188fa658bca911bdc16024c0_azab5c.jpg"
                alt="Sneaker Workshop"
                className="event-img"
              />
            </div>

            <p className="event-desc">
              Learn how to buy, sell, and invest in sneakers from industry
              experts and experienced resellers.
            </p>
            <button className="text-link">
              Buy Tickets <span>→</span>
            </button>
          </article>

          <article className="event-card">
            <p className="event-label">Community Meetup</p>
            <h3>Sneaker Collectors Meet-up</h3>

            <div className="event-image-wrapper">
              <img
                src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1764227686/f862e11e2bd8633f57482865e9d514a606dbb6ff_hpchud.jpg"
                alt="Collectors Meetup"
                className="event-img"
              />
            </div>

            <p className="event-desc">
              Connect with fellow sneaker enthusiasts, exchange collections,
              and network with verified collectors.
            </p>
            <button className="text-link">
              Buy Tickets <span>→</span>
            </button>
          </article>

          <article className="event-card">
            <p className="event-label">Limited Drop</p>
            <h3>Exclusive Brand Collaboration Launch</h3>

            <div className="event-image-wrapper">
              <img
                src="https://res.cloudinary.com/dpiu7mohv/image/upload/v1764227674/dca186a50d88eb3d3af7ffd32f03165632eb5422_1_twf1di.jpg"
                alt="Exclusive Sneaker Drop"
                className="event-img"
              />
            </div>

            <p className="event-desc">
              Be the first to access rare sneaker releases from top brands in a
              high-demand limited-edition drop event.
            </p>
            <button className="text-link">
              Buy Tickets <span>→</span>
            </button>
          </article>
        </div>
      </div>
    </section>
  );
}

export default Events;
