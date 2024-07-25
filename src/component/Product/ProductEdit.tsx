import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { fetchProductById, updateProduct } from "../../api/auth"; // Import the update function

interface ProductEditProps {
  show: boolean;
  onHide: () => void;
  onProductUpdated: () => void;
  productId: string;
}

const ProductEdit = ({ show, onHide, onProductUpdated, productId }: ProductEditProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await fetchProductById(productId);
        setName(product.name);
        setPrice(product.price.toString());
        setDescription(product.description);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId && show) {
      fetchProduct();
    }
  }, [productId, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProduct(productId, { name, price: parseFloat(price), description });
      onProductUpdated(); // Notify parent component
      onHide(); // Hide modal
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPrice" className="mb-3">
            <Form.Control
              type="number"
              placeholder="Enter product price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDescription" className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "16px" }}
          >
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductEdit;
