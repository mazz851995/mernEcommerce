import React, { useEffect, useState } from 'react'
import "./ForgotPassword.css"
import MailOutlineIcon from "@material-ui/icons/MailOutline"
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, forgotPassword } from '../../actions/userAction'
import { useAlert } from 'react-alert'
import Loader from '../layout/loader/Loader'
import MetaData from '../layout/MetaData'
import { Link } from 'react-router-dom'

const ForgotPassword = ({ history }) => {

    const dispatch = useDispatch();
    const alert = useAlert()

    const { error, loading, message } = useSelector(state => state.forgotPassword)
    const [email, setEmail] = useState("")

    const forgotPasswordSubmit = (e) => {
        const myForm = new FormData();

        myForm.set("email", email);
        dispatch(forgotPassword(myForm));
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors);
        }
        if (message) {
            alert.success(message)
        }
    }, [error, dispatch, alert, message, history])
    return (
        <>
            {loading ? <Loader /> :
                <>
                    <MetaData title="Forgot Password" />
                    <div className="forgotPasswordContainer">
                        <div className="forgotPasswordBox">
                            <h2 className="forgotPasswordHeading">Forgot Password</h2>
                            <form className="forgotPasswordForm" onSubmit={forgotPasswordSubmit}>


                                <div className="forgotPasswordEmail">
                                    <MailOutlineIcon />
                                    <input type="email" placeholder="Email" required name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                <input disabled={loading} type="submit" value={loading ? "..." : "Send"} className="forgotPasswordBtn" />
                            </form>
                            <div className="goBackLink">

                                <Link to="/login" >Go Back</Link>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default ForgotPassword
