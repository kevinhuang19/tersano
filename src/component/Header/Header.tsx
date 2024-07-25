import { Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  user: string | null;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <Nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Nav.Item className="navbar-brand">
          <span className="store-name">Your Store</span>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/products">Products</Nav.Link>
        </Nav.Item>
        <Nav className="">
          {user ? (
            <div className="d-flex align-items-center">
              <span className="me-3">Welcome, {user}</span>
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="d-flex">
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </div>
          )}
        </Nav>
      </div>
    </Nav>
  );
};

export default Header;
