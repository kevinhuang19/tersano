import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Card } from 'react-bootstrap';
import { loginUser } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login = ({ onLogin } : LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    try {
      //check if login is successfully before setting name and redirect
      const result = await loginUser(username, password);
      if(result){
        setSuccess('Login successful!');
        onLogin(username);
        navigate('/products'); // Redirect to /product page
      }
    } catch (error) {
      if (error instanceof Error) {
        setError('Login failed: ' + error.message);
      } else {
        setError('Login failed: An unknown error occurred');
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: '20rem' }}>
        <Card.Body>
          <Card.Title className="text-center">Login</Card.Title>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div style={{ minHeight: '1.5rem' }}>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
            </div>
            {success && (
              <div className="alert alert-success mb-3" role="alert">
                {success}
              </div>
            )}
            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit">
                Login
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
