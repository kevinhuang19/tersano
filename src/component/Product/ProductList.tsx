import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { fetchProducts, deleteProduct } from "../../api/auth";
import Product from "./Product";
import ProductModal from "./ProductAdd";
import ProductEdit from "./ProductEdit";

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [editModalShow, setEditModalShow] = useState<boolean>(false);
  const [currentProductId, setCurrentProductId] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        //checking for products in database, else produce error message
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        if (error instanceof Error) {
          setError("Error fetching products: " + error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleProductAdded = () => {
    const loadProducts = async () => {
      try {
        //when new products are added refresh the list
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        if (error instanceof Error) {
          setError("Error fetching products: " + error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };
    loadProducts();
  };

  const handleProductDeleted = async (id: string) => {
    try {
      //deletes product selected as well as update list
      await deleteProduct(id);
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      setError("Error deleting product: " + (error as Error).message);
    }
  };

  return (
    <Container className="mt-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {isLoggedIn && (
        <div style={{ marginBottom: "16px" }}>
          <Button onClick={() => setModalShow(true)}>Add Product</Button>
        </div>
      )}
      <Row>
        {products.length > 0 ? (
          products.map((product) => (
            <Product
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              description={product.description}
              onEdit={() => {
                setCurrentProductId(product._id);
                setEditModalShow(true);
              }}
              onDelete={() => handleProductDeleted(product._id)}
              showActions={isLoggedIn} // if the user is logged in, the add product, edit and delete button will show
            />
          ))
        ) : (
          <Col>
            <p>No products available.</p>
          </Col>
        )}
      </Row>
        {/* modal will popup when pressed*/}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onProductAdded={handleProductAdded}
      />

      <ProductEdit
        show={editModalShow}
        onHide={() => setEditModalShow(false)}
        onProductUpdated={handleProductAdded}
        productId={currentProductId}
      />
    </Container>
  );
};

export default ProductList;
