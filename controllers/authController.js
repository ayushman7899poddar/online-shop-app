const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel"); 
const orderModel = require("../models/orderModel");
const jwt = require("jsonwebtoken");


const registerController = async (req, res) => {
    try {
      const { name, email, password, phone, address, answer} = req.body;

      //validations
      if (!name) {
        return res.send({ message: "Name is Required" });
      }
      if (!email) {
        return res.send({ message: "Email is Required" });
      }
      if (!password) {
        return res.send({ message: "Password is Required" });
      }
      if (!phone) {
        return res.send({ message: "Phone no is Required" });
      }
      if (!address) {
        return res.send({ message: "Address is Required" });
      }

      if (!answer) {
        return res.send({ message: "Answer is Required" });
      }

      //check user
      const exisitingUser = await userModel.findOne({ email });

      //exisiting user:
      if (exisitingUser) {
        return res.status(200).send({
          success: false,
          message: "Already Register please login",
        });
      }
      //register user:
      const hashedPassword = await hashPassword(password);
      //save
      const user = await new userModel({
        name,
        email,
        phone,
        address,
        password: hashedPassword,
        answer,
      }).save();

      // console.log(user);
  
      res.status(201).send({
        success: true,
        message: "User Register Successfully",
        user,
      });

    } catch (error) {
      // console.log(error);
      res.status(500).send({
        success: false,
        message: "Errro in Registeration",
        error,
      });
    }
};


const loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
      //validation
      if (!email || !password) {
        return res.status(404).send({
          success: false,
          message: "Invalid email or password",
        });
      }
      //check user
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Email is not registerd",
        });
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(200).send({
          success: false,
          message: "Invalid Password",
        });
      }

      // console.log(user);
      
      //token
      const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });
      
      // console.log("token is" ,token);

      res.status(200).send({
        success: true,
        message: "login successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in login",
        error,
      });
    }
};


const forgotPasswordController = async(req,res) => {
   try {
      const {email, answer, newPassword} = req.body;

      if(!email){
        res.status(400).send({
          message:"Email is required"
        })
      }
      if(!answer){
        res.status(400).send({
          message:"answer is required"
        })
      }
      if(!newPassword){
        res.status(400).send({
          message:"New Password is required"
        })
      }

      //check user:
      const user = await userModel.findOne({email, answer});
      //validation:
      if(!user){
        return res.status(404).send({
          success:false,
          message:"Wrong Email or Answer",
        });
      }

      //hashing password:
      const hashed = await hashPassword(newPassword);
      await userModel.findByIdAndUpdate(user._id, {password : hashed});

      res.status(200).send({
        success:true,
        message: "Password Reset Successfully",
      });

      // console.log(user);

   } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        message:"Something went wrong",
        error,
      });
   }
};

//update profile:
const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders:
const getOrdersController = async(req,res) => {
    try {
      const orders = await orderModel
      .find({buyer: req.user._id})
      .populate("products", "-photo")
      .populate("buyer", "name");

      res.json(orders);
    } catch (error) {
      // console.log(error);
      res.status(500).send({
        success:false,
        message:"Error while Getting Orders",
        error,
      });
    }
};

// all orders:
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Geting Orders",
      error,
    });
  }
};


const orderStatusController = async(req,res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        const orders = await orderModel.findByIdAndUpdate(orderId, {status}, {new:true});

        res.json(orders);

    } catch (error) {
      // console.log(error);
      res.status(500).send({
        success:false,
        message:"Error while updating order status",
        error,
      });
    }
}


module.exports = {registerController,loginController, forgotPasswordController, updateProfileController,getOrdersController,getAllOrdersController,orderStatusController};