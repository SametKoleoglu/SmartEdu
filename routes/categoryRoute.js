const expresss = require("express");
const categoryController = require("../controllers/categoryController");

const router = expresss.Router();

router.route("/").post(categoryController.createCategory);
router.route("/:id").delete(categoryController.deleteCategory);

module.exports = router;
