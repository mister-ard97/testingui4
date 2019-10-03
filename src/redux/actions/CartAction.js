import Axios from 'axios';
import {
    ADD_TO_CART,
    DELETE_CART
} from './types';
import { URL_API } from '../../helpers/Url_API';

export const userAddProduct = (obj) => {
    return(dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + '/cart/addedToCart', {data: obj}, options)
        .then((res) => {
            dispatch({
                type: ADD_TO_CART,
                payload: {
                    cart: res.data.dataCart,
                    cartCount: res.data.cartCount
                }
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }
}

export const showCart = () => {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.get(URL_API + '/cart/showCart', options)
            .then((res) => {
                dispatch({
                    type: ADD_TO_CART,
                    payload: {
                        cart: res.data.dataCart,
                        cartCount: res.data.cartCount
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const deleteCartProduct = (productId) => {
    return (dispatch) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(URL_API + '/cart/deleteCart/' + productId, {}, options)
            .then((res) => {
                dispatch({
                    type: DELETE_CART,
                    payload: {
                        cart: res.data.dataCart,
                        cartCount: res.data.cartCount
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}
