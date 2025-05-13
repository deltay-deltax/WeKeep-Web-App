const bcrypt = require("bcryptjs");
const User = require("../../Models/Users");
const createError = require("../../Utils/AppErrors");
const jwt = require("jsonwebtoken");

// Sign Up User
// SignUp function update
exports.SignUp = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password, name, role, shopName, address, gstNo } = req.body;

    // check whether the user is already present or not
    const user = await User.findOne({ email });

    if (user) {
      return next(new createError("User Already Existing"));
    }

    // If not then encrypt the passwords using bcrypt
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user object based on role
    const userData = {
      email,
      password: hashPassword,
      name,
      role: role || "user", // Default to user if not specified
    };

    // Add service person fields if role is service
    if (role === "service") {
      userData.shopName = shopName;
      userData.address = address;
      userData.gstNo = gstNo;
    }

    // Create the newUser
    const newUser = await User.create(userData);

    // Assigning the JSON Web Token to the User for the authentication
    const token = jwt.sign({ _id: newUser._id }, "seckretKey213", {
      expiresIn: "100d",
    });

    // Set the status of the result
    res.status(201).json({
      success: true,
      token,
      message: "Signed Up Successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        ...(newUser.role === "service" && {
          shopName: newUser.shopName,
          address: newUser.address,
          gstNo: newUser.gstNo,
        }),
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
