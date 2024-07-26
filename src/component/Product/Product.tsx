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

const Product = ({ name, price, description, onEdit, onDelete, showActions }: ProductProps) => {
  return (
    <Col md={4} className="mb-4">
      <Card>
        <Card.Body>
          <Card.Title className="d-flex justify-content-center" style={{fontSize:"50px", fontWeight: "bold"}}>{name}</Card.Title>
          <Card.Text style={{fontSize:"30px", color:"green"}}>Price: ${price}</Card.Text>
          <Card.Text style={{fontSize:"20px"}}>{description}</Card.Text>
          {showActions && ( // Conditionally render the buttons depending on whether user is logged in
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
