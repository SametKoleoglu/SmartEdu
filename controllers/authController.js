const User = require("../models/User");
const Category = require("../models/Category");

const bcrypt = require("bcrypt");
const Course = require("../models/Course");
const { validationResult } = require("express-validator");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect("/login");
  } catch (error) {
    const errors = validationResult(req);
    console.log(errors);
    console.log(errors.array()[0].msg);

    for (let i = 0; i < errors.array().length; i++) {
      req.flash("error", `${errors.array()[i].msg} !!!`);
    }

    res.status(400).redirect("/register");
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const same = await bcrypt.compare(password, user.password);
      if (same) {
        req.session.userId = user._id;
        res.status(200).redirect("/users/dashboard");
      } else {
        req.flash("error", `U password is not correct !!!`);
        res.status(400).redirect("/login");
      }
    } else {
      req.flash("error", `User not found !!!`);
      res.status(400).redirect("/login");
    }
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userId }).populate(
    "courses"
  );
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userId }).sort("-createdDate");
  const users = await User.find();
  res.status(200).render("dashboard", {
    page_name: "dashboard",
    user,
    categories,
    courses,
    users,
  });
};


exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Course.deleteMany({user:req.params.id})

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "failed",
      error,
    });
  }
};

