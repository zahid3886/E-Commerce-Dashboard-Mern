const express = require("express");
const PORT = 5000;
require("./db/dbConnection");
const User = require("./db/user");
const Product = require("./db/product");
const cors = require("cors");
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-com'

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

//middleware
app.use(express.json());
app.use(cors());

// ==========make register api
app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  Jwt.sign({result}, jwtKey, {expiresIn: "2h"}, (err, token) => {
    if(err){
      res.send({ result: "something went wrong please try after some time" });
    }
    res.send({result, auth: token});
  })
});

// ===========make LOGIN api
app.post("/login", async (req, res) => {
  console.log(req.body);
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
      if(user){
        Jwt.sign({user}, jwtKey, {expiresIn: "2h"}, (err, token) => {
          if(err){
            res.send({ result: "something went wrong please try after some time" });
          }
          res.send({user, auth: token});
        })
      }
    } else {
    res.send({ result: "No User Found" });
  }
});

//make add product api
app.post("/add-product", verifyToken, async (req, res) => {
  let getProduct = new Product(req.body);
  let result = await getProduct.save();
  res.send(result);
});

//make product list api
app.get("/products", verifyToken, async (req, res) => {
  let products = await Product.find();
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "no products found" });
  }
});

//make delete product api
app.delete("/product/:id", async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

//MAKE API FOR GET SINGLE PRODUCT
app.get("/product/:id",  verifyToken, async (req, res) => {
  const result = await Product.findOne({ _id: req.params.id });
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "no result found" });
  }
});

//MAKE API FOR UPDATE PRODUCT
app.put("/product/:id", verifyToken, async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  res.send(result)
});

//MAKE API FOR SEARCH
app.get("/search/:key", verifyToken, async(req, res)=>{
let result = await Product.find({
  "$or": [
    {name: {$regex: req.params.key}},
    {company: {$regex: req.params.key}},
    {category: {$regex: req.params.key}},
  ]
})
res.send(result)
}) 

//Make Middleware Fuunction 
function verifyToken(req, res, next){
  let token = req.headers['authorization']
  if(token){
    token = token.split(" ")[1];
  Jwt.verify(token, jwtKey, (err, valid)=>{
    if(err){
      res.status(401).send({result: "please add valid token"})
    }else{
      next();
    }
      })
  }else{
    res.status(403).send({result: "please add token with headers"})
  }
}
app.listen(PORT);
