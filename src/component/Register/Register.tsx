import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Card } from 'react-bootstrap';
import { registerUser } from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setSuccess('');

    try {
      //call function to determine if user is valid
      await registerUser(username, password);
      setSuccess('Registration successful!');
      setTimeout(() => {
        navigate('/login');
      }, 1000); // Delay for success message display
    } catch (error) {
      if (error instanceof Error) {
        setError('Registration failed: ' + error.message);
      } else {
        setError('Registration failed: An unknown error occurred');
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center mt-5">
      <Card style={{ width: '20rem' }}>
        <Card.Body>
          <Card.Title className="text-center">Register</Card.Title>
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
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                Register
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
