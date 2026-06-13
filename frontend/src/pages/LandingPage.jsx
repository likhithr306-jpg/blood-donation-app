import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      <section className="hero-section text-white bg-gradient-red py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-5 fw-bold">Give Blood. Save Lives.</h1>
              <p className="lead">Join our Blood Donation Management System and help connect donors with patients in need.</p>
              <div className="d-flex gap-2 mt-4">
                <Link className="btn btn-light btn-lg" to="/register">Register</Link>
                <Link className="btn btn-outline-light btn-lg" to="/login">Login</Link>
              </div>
            </div>
            <div className="col-md-6 text-center">
              <div className="card bg-white text-dark section-card p-4 shadow-lg">
                <h4 className="mb-3">Emergency Blood Request</h4>
                <p>Immediate support for urgent transfusion needs and hospital matching in your area.</p>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Fast donor activation</li>
                  <li className="list-group-item">Nearby hospital availability</li>
                  <li className="list-group-item">Real-time booking and inventory</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row gy-4">
          <div className="col-md-4">
            <div className="card section-card p-4">
              <h5>About Blood Donation</h5>
              <p>Blood donations save lives by providing essential support to patients facing surgeries, accidents, and chronic illnesses.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card section-card p-4">
              <h5>Why It Matters</h5>
              <p>One donation can help multiple patients. Every donor is a hero who contributes to a stronger community.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card section-card p-4">
              <h5>How It Works</h5>
              <p>Register, confirm eligibility, choose a nearby hospital and book your appointment in minutes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-light py-5">
        <div className="container">
          <h2 className="mb-4 text-center">Benefits of Blood Donation</h2>
          <div className="row gy-4">
            <div className="col-md-4">
              <div className="card section-card p-4">
                <h6>Improve Health</h6>
                <p>Regular donation helps maintain healthy iron levels and supports circulation.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card section-card p-4">
                <h6>Support Patients</h6>
                <p>Contribute to operations, trauma care and emergency blood reserves.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card section-card p-4">
                <h6>Community Impact</h6>
                <p>Your gift can inspire others and help hospitals meet critical demand.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row gy-4">
          <div className="col-md-6">
            <h3>Contact Us</h3>
            <p>Reach out for support, emergency alerts or to learn more about donation events.</p>
            <p><strong>Email:</strong> support@blooddonate.com</p>
            <p><strong>Phone:</strong> +1 234 567 890</p>
          </div>
          <div className="col-md-6">
            <div className="card section-card p-4 bg-danger text-white">
              <h4>Emergency Request Alerts</h4>
              <p>Get notified about urgent needs by registering as a donor or patient today.</p>
              <Link className="btn btn-light" to="/register">Register to receive alerts</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">&copy; 2026 Blood Donation Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
