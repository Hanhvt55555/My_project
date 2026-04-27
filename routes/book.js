const bookController = require('../controllers/bookController');

const router = require('express').Router();

//ADD BOOKS
router.post("/", bookController.addABook);

//GET ALL BOOKS
router.get("/", bookController.getAllBooks);

//GET A BOOK
router.get("/:id", bookController.getABook)

//UPDATE A BOOK
router.put("/:id", bookController.updateBook)

//DELETE BOOK
router.delete("/:id", bookController.deleteBook)

module.exports = router;