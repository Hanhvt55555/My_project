const {Book, Author} = require("../model/model");

const bookController = {
    //ADD A BOOK
    addABook: async(req,res) => {
        try {
            const body = { ...req.body };
            if (!body.author) delete body.author;
            const newBook = new Book(body);
            const saveBook = await newBook.save();
            if (body.author) {
                const author = await Author.findById(body.author);
                if (author) await author.updateOne({$push: {books: saveBook._id}});
            }
            res.status(200).json(saveBook);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //GET ALL BOOKS
    getAllBooks: async(req,res) => {
        try {
            const allBooks = await Book.find().populate('author');
            res.status(200).json(allBooks);
        } catch (err) {
            res.status(500).json(err)
        }
    },

    //GET A BOOK
    getABook: async(req,res) => {
        try {
            const book = await Book.findById(req.params.id).populate('author');
            res.status(200).json(book);
        } catch (err) {
            res.status(500).json(err)
        }
    },

    //UPDATE BOOK
    updateBook: async (req,res) => {
        try {
            const book = await Book.findById(req.params.id);
            const oldAuthorId = book.author?.toString();
            const newAuthorId = req.body.author?.toString();

            await book.updateOne({$set: req.body});

            if (oldAuthorId !== newAuthorId) {
                if (oldAuthorId) {
                    await Author.updateOne({_id: oldAuthorId}, {$pull: {books: book._id}});
                }
                if (newAuthorId) {
                    await Author.updateOne({_id: newAuthorId}, {$push: {books: book._id}});
                }
            }

            res.status(200).json('Updated successfully!!!');
        } catch (err) {
            res.status(500).json(err)
        }
    },

    //DELETE A BOOK
    deleteBook: async (req,res) => {
        try {
            await Author.updateMany(
                {books: req.params.id}, 
                {$pull: {books: req.params.id}}
            );
            await Book.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted successfully");
        } catch (err) {
            res.status(500).json(err)
        }
    }
};

module.exports = bookController;