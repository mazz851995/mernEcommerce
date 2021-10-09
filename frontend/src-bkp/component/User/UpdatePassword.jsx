import React, { useEffect, useState } from 'react'
import "./UpdatePassword.css"
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, updatePassword } from '../../actions/userAction'
import { useAlert } from 'react-alert'
import Loader from '../layout/loader/Loader'
import { UPDATE_PASSWORD_RESET } from '../../constants/userContants'
import MetaData from '../layout/MetaData'
import LockOpenIcon from "@material-ui/icons/LockOpen"
import LockIcon from "@material-ui/icons/Lock"
import VpnKeyIcon from "@material-ui/icons/VpnKey"


const UpdatePassword = ({ history }) => {

    const dispatch = useDispatch();
    const alert = useAlert()
    const { error, isUpdated, loading } = useSelector(state => state.profile)

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const updatePasswordSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("oldPassword", oldPassword)
        myForm.set("newPassword", newPassword)
        myForm.set("confirmPassword", confirmPassword)
        dispatch(updatePassword(myForm));

    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors);
        }
        if (isUpdated) {
            alert.success("Password Updated Successfully")
            history.push("/account");
            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }
    }, [error, isUpdated, dispatch, alert, history])


    return (
        <>
            {loading ? <Loader /> :
                <>
                    <MetaData title="Change Password" />
                    <div className="updateProfileContainer">
                        <div className="updateProfileBox">
                            <h2 className="updateProfileHeading">Update Password</h2>
                            <form className="updateProfileForm" onSubmit={updatePasswordSubmit}>

                                <div className="signUpPassword">
                                    <VpnKeyIcon />
                                    <input type="password" placeholder="Old Password" required name="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>

                                <div className="signUpPassword">
                                    <LockIcon />
                                    <input type="password" placeholder="New Password" required name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="signUpPassword">
                                    <LockOpenIcon />
                                    <input type="password" placeholder="Confirm Password" required name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <input disabled={loading} type="submit" value={loading ? "..." : "Change Password"} className="updateProfileBtn" />
                            </form>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default UpdatePassword
