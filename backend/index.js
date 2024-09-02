const port=4000;

const express=require("express");
const app=express();

const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const multer=require("multer"); //store imgs
const path=require("path"); //we can get access to backend dir in our express app
const cors=require("cors");

app.use(express.json());
app.use(cors());

     
 mongoose.connect("mongodb://prabhaspv23:hE9csJ8q9laOzuy6@cluster0-shard-00-00.5hvyc.mongodb.net:27017,cluster0-shard-00-01.5hvyc.mongodb.net:27017,cluster0-shard-00-02.5hvyc.mongodb.net:27017/?ssl=true&replicaSet=atlas-12sgth-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log("Error connecting to MongoDB: " + error));


//Api creation
app.get("/",(req,res)=>{
    res.send("express app is running")
})



// image storage engine
const storage=multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload=multer({storage:storage})

//creating upload endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`/images/${req.file.filename}`
    })

})

// MiddleWare to fetch user from token
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};



//schema for creating produxts
const Product=mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    }
})

app.post('/addproduct',async(req,res)=>{
    let products=await Product.find({});
    let id;
    if(products.length>0){
        let last_product_array=products.slice(-1);
        let last_product=last_product_array[0];
        id=last_product.id+1;
    }else{
        id=1;
    }
    const product=new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,

    });

    
    await product.save();
    console.log("saved");
    res.json({
        sucess:true,
        name:req.body.name,
    })
})

//CREATING API FOR DELETING PRODUCTS

app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("removed");
    res.json({
        success:true,
        name:req.body.name,
    })

})

// CREATING API FOR GETTIN ALL PRODUCTS
app.get('/allproducts', async(req,res)=>{
    let products= await Product.find({});
    console.log("all products fetched");
    res.send(products);
})


// Schema for creating user model
const Users = mongoose.model("Users", {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    cartData: { type: Object },
    date: { type: Date, default: Date.now() },
  });

//Create an endpoint at ip/auth for registering the user & sending auth-token
  app.post('/signup', async (req, res) => {
    console.log("Sign Up");
    
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: false, errors: "existing user found with this email" });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }
    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cartData: cart,
    })
    await user.save();
    const data = {
      user: {
        id: user.id
      }
    }
    const token = jwt.sign(data, 'secret_ecom');
    
    res.json({ success:true, token })
  })

  //creating endpoint for user login
  app.post('/login', async (req, res) => {
    console.log("Login");
    
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
      const passCompare = req.body.password === user.password;
      if (passCompare) {
        const data = {
          user: {
            id: user.id
          }
        }
        
        console.log(user.id);
        const token = jwt.sign(data, 'secret_ecom');
        res.json({ success:true, token });
      }
      else {
        return res.status(400).json({ success: false, errors: "wrong password" })
      }
    }
    else {
      return res.status(400).json({ success: false, errors: "wrong email id" })
    }
  })

// endpoint for getting womens products data
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let arr = products.splice(0, 4);
  console.log("Popular In Women fetched");
  res.send(arr);
});


// endpoint for getting latest products data
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let arr = products.slice(0).slice(-8);
  console.log("New Collections");
  res.send(arr);
});

// Create an endpoint for saving the product in cart
app.post('/addtocart', fetchuser, async (req, res) => {
  console.log("Add Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Added")
})


// Create an endpoint for removing the product in cart
app.post('/removefromcart', fetchuser, async (req, res) => {
  console.log("Remove Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] != 0) {
    userData.cartData[req.body.itemId] -= 1;
  }
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Removed");
})

// Create an endpoint for getting cartdata of user
app.post('/getcart', fetchuser, async (req, res) => {
  console.log("Get Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);

})

// endpoint for getting related products data
app.post("/relatedproducts", async (req, res) => {
  console.log("Related Products endpoint hit");
  const { category } = req.body;
  try {
    const products = await Product.find({ category });
    console.log("Products found:", products); // Log the products found
    const arr = products.slice(0, 4); // Limiting to 4 related products
    res.send(arr);
    
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(port,(error)=>{
    if(!error){
        console.log("server running on port "+port)
    }
    else{
        console.log("error :"+error)
    }
})