// const mongoose = require("mongoose");
const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary")

//  Create Product -- Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
    let images = []
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    } else {
        images = req.body.images
    }

    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
        });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    req.body.user = req.user.id

    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product })
})

// Get All products or FILTER
exports.getAllProducts = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 8;
    const productCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter()
    let resp = await apiFeatures.query;
    let filteredProductsCount = resp.length;

    const filteredProductsFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    let products = await filteredProductsFeatures.query;


    res.status(201).json({ success: true, productCount, products, resultPerPage, filteredProductsCount })
})

// Get All products --> ADMIN
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(201).json({ success: true, products })
})

// Update Product -- Admin
exports.updateProducts = catchAsyncError(async (req, res, next) => {
    const { id: _id } = req.params;


    // if(!mongoose.isValidObjectId(_id)) return res.status(404).json({success:false, message:"Invalid product ID"});
    let product = await Product.findById(_id);
    if (!product) return res.status(500).json({ success: false, message: "Product not found" })

    product = await Product.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true, useFindAndModify: false })
    res.status(200).json({ success: true, product })
})

// Product Delete -- Admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const { id: _id } = req.params;
    // if(!mongoose.isValidObjectId(_id)) return res.status(404).json({success:false, message:"Invalid product ID"});
    let product = await Product.findById(_id);
    if (!product) return next(new ErrorHandler("Product not found!", 500))
    await product.remove();
    return next(new ErrorHandler("Product delete successfully..!", 200))
})

// get single product details
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const { id: _id } = req.params;

    // Already handled ID not found
    // if(!mongoose.isValidObjectId(_id)) return next(new ErrorHandler("Invalid product ID", 404))     

    let product = await Product.findById(_id);
    // if(!product) return res.status(500).json({success:false, message:"Product not found"})    
    if (!product) return next(new ErrorHandler("Product not found", 404))
    res.status(200).json({ success: true, product });
})


// Create a new review or update the review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating), comment, productId
    }
    const product = await Product.findById(productId);
    if (!product) return next(new ErrorHandler("Product not found!", 500))

    const isReviewd = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());
    if (isReviewd) {
        product.reviews.forEach((rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                (rev.rating = rating),
                    (rev.comment = comment);
            }
        }))
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating
    });

    product.ratings = avg / product.reviews.length;


    await product.save({ validateBeforeSave: false })
    res.status(200).json({ success: true, product })
})

// Get all reviews

exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) return next(new ErrorHandler("Product not found", 404))
    res.status(200).json({ success: true, reviews: product.reviews });
})


// Delete Reviews
exports.deleteReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) return next(new ErrorHandler("Product not found", 404))

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

    let avg = 0;
    reviews.forEach(rev => {
        avg += rev.rating
    });

    const ratings = avg / reviews.length;
    const numOfReviews = reviews.length

    const response = await Product.findByIdAndUpdate(req.query.productId, {
        reviews, numOfReviews, ratings
    }, {
        new: true, runValidators: true, useFindAndModify: false
    })

    res.status(200).json({ success: true, response });
})