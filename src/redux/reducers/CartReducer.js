import {
    ADD_TO_CART,
    DELETE_CART,
    CLEAR_CART
} from '../actions/types'

const INITIAL_STATE = {
    cart: null,
    cartCount: 0,
    cartSelected: []
}

export default (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            return {...state, ...action.payload }
        case DELETE_CART:
            return { ...state, ...action.payload }
        case CLEAR_CART:
            return INITIAL_STATE
        default:
            return state
    }
}