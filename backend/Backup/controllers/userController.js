const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary")

// registyer User
exports.registeruser = catchAsyncError(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale"
    });
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })
    sendToken(user, 201, res)
});


// Login User

exports.loginUser = catchAsyncError(
    async (req, res, next) => {
        const { email, password } = req.body;

        // check if user and password is available
        if (!email || !password) return next(new ErrorHandler("Please nenter email and password", 400))
        const user = await User.findOne({ email }).select("+password");

        if (!user) return next(new ErrorHandler("No user exist with the given email", 401))

        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password", 401))
        }
        sendToken(user, 200, res)
    });

// lOGOUT USER
exports.logoutUser = catchAsyncError(
    async (req, res, next) => {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        res.status(200).json({
            success: true,
            message: "Logged Out"
        })
    });


// Forgot  Password
exports.forgotPassword = catchAsyncError(
    async (req, res, next) => {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return next(new ErrorHandler("User not found", 404))
        }

        // Get user pass token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false })

        const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
        const message = `Your password reset token is :- \n\n <br> ${resetPasswordUrl} \n\n <br> If you have not requested this email than please ignore it`;
        try {
            await sendEmail({
                email: user.email,
                subject: `Ecommerce password recovery`,
                message: message
            });
            res.status(200).json({ success: true, message: `Email send to ${user.email} successfully` })
        } catch (error) {
            user.getResetPasswordToken = undefined;
            user.getResetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false })

            return next(new ErrorHandler(error.message, 500))
        }
    }
)


// Reset password
exports.resetPassword = catchAsyncError(
    async (req, res, next) => {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        console.log(resetPasswordToken);

        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
        if (!user) return next(new ErrorHandler("Reset password token is invalid or has been expired", 401))
        if (req.body.password !== req.body.confirmPassword) return next(new ErrorHandler("Password doenot match", 400))
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        sendToken(user, 200, res);

        return next(new ErrorHandler("Test", 500))
    })

// get user details

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})

// Update user  password : login
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const { newPassword, confirmPassword, oldPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched) return next(new ErrorHandler("Old Password is incorrect", 400))
    if (newPassword !== confirmPassword) return next(new ErrorHandler("Password donot match", 400))

    user.password = newPassword
    await user.save();
    sendToken(user, 200, res)
})



// Update user profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});


// get all users --> Admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({ success: true, users })
})



// get Single users --> Admin
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) return next(new ErrorHandler(`User doesnot exist by id ${req.params.id}`, 400))
    res.status(200).json({ success: true, user })
})


// Update user role-->admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true, runValidators: true, useFindAndModify: false
    })
    res.status(200).json({ success: true, user })
})


// Delete user-->admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) return next(new ErrorHandler(`User doesnot exist by id ${req.params.id}`, 400))

    await user.remove();
    res.status(200).json({ success: true, message: "User removed Successfully" })
})
