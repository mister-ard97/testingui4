import { combineReducers } from 'redux';
import RegisterReducer from './RegisterReducer';
import AdminReducer from './AdminReducers';
import CartReducer from './CartReducer';
import TransactionReducer from './TransactionReducer';

export default combineReducers({
    register: RegisterReducer,
    admin: AdminReducer,
    cart: CartReducer,
    transaction: TransactionReducer
})