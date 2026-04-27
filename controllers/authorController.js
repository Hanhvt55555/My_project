const {Author,Book} = require('../model/model');

const authorController = {
    //ADD AUTHOR
    addAuthor: async(req,res) => {
        try{
            const newAuthor = new Author(req.body);
            const saveAuthor = await newAuthor.save();
            res.status(200).json(saveAuthor);
        }catch(err) {
            res.status(500).json(err);
        }
    },

    //GET ALL AUTHORS
    getAllAuthors: async(req,res) => {
        try {
            const authors = await Author.find();
            const books = await Book.find({ author: { $in: authors.map(a => a._id) } });
            const result = authors.map(a => ({
                ...a.toObject(),
                books: books.filter(b => b.author?.toString() === a._id.toString())
            }));
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json(err)
        }
    },

    //GET AN AUTHOR
    getAnAuthor: async(req,res) => {
        try {
            const author = await Author.findById(req.params.id);
            const books = await Book.find({author: req.params.id}).populate('author');
            res.status(200).json({...author.toObject(), books});
        } catch (err) {
            res.status(500).json(err)
        }
    },

    //UPDATE AUTHOR
    updateAuthor: async (req,res) => {
        try {
            const author = await Author.findById(req.params.id);
            await author.updateOne({$set: req.body});
            res.status(200).json('Updated successfully!!!');
        } catch (err) {
            res.status(500).json(err)
        }
    },

    //DELETE AUTHOR
        deleteAuthor: async (req,res) => {
            try {
                await Book.updateMany(
                    {author: req.params.id},
                    {$set: {author: null}}
                );
                await Author.findByIdAndDelete(req.params.id);
                res.status(200).json("Deleted successfully");
            } catch (err) {
                res.status(500).json(err)
            }
        }
};

module.exports = authorController;