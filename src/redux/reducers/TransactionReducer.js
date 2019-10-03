import {
    SEND_TO_TRANSACTION,
    CLEAR_TRANSACTION,
    GET_ALL_TRANSACTION
} from '../actions/types'

const INITIAL_STATE = {
    transaction: [],
    transaction_detail: [],
    transaction_selected: [],
}

export default (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_ALL_TRANSACTION: 
            return {...INITIAL_STATE, ...action.payload}
        case SEND_TO_TRANSACTION:
            return {...INITIAL_STATE, ...action.payload}
        case CLEAR_TRANSACTION:
            return INITIAL_STATE
        default:
            return state
    }
}