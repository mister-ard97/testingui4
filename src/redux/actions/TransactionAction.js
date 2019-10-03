import Axios from 'axios';
import {
    GET_ALL_TRANSACTION,
    SEND_TO_TRANSACTION, 
    CLEAR_CART,
    CLEAR_TRANSACTION,
    CLEAR_DETAIL_AND_SELECTED
} from './types'
import { URL_API } from '../../helpers/Url_API';

// User
export const sendCartToTransaction = (objCart, total_price, address, firstName, lastName) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        let objUser = {
            firstName,
            lastName,
            total_price,
            address
        }

        Axios.post(URL_API + '/transaction/addTransaction', { data: objCart, dataUser: objUser }, options)
            .then((res) => {
                dispatch({
                    type: SEND_TO_TRANSACTION,
                    payload: {
                        transaction_selected: res.data.dataTransactionUI,
                        transaction_detail: res.data.dataTransactionDetailUI,
                    }
                })
                dispatch({
                    type: CLEAR_CART
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const getUserTransaction = () => {
    return(dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.get(URL_API + '/transaction/getUserTransaction', options)
            .then((res) => {
                dispatch({
                    type: GET_ALL_TRANSACTION,
                    payload: {
                        transaction: res.data.dataTransactionUI,
                        transaction_detail: [],
                        transaction_selected: []
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const getTransactionDetail = (id) => {
    return(dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.get(URL_API + '/transaction/getTransactionDetail/' + id, options)
            .then((res) => {
                dispatch({
                    type: SEND_TO_TRANSACTION,
                    payload: {
                        transaction_selected: res.data.dataTransactionUI,
                        transaction_detail: res.data.dataTransactionDetailUI
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const sendPaymentSlipToAdmin = (id, paymentImage) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');
        let formData = new FormData()
        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        formData.append('paymentImage', paymentImage);

        Axios.post(URL_API + '/transaction/updatePaymentUser/' + id, formData, options)
            .then((res) => {
                dispatch({
                    type: SEND_TO_TRANSACTION,
                    payload: {
                        transaction_selected: res.data.dataTransactionUI,
                        transaction_detail: res.data.dataTransactionDetailUI
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const confirmProductToAdmin = (id) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + '/transaction/confirmProductToAdmin/' + id, {}, options)
            .then((res) => {
                Axios.get(URL_API + '/transaction/getTransactionAdminDetail/' + id, options)
                    .then((res) => {
                        dispatch({
                            type: SEND_TO_TRANSACTION,
                            payload: {
                                transaction_selected: res.data.dataTransactionUI,
                                transaction_detail: res.data.dataTransactionDetailUI
                            }
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const sendNotificationToAdmin = (id) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + '/transaction/sendNotificationProduct/' + id, {}, options)
            .then((res) => {
                Axios.get(URL_API + '/transaction/getTransactionAdminDetail/' + id, options)
                    .then((res) => {
                        dispatch({
                            type: SEND_TO_TRANSACTION,
                            payload: {
                                transaction_selected: res.data.dataTransactionUI,
                                transaction_detail: res.data.dataTransactionDetailUI
                            }
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}


// Admin
export const getAllUserTransaction = () => {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.get(URL_API + '/transaction/getAllTransaction', options)
            .then((res) => {
                dispatch({
                    type: GET_ALL_TRANSACTION,
                    payload: {
                        transaction: res.data.dataTransactionUI,
                        transaction_detail: [],
                        transaction_selected: []
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const getTransactionAdminDetail = (id) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.get(URL_API + '/transaction/getTransactionAdminDetail/' + id, options)
            .then((res) => {
                dispatch({
                    type: SEND_TO_TRANSACTION,
                    payload: {
                        transaction_selected: res.data.dataTransactionUI,
                        transaction_detail: res.data.dataTransactionDetailUI
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const refusePaymentSlipFromUser = (id) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + '/transaction/refusePaymentUser/' + id, {}, options)
            .then((res) => {
                Axios.get(URL_API + '/transaction/getTransactionAdminDetail/' + id, options)
                    .then((res) => {
                        dispatch({
                            type: SEND_TO_TRANSACTION,
                            payload: {
                                transaction_selected: res.data.dataTransactionUI,
                                transaction_detail: res.data.dataTransactionDetailUI
                            }
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const acceptPaymentSlipFromUser = (id) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + '/transaction/acceptPaymentUser/' + id, {}, options)
            .then((res) => {
                Axios.get(URL_API + '/transaction/getTransactionAdminDetail/' + id, options)
                    .then((res) => {
                        dispatch({
                            type: SEND_TO_TRANSACTION,
                            payload: {
                                transaction_selected: res.data.dataTransactionUI,
                                transaction_detail: res.data.dataTransactionDetailUI
                            }
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const sendProductToUser = (id) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + '/transaction/sendProductToUser/' + id, {}, options)
            .then((res) => {
                Axios.get(URL_API + '/transaction/getTransactionAdminDetail/' + id, options)
                    .then((res) => {
                        dispatch({
                            type: SEND_TO_TRANSACTION,
                            payload: {
                                transaction_selected: res.data.dataTransactionUI,
                                transaction_detail: res.data.dataTransactionDetailUI
                            }
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const refuseTransactionUser = (id) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + '/transaction/refuseTransactionUser/' + id, {}, options)
            .then((res) => {
                Axios.get(URL_API + '/transaction/getTransactionAdminDetail/' + id, options)
                    .then((res) => {
                        dispatch({
                            type: SEND_TO_TRANSACTION,
                            payload: {
                                transaction_selected: res.data.dataTransactionUI,
                                transaction_detail: res.data.dataTransactionDetailUI
                            }
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const acceptTransactionUser = (id) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + '/transaction/acceptTransactionUser/' + id, {}, options)
            .then((res) => {
                Axios.get(URL_API + '/transaction/getTransactionAdminDetail/' + id, options)
                    .then((res) => {
                        dispatch({
                            type: SEND_TO_TRANSACTION,
                            payload: {
                                transaction_selected: res.data.dataTransactionUI,
                                transaction_detail: res.data.dataTransactionDetailUI
                            }
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}
    

export const cleanTransaction = () => {
    return {
        type: CLEAR_TRANSACTION
    }
}

export const cleanDetailAndSelectedTransaction = () => {
    return {
        type: CLEAR_DETAIL_AND_SELECTED,
        payload: {
            transaction_detail: [],
            transaction_selected: []
        }
    }
}