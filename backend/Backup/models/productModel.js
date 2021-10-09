const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "PLease enter product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "PLease enter product description"],
    },
    price: {
        type: Number,
        required: [true, "Please enter product price"],
        maxlength: [8, "Price cannot exceed 8 char"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: true,
    },
    Stock: {
        type: Number,
        required: true,
        maxLength: [4, "Stock caanot excedd 4 char"],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        name: { type: String, required: true},
        rating: { type: String, required: true },
        comment: { type: String, required: true },
        user: { type: mongoose.Schema.ObjectId,ref: "User",required: true}
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})


module.exports = mongoose.model("Product", productSchema);