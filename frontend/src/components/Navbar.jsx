import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, darkMode, setDarkMode } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          BloodDonate
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={user.type === 'donor' ? '/donor' : '/acceptor'}>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm ms-2" onClick={() => { logout(); navigate('/'); }}>
                    Logout
                  </button>
                </li>
              </>
            )}
            <li className="nav-item ms-3">
              <button className="btn btn-sm btn-light" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? 'Light' : 'Dark'} Mode
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
