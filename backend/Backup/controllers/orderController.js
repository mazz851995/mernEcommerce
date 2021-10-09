const Order = require("../models/orderModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");


// Create new iorder
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, shippingPrice, totalPrice, taxPrice } = req.body
    const order = await Order.create({
        shippingInfo, orderItems, paymentInfo, itemsPrice, shippingPrice, taxPrice, totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })
    res.status(201).json({ success: true, order })
})

// Get single order-->Admin
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return next(new ErrorHandler("Order not found with this Id..!", 404))
    res.status(200).json({ success: true, order })
})


// Get logged IN Users order
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const order = await Order.find({ user: req.user._id });
    if (!order) return next(new ErrorHandler("Order not found with this Id..!", 404))
    res.status(200).json({ success: true, order })

})

// Get Allorder
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach(order => totalAmount += order.totalPrice)
    res.status(200).json({ success: true, totalAmount, orders })
})


// Upadte order Status  -> Admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById({ _id: req.params.id });
    if (!order) return next(new ErrorHandler("Order not found with this Id..!", 404))
    if (order.orderStatus === "Delivered")  return next(new ErrorHandler("You have already delivered this orders", 404))        
    
    order.orderItems.forEach( async order => await updateStock(order.product, order.quantity))
    order.orderStatus = req.body.status

    await order.save({validateBeforeSave:false})
    if (req.body.status === "Delivered") order.deliveredAt = Date.now()
    res.status(200).json({ success: true, order })
})

async function updateStock(id, quantity){
    const product = await Product.findById(id);
    product.Stock -= quantity;
    await product.save({validateBeforeSave:false})
}

// Delete Order
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorHandler("Order not found with this Id..!", 404))
    await order.remove();
    res.status(200).json({ success: true })
})