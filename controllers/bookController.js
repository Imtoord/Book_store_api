const { cloudinary } = require("../middlewares/uploadImageMiddleware");

const { uploadBook } = require("../middlewares/uploadImageMiddleware");
const { Book } = require("../models/Book");
const {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getAll,
  search,
} = require("./factory");


/**
 * @description get all Books
 * @route api/Books || api/:categoryId/Books
 * @method get
 * @access public
 */
exports.getBooks = getAll(Book);

/**
 * @description create new Books
 * @param {name} req
 * @method post
 * @route api/Books
 * @access private
 */

exports.createBook = async (req, res, next) => {
  const { title, author, description, price } = req.body;
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Image file is required",
    });
  }

  // Upload image file to Cloudinary
  cloudinary.uploader.upload(req.file.path, async function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error uploading image file",
      });
    }

    // res.status(200).json({
    //   success: true,
    //   message: "Image uploaded successfully",
    //   data: result,
    // });

    const book = await Book.create({
      title,
      author,
      description,
      price,
      cover: result.url,
    });

    await book.save();
    res.status(200).json({
      success: true,
      message: "book uploaded successfully",
      data: book,
    });
  });
};

/**
 * @description get Book
 * @param {id} req
 * @method get
 * @route api/Books/:id
 * @access public
 */
exports.getBook = getOne(Book, "reviews");

/**
 * @description update Book
 * @param {id} req
 * @method put
 * @route api/Books/:id
 * @access public
 */
exports.updateBook = updateOne(Book);

/**
 * @description delete Book
 * @param {id} req
 * @method delete
 * @route api/Books/:id
 * @access public
 */
exports.deleteBook = deleteOne(Book);

/**
 * @description search Book
 * @param {keyword} req
 * @method get
 *@route api/Books/search
 * @access public
 */

exports.searchBook = search(Book);
