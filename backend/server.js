const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const URI = process.env.DB_URI;
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;

const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const DATABASENAME = "tersano_db";
var database = client.db(DATABASENAME);

// Middleware to check if the user is authenticated
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  //checks if token matches so it can proceed
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

//connecting to database and checking if connected properly
app.listen(PORT, () => {
  try {
    client.connect();
    database = client.db(DATABASENAME);
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
  }
});

// Endpoint to register a new user
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Username and password are required.");
    }
    //adds to the database, as well as check if already exists
    const usersCollection = database.collection("users");
    const user = await usersCollection.findOne({ username });

    if (user) {
      return res.status(400).send("User already exists.");
    }
    //additionaly security by hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);
    await usersCollection.insertOne({ username, password: hashedPassword });
    res.status(201).send("User registered successfully.");
  } catch (error) {
    res.status(500).send("Error registering user: " + error.message);
  }
});

// Endpoint to login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Username and password are required.");
    }
    //looks through the database if the username exists, validates
    const usersCollection = database.collection("users");
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(400).send("Invalid credentials.");
    }
    //compares hashed password with submitted password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials.");
    }
    //create temp token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).send({ token, username });
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
});

// Endpoint to list products
app.get("/products", async (req, res) => {
  try {
    //checks for products and appends to an array
    const productsCollection = database.collection("products");
    const products = await productsCollection.find().toArray();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send("Error fetching products: " + error.message);
  }
});

// Endpoint to add a product
app.post("/products", authenticateToken, async (req, res) => {
  try {
    //validation for creating product
    const { name, price, description } = req.body;
    if (!name || !price || !description) {
      return res.status(400).json({ message: "All fields are required." });
    }
    //successfully creates product
    const productsCollection = database.collection("products");
    await productsCollection.insertOne({ name, price, description });
    res.status(201).json({ message: "Product added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error adding product: " + error.message });
  }
});

// Endpoint to modify a product
app.put("/products/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    if (!name || !price || !description) {
      return res.status(400).send("All fields are required.");
    }
    //checks for product through database by objectId
    const productId = new ObjectId(id);
    const productsCollection = database.collection("products");
    const result = await productsCollection.updateOne(
      { _id: productId },
      { $set: { name, price, description } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send("Product not found.");
    }

    res.status(200).send("Product updated successfully.");
  } catch (error) {
    res.status(500).send("Error updating product: " + error.message);
  }
});

// Endpoint to fetch a product by ID
app.get("/products/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid product ID format.");
    }
    //checks for product by objectId
    const productId = new ObjectId(id);
    const productsCollection = database.collection("products");
    const product = await productsCollection.findOne({ _id: productId });

    if (!product) {
      return res.status(404).send("Product not found.");
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).send("Error fetching product: " + error.message);
  }
});

// Endpoint to delete a product (only for authenticated users)
app.delete("/products/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid product ID format.");
    }
    //checks for product by id to delete
    const productId = new ObjectId(id);
    const productsCollection = database.collection("products");
    const result = await productsCollection.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      return res.status(404).send("Product not found.");
    }

    res.status(200).send("Product deleted successfully.");
  } catch (error) {
    res.status(500).send("Error deleting product: " + error.message);
  }
});
