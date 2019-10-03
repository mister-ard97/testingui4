import Axios from 'axios';
import {
   AUTH_LOGIN_ERROR,
   AUTH_LOGIN_LOADING,
   USER_LOGIN_SUCCESS,
   USER_CHANGE_ADDRESS,
   USER_LOGOUT,
   VERIFICATION_SUCCESS,
   VERIFICATION_FAILED, 
   CLEAN_ERROR,
   CLEAR_CART
} from './types';
import { URL_API } from '../../helpers/Url_API';

export const onUserRegister = (data) => {
    let {
        username,
        password,
        confPassword,
        FirstName,
        LastName,
        email,
        address,
        UserImage
    } = data

    return (dispatch) => {
        dispatch({type: AUTH_LOGIN_LOADING});
        if (username === '' ||
            password === '' ||
            confPassword === '' ||
            FirstName === '' ||
            LastName === '' ||
            email === '' ||
            address === '' ||
            UserImage === '' ) {

                dispatch({type: AUTH_LOGIN_ERROR, payload: {
                    error: 'Semua Form Input Harus Diisi',
                }})
            
            } else if(!(password === confPassword)) {
                dispatch({
                    type: AUTH_LOGIN_ERROR, payload: {
                        error: 'Password dan Confirmation Password Harus Sama',
                    }
                }) 
            } else {

                let formData = new FormData();
                var headers = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }

                delete data.confPassword;

                formData.append('imageUser', UserImage)

                delete data.UserImage;

                formData.append('data', JSON.stringify(data))

                Axios.post(URL_API + '/user/userRegister', formData, headers)
                    .then((res) => {
                        let { FirstName, LastName, username, email, token, status, role, address, UserImage } = res.data
                        localStorage.setItem('token', token);
                        dispatch({
                            type: USER_LOGIN_SUCCESS, payload: {
                                FirstName,
                                LastName,
                                username,
                                email,
                                token,
                                status,
                                role,
                                address,
                                UserImage,
                                justRegister: true,
                                loginChecked: true,
                                NextPage: true
                            }
                        })
                    })
                    .catch((err) => {
                        if(err.response) {
                            dispatch({
                                type: AUTH_LOGIN_ERROR, payload: {
                                    error: err.response.data.message,
                                }
                            })
                        }
                    })
            }
    }      
}

export const EmailVerification = () => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN_LOADING });
        const token = localStorage.getItem('token');
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
        Axios.put(URL_API + '/user/userEmailVerification', {}, options)
            .then((res) => {
                let { FirstName, LastName, username, email, token, status, role, address, UserImage } = res.data
                localStorage.setItem('token', token);
                dispatch({
                    type: USER_LOGIN_SUCCESS, payload: {
                        FirstName,
                        LastName,
                        username,
                        email,
                        token,
                        status,
                        role,
                        address,
                        UserImage,
                        justRegister: true,
                        loginChecked: true
                    }
                })
                dispatch({ type: VERIFICATION_SUCCESS });
            })
            .catch((err) => {
                dispatch({ type: VERIFICATION_FAILED });
            })
    }
}

export const resendEmailVerification = (username, email) => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN_LOADING });
        Axios.post(URL_API + '/user/userResendEmailVerification', {
            username,
            email,
        })
        .then((res) => {
            let { FirstName, LastName, username, email, token, status, role, address, UserImage } = res.data
            localStorage.setItem('token', token);
            dispatch({
                type: USER_LOGIN_SUCCESS, payload: {
                    FirstName,
                    LastName,
                    username,
                    email,
                    token,
                    status,
                    role,
                    address,
                    UserImage,
                    justRegister: true,
                    loginChecked: true
                }
            })
            dispatch({ type: VERIFICATION_SUCCESS });
        })
        .catch((err) => {
            dispatch({ type: VERIFICATION_FAILED });
        })
    }
}

export const userLogin = (username, password) => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN_LOADING });

        Axios.post(URL_API + '/user/userLogin', {
            username, password
        })
        .then((res) => {
            let { FirstName, LastName, username, email, token, status, role, address, UserImage } = res.data
            localStorage.setItem('token', token);
            dispatch({
                type: USER_LOGIN_SUCCESS, payload: {
                    FirstName,
                    LastName,
                    username,
                    email,
                    token,
                    status,
                    role,
                    address,
                    UserImage, 
                    loginChecked: true
                }
            })
        })
        .catch((err) => {
            if(err.response) {
                dispatch({
                    type: AUTH_LOGIN_ERROR, payload: {
                        error: err.response.data.message,
                    }
                })
            }
        })
    }
}

export const userLoginWithGoogle = (data) => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN_LOADING });

        Axios.post(URL_API + '/user/userLoginWithGoogle', {data})
            .then((res) => {
                let { FirstName, LastName, username, email, token, status, role, address, UserImage } = res.data
                localStorage.setItem('token', token);
                dispatch({
                    type: USER_LOGIN_SUCCESS, payload: {
                        FirstName,
                        LastName,
                        username,
                        email,
                        token,
                        status,
                        role,
                        address,
                        UserImage,
                        loginChecked: true
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const KeepLogin = () => {
   return (dispatch) => {
       dispatch({ type: AUTH_LOGIN_LOADING });
       const token = localStorage.getItem('token');
       const options = {
           headers: {
               'Authorization': `Bearer ${token}`,
           }
       }

       Axios.post(URL_API + '/user/userKeepLogin', {}, options)
           .then((res) => {
               let { FirstName, LastName, username, email, token, status, role, address, UserImage} = res.data
               localStorage.setItem('token', token);
               dispatch({
                   type: USER_LOGIN_SUCCESS, payload: {
                       FirstName,
                       LastName,
                       username,
                       email,
                       token,
                       status,
                       role,
                       address,
                       UserImage, 
                       loginChecked: true
                   } })
           })
           .catch((err) => {
               localStorage.removeItem('token');
               dispatch({ type: USER_LOGOUT });
           })
    }
}

export const changeShipmentAddress = (data) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
        
        Axios.post(URL_API + '/user/userChangeAddress', {data}, options)
            .then((res) => {
                let { FirstName, LastName, address } = res.data
                dispatch({
                    type: USER_CHANGE_ADDRESS, payload: {
                        FirstName,
                        LastName,
                        address
                    }
                })
            })
            .catch((err) => {
               console.log(err)
            })
    }
}

export const userLogOut = () => {
        localStorage.removeItem('token');
        return(dispatch) => {
            dispatch({ type: USER_LOGOUT })
            dispatch({ type: CLEAR_CART })
        }
}

export const cleanError = () => {
    return {
        type: CLEAN_ERROR
    };
}