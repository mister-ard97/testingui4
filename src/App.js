import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { KeepLogin, showCart, getAllProductUI } from './redux/actions';
import './App.css';

import Header from './components/header';

import Home from './pages/Home';
import SearchProduct from './pages/SearchProduct'
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import ConfirmOrder from './pages/ConfirmOrder';
import Payment from './pages/Payment';
import TransactionList from './pages/TransactionList';
import Wishlist from './pages/Wishlist';
import ChangeAddress from './pages/ChangeAddress';
import Login from './pages/Login';
import Register from './pages/Register';
import WaitingVerification from './pages/WaitingVerification';
import Verified from './pages/Verified';
import NotFound from './pages/NotFound';

import Footer from './components/footer'

// admin 
import AdminDashboard from './pages/admin/adminDashboard';
import AdminLogin from './pages/admin/adminLogin';
import AdminRegister from './pages/admin/adminRegister';
import AdminWaitingVerification from './pages/admin/adminWaitingVer';
import AdminVerified from './pages/admin/adminVerified';
 
class App extends Component {
  
  componentDidMount() {
    this.props.KeepLogin();
    this.props.showCart();
  }

  render() {
    // if(this.props.loading) {
    //   return (
    //     <div>
    //       <Header />

    //       <div>
    //         <p>Loading...</p>
    //       </div>

    //       <Footer />
    //     </div>
    //   )
    // }
    return (
        <div className='MaCommerce'>
          <Header />
          <Switch>
          
            <Route path='/' component={Home} exact />
            <Route path='/searchproduct' component={SearchProduct} />
            <Route path='/productDetail' component={ProductDetail} />
            <Route path='/cart' component={Cart} />
            <Route path='/confirm_order' component={ConfirmOrder} />
            <Route path='/payment' component={Payment} />
            <Route path='/transaction_list' component={TransactionList} />
            <Route path='/wishlist' component={Wishlist} />
            <Route path='/changeAddress' component={ChangeAddress} />
            <Route path='/login' component={Login} exact />
            <Route path='/register' component={Register} exact />
            <Route path='/waitingverification' component={WaitingVerification} />
            <Route path='/verified' component={Verified} />
            <Route path='*' component={NotFound} />

            
          </Switch>

        <Footer />
       
        {/* Route Admin */}
        {/* <Route path='/adminDashboard' component={AdminDashboard} />
        <Route path='/adminLogin' component={AdminLogin} exact />
        <Route path='/adminRegister' component={AdminRegister} exact />
        <Route path='/adminWaitingVerification' component={AdminWaitingVerification} exact />
        <Route path='/adminVerified' component={AdminVerified} /> */}
        </div>
    )
  }
} 

const mapStateToProps = ({register}) => {
  return {
    loading: register.loading
  }
}

export default connect(mapStateToProps, { KeepLogin, showCart, getAllProductUI})(App);
