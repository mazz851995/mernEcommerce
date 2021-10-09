import axios from "axios";
import { CLEAR_ERRORS, LOAD_USER_FAIL, LOAD_USER_REQUEST, LOAD_USER_SUCCESS, LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL, REGISTER_REQUEST, REGISTER_SUCCESS, UPDATE_PROFILE_FAIL, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SUCCESS, UPDATE_PASSWORD_FAIL, UPDATE_PASSWORD_REQUEST, UPDATE_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAIL, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_REQUEST } from "../constants/userContants"


// Login USer
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: LOGIN_REQUEST
        })
        const config = { headers: { "Content-Type": "application/json" } };
        let link = `/api/v1/login`;
        const { data } = await axios.post(link, { email, password }, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message
        })
    }
}

// REgister User
export const register = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: REGISTER_REQUEST
        })
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        let link = `/api/v1/register`;
        const { data } = await axios.post(link, formData, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: REGISTER_FAIL,
            payload: error.response.data.message
        })
    }
}


// Load User
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({
            type: LOAD_USER_REQUEST
        })
        let link = `/api/v1/me`;
        const { data } = await axios.get(link);
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

// Logout User
export const logout = () => async (dispatch) => {
    try {
        await axios.get(`/api/v1/logout`);

        dispatch({ type: LOGOUT_SUCCESS });
    } catch (error) {
        dispatch({ type: LOGOUT_FAIL, payload: error.response.data.message });
    }
};


// Update Profile
export const updateProfile = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_PROFILE_REQUEST
        })
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        let link = `/api/v1/me/update`;
        const { data } = await axios.put(link, formData, config);
        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message
        })
    }
}


// Forgot Password
export const updatePassword = (passwords) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PASSWORD_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.put(`/api/v1/password/update`, passwords, config);

        dispatch({ type: UPDATE_PASSWORD_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message,
        });
    }
};


// FORGOT PASSWORD
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.post(`/api/v1/password/forgot`, email, config);

        dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.message,
        });
    }
};

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
    try {
        dispatch({ type: RESET_PASSWORD_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.put(`/api/v1/password/reset/${token}`, passwords, config
        );

        dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.success });
    } catch (error) {
        dispatch({
            type: RESET_PASSWORD_FAIL,
            payload: error.response.data.message,
        });
    }
};


// Clearing errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}