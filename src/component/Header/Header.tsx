import { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  user: string | null;
  onLogout: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const [username, setUsername] = useState<string | null>(user || null);
  const navigate = useNavigate();

  useEffect(() => {
    //checks for local variables so if user refreshs information stays
    if (!user) {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername);
      }
    } else {
      setUsername(user);
    }
  }, [user]);

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
    navigate('/login');
  };

  return (
    <Nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Nav.Item className="navbar-brand">
          <Nav.Link as={Link} to="/products"><span style={{color: 'black'}}>Tersano Store</span></Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/products">Products</Nav.Link>
        </Nav.Item>
        <Nav className="">
          {username ? (
            <div className="d-flex align-items-center">
              <span className="me-3">Welcome, {username}</span>
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
