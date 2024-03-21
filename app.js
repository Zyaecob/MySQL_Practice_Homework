const mysql = require("mysql2");
const express = require("express");

// "cors" package is used to enable Cross-Origin Resource Sharing (CORS) in a Node.js application
const cors = require("cors");

// Express.js server or application
const app = express();

// Middle ware to extract info from the html
app.use(
  express.urlencoded({
    extended: true,
  })
);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Middle ware to have access to the frontend
app.use(cors());
app.use(express.json());

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  user: "myDBuser",
  password: "myDBpassword",
  database: "myDBuser",
});

// Connect to the DBMySQL
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database");
});

// Route: / => Homepage
app.get("/", (req, res) => {
  res.end("Homepage");
});

// Route: /install => To create tables
app.get("/install", (req, res) => {
  let message = "Tables Created Successfully";
  //**********       Creating Tables     ************ * /

  // Products table
  let Products = `CREATE TABLE  if not exists Products
  (
  product_id int auto_increment,
  product_url varchar(255) not null,
  product_name varchar(255) not null,
  PRIMARY KEY (product_id) )`;

  // ProductDescription table
  let ProductDescription = `CREATE TABLE if not exists ProductDescription (
  description_id int auto_increment,
  product_id int(11) not null,
  product_brief_description TEXT not null,
  product_description TEXT not null,
  product_img varchar(255) not null,
  product_link varchar(255) not null,
  PRIMARY KEY (description_id),
  FOREIGN KEY (product_id) REFERENCES Products (product_id))`;

  // ProductPrice table
  let ProductPrice = `CREATE TABLE if not exists ProductPrice(
    price_id int auto_increment,
    product_id int(11) not null,
    starting_price varchar(255) not null,
    price_range varchar(255) not null,
    PRIMARY KEY (price_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
  )`;

  // users table
  let Users = `CREATE TABLE if not exists Users(
    user_id int auto_increment,
    user_name varchar(255) not null,
    user_email varchar(255) not null,
    user_password varchar(255) not null,
    PRIMARY KEY (user_id))`;

  // orders table
  let Orders = `CREATE TABLE if not exists Orders(
    order_id int auto_increment,
    product_id int(11) not null,
    user_id int(11) not null,
    PRIMARY KEY (order_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id))`;

  //  executing the query's we wrote above

  connection.query(Products, (err, result, fields) => {
    if (err) throw err;
  });
  //
  connection.query(ProductDescription, (err, result, fields) => {
    if (err) throw err;
  });
  //
  connection.query(ProductPrice, (err, result, fields) => {
    if (err) throw err;
  });
  //
  connection.query(Users, (err, result, fields) => {
    if (err) throw err;
  });
  //
  connection.query(Orders, (err, result, fields) => {
    if (err) throw err;
  });
  //
  res.send(message);
});

// Route: /addiphones => To insert data

app.post("/add-products", (req, res) => {
  let message = "Data inserted successfully!";
  console.table(req.body);
  const { name, description, price } = req.body;

  let insertName = `INSERT INTO products (product_name) VALUES (?)`;
  let insertDescription = `INSERT INTO productdescription (product_description) VALUES (?)`;
  let insertPrice = `INSERT INTO productprice (starting_price) VALUES (?)`;

  // Query execution
  connection.query(insertName, [name], (err, results, fields) => {
    if (err) throw err;
    console.table(results);
    const id = results.insertId;
    connection.query(
      insertDescription,
      [id, description],
      (err, results, fields) => {
        if (err) throw err;
      }
    );

    connection.query(insertPrice, [id, proce], (err, results, fields) => {
      if (err) throw err;
    });
  });
  console.log("Data inserted successfully!");
  res.send(message);
});

app.listen(3000, (err) => {
  console.log("Server listening to port 3000");
});
