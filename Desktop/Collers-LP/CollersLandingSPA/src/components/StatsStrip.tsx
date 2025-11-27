import './StatsStrip.css';

function StatsStrip() {
  return (
    <section className="stats-strip reveal" id="solutions">
      <div className="section-inner stats-inner">
        <div className="stat-item">
          <div className="stat-shape" />
          <h3>Verified Sellers</h3>
          <p>
            Buy with confidence from trusted and verified sneaker sellers across
            the global marketplace.
          </p>
        </div>

        <div className="stat-item">
          <div className="stat-shape green" />
          <h3>Real-Time Market Data</h3>
          <p>
            Track live pricing, market trends, and resale value with accurate
            real-time updates.
          </p>
        </div>

        <div className="stat-item">
          <div className="stat-shape purple" />
          <h3>Secure Transactions</h3>
          <p>
            Every transaction is protected with end-to-end security and
            guaranteed payment protection.
          </p>
        </div>
      </div>
    </section>
  );
}

export default StatsStrip;
