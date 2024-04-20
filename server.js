const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const dotenv =require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const path  = require("path");
const fileURLToPath = require("url");

const connectDB = require("./config/db");

// config dotenv:
dotenv.config();

//databse config:
connectDB();

//esmodule fix:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

    //Middlewares:
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './client/build')))

// routes:
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/category",require("./routes/categoryRoutes"));
app.use("/api/v1/product",require("./routes/productRoutes"));

app.use('*', function(req,res){
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
})

// app.get("/", (req,res) =>{
//     res.status(200).send({
//         message:"welcome to ecommerce app"
//     })
    
// }); 

app.listen(PORT, () =>{
    console.log(`server is running at port no : ${PORT}`);
});
