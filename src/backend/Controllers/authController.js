const bcrypt = require("bcryptjs");
const User = require("../../Models/Users");
const createError = require("../../Utils/AppErrors");
const jwt = require("jsonwebtoken");

// Sign Up User
exports.SignUp = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password, name } = req.body;

    // check whether the user is already present or not
    const user = await User.findOne({ email });

    if (user) {
      return next(new createError("User Already Existing"));
    }
    // If not then encrypt the passwords using bcrypt
    const hashPassword = await bcrypt.hash(password, 10);

    // Create the newUser
    const newUser = await User.create({ email, password: hashPassword, name });

    // Assigning the JSON Web Token to the User for the authentication
    const token = jwt.sign({ _id: newUser._id }, "seckretKey213", {
      expiresIn: "100d",
    });

    // Set the status of the result
    res.status(201).json({
      success: true,
      token,
      message: "Signed Up Successfully",
      user: newUser,
      // Then send the data to the database
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Login User
exports.Login = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new createError("User not Found", 404));
    }
    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return next(new createError("Invalid UserName or Password", 401));
    }
    const token = jwt.sign({ _id: user._id }, "seckretKey213", {
      expiresIn: "100d",
    });

    res.status(200).json({
      status: "success",
      token,
      message: "Logged in Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
