const API_URL = "http://localhost:4000";

// Function to get the stored token
const getToken = () => localStorage.getItem('token');

// Register user function
export const registerUser = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.text();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      throw error;
    } else {
      console.error("Unknown error occurred");
      throw new Error("An unknown error occurred");
    }
  }
};

// Login user function
export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();
    // Save the token to localStorage, so we can use them again later
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      throw error;
    } else {
      console.error("Unknown error occurred");
      throw new Error("An unknown error occurred");
    }
  }
};

// Fetch products function with authentication
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error fetching products: " + error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

// Add product function with authentication
export const addProduct = async (product: {name: string; price: number; description: string}) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        //we have to use token to check if user is logged in to allow modification
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add product. Response: ${errorText}`);
    }
    
    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch (e) {
      return responseText;
    }
  } catch (error) {
    throw new Error("Error adding product: " + (error instanceof Error ? error.message : error));
  }
};

// Update product function with authentication
export const updateProduct = async (id: string, product: {name: string; price: number; description: string;}) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        //we have to use token to check if user is logged in to allow modification
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return await response.text();
  } catch (error) {
    throw new Error('Error updating product: ' + (error instanceof Error ? error.message : error));
  }
};

// Fetch product by ID function with authentication
export const fetchProductById = async (id: string) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: {
        //we have to use token to check if user is logged in to allow modification
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    return await response.json();
  } catch (error) {
    throw new Error('Error fetching product: ' + (error instanceof Error ? error.message : error));
  }
};

// Delete product function with authentication
export const deleteProduct = async (id: string) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        //we have to use token to check if user is logged in to allow modification
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  } catch (error) {
    throw new Error('Error deleting product: ' + (error instanceof Error ? error.message : error));
  }
};
