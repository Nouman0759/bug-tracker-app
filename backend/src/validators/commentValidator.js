const { body } = require("express-validator");

const createCommentValidator = [
  body("text").trim().notEmpty().withMessage("Comment text is required"),
];

module.exports = { createCommentValidator };
