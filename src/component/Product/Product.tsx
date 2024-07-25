import { Card, Col, Button } from 'react-bootstrap';

interface ProductProps {
  id: string;
  name: string;
  price: number;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
  showActions: boolean; // Add showActions prop
}

const Product = ({ id, name, price, description, onEdit, onDelete, showActions }: ProductProps) => {
  return (
    <Col md={4} className="mb-4">
      <Card>
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>Price: ${price}</Card.Text>
          <Card.Text>{description}</Card.Text>
          {showActions && ( // Conditionally render the buttons
            <div className="d-flex justify-content-between">
              <Button variant="primary" onClick={onEdit}>
                Edit
              </Button>
              <Button variant="danger" onClick={onDelete}>
                Delete
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Product;
