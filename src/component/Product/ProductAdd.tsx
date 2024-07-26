import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { addProduct } from "../../api/auth";

interface ProductModalProps {
  show: boolean;
  onHide: () => void;
  onProductAdded: () => void;
}

const ProductAdd = ({ show, onHide, onProductAdded }: ProductModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct({ name, price: parseFloat(price), description });
      // Clear form fields
      setName("");
      setPrice("");
      setDescription("");
      onProductAdded();
      onHide(); // Hide modal
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    //displaying modal depending on the prop given from ProductList
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Product</Modal.Title>
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
              Add Product
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductAdd;
