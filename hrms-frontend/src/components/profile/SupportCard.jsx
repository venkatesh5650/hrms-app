import "../../styles/dashboard/supportCard.css";

export default function SupportCard() {
  return (
    <div className="card support-card">
      <div className="support-header">
        <div className="support-icon">💬</div>
        <h3>Need Help?</h3>
      </div>

      <p className="support-sub">
        For account access or team changes, you can:
      </p>

      <ul className="support-list">
        <li>Contact your HR representative</li>
        <li>Reach out to your Manager</li>
      </ul>

      <div className="support-footer">
        <span>We're here to help 🤝</span>
      </div>
    </div>
  );
}
