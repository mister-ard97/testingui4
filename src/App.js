import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { KeepLogin, showCart } from './redux/actions';
import './App.css';

import Header from './components/header';

import Home from './pages/Home';
import GalangDana from './pages/GalangDana';
import CategoryCampaign from './pages/categoryCampaign';
import SearchProduct from './pages/SearchProduct'
import ProductDetail from './pages/ProductDetail';

import ConfirmOrder from './pages/ConfirmOrder';
import Payment from './pages/Payment';
import TransactionList from './pages/TransactionList';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/userFeature/changePassword'
import VerifiedResetPassword from './pages/VerifiedPasswordToken';
import WaitingVerification from './pages/WaitingVerification';
import Verified from './pages/Verified';
import NotFound from './pages/NotFound';

import UserPage from './pages/User'
import VerificationUser from './pages/userFeature/verificationUser';

import BottomNav from './components/bottomNav'

 
class App extends Component {

  componentDidMount() {
    this.props.KeepLogin();
  }

  render() {
    // checkauthChecked
    if(!this.props.authChecked) {
      return (       
          <div className='MaCommerce' >
            <div className='container' >
              <div className='row' >
              <div className='offset-1 col-10 col-sm-8 offset-sm-2 col-md-6 offset-md-3 text-center' >
                  <Header />

                  <div className="spinner-border mt-3" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>

                  <BottomNav />
                </div>
              </div>
            </div>
        </div>
      )
    }
    return (
        <div className='MaCommerce' >
          <div className='container' >
            <div className='row' >
                <div className='offset-1 col-10 col-sm-8 offset-sm-2 col-md-6 offset-md-3' >
              <Header />
              <Switch>

                <Route path='/' component={Home} exact />
                <Route path='/galangDana' component={GalangDana} />
                <Route path='/categoryCampaign' component={CategoryCampaign} />
                <Route path='/searchproduct' component={SearchProduct} />
                <Route path='/productDetail' component={ProductDetail} />

                <Route path='/confirm_order' component={ConfirmOrder} />
                <Route path='/payment' component={Payment} />
                <Route path='/transaction_list' component={TransactionList} />
   
                <Route path='/login' component={Login} exact />
                <Route path='/register' component={Register} exact />
                <Route path='/forgotPassword' component={ForgotPassword} />
                <Route path='/verifiedReset' component={VerifiedResetPassword} />
                <Route path='/waitingverification' component={WaitingVerification} />
                <Route path='/verified' component={Verified} />
                
                <Route path='/user' component={UserPage} />
                <Route path='/verificationUser' component={VerificationUser} />
                <Route path='/changePassword' component={ChangePassword} />
                <Route path='*' component={NotFound} />


              </Switch>

                <BottomNav />
                </div>
            </div>
          </div>
       
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
    authChecked: register.authChecked
  }
}

export default connect(mapStateToProps, { KeepLogin, showCart})(App);
