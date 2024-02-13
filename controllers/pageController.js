const nodemailer = require("nodemailer");
const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");

exports.getIndexPage = async (req, res) => {
  const courses = await Course.find().sort("-createdDate").limit(2);
  const totalCourses = await Course.find().countDocuments();
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalTeachers = await User.countDocuments({ role: "teacher" });

  res.status(200).render("index", {
    page_name: "index",
    courses,
    totalCourses,
    totalStudents,
    totalTeachers,
  });
};

exports.getAboutPage = async (req, res) => {
  const categories = await Category.find();
  const totalcategories = await Category.find().countDocuments();

  res.status(200).render("about", {
    page_name: "about",
    categories,
    totalcategories,
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render("register", {
    page_name: "register",
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render("login", {
    page_name: "login",
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render("contact", {
    page_name: "contact",
  });
};

exports.sendEmail = async (req, res) => {
  try {
    const outputMessage = `
  <h1>Mail Details</h1>
  <ul>
    <li>Name : ${req.body.name}</li>
    <li>Email : ${req.body.email}</li>
  </ul>
  <h1>Message</h1>
  <p>${req.body.message}</p>
  `;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: "Gmail Account",
        pass: "Gmail Password",
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Smart Edu Contact Form 👻" <Gmail Account>', // sender address
      to: req.body.email, // list of receivers
      subject: "Smart Edu Contact Form New Message ✔", // Subject line
      html: outputMessage, // html body
    });

    req.flash("success", "We received your message succesfully");

    res.status(200).redirect("contact");
  } catch (error) {
    req.flash("error", ` ${error}`);
    res.status(200).redirect("contact");
  }
};
