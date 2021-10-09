const nodeMailer = require("nodeMailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({    
        service : process.env.SMPT_SERVICE,
        auth : {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        }
    })

    const mailOptions = {
        from : process.env.SMPT_MAIL,
        subject : "Reset you password",
        to: options.email,                
        html: options.message
    }
    await transporter.sendMail(mailOptions)
}



module.exports = sendEmail