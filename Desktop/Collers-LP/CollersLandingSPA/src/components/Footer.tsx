import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="section-inner footer-inner">
        <div className="footer-top">
          <div className="footer-col">
            <h3>Collers</h3>
            <p>
              Rhoncus morbi et augue nec, in id ullamcorper at sit.
            </p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li>Overview</li>
              <li>Pricing</li>
              <li>Design</li>
              <li>Accessibility</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Solutions</h4>
            <ul>
              <li>Brainstorming</li>
              <li>Ideation</li>
              <li>Research</li>
              <li>Reports</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li>Developers</li>
              <li>Documentation</li>
              <li>Integrations</li>
              <li>Contact</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Get the App</h4>
            <div className="store-badges">
              <div className="store-badge">App Store</div>
              <div className="store-badge">Google Play</div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Collers © 2023. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
