const expresss = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const { body } = require("express-validator");
const User = require("../models/User");

const router = expresss.Router();

router.route("/signup").post(
  [
    body("name").not().isEmpty().withMessage("please enter u name"),
    body("email")
      .isEmail()
      .withMessage("please enter valid email")
      .custom((userEmail) => {
        return User.findOne({ email: userEmail }).then((user) => {
          if (user) {
            return Promise.reject("Email is already exists !!!");
          }
        });
      }),
    body("password").not().isEmpty().withMessage("please enter u password"),
  ],
  authController.createUser
);
router.route("/login").post(authController.loginUser);
router.route("/logout").get(authController.logoutUser);
router.route("/dashboard").get(authMiddleware, authController.getDashboardPage);
router.route("/:id").delete(authController.deleteUser);


module.exports = router;
