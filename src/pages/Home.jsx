import React, { Component } from 'react';
import { connect } from 'react-redux';

import Carousel from '../components/carousel';
import PopularProduct from '../components/popularproduct';
import { checkBg } from '../helpers/stylefunction';
import {showCart} from '../redux/actions'

class Home extends Component {
    componentDidMount() {
        document.title = 'MaCommerce Online Shop'
        window.scrollTo(0, 0);
       
        this.props.showCart()
        console.log('Jalan')
    }

    render() {
        return (
            <div>
                {/* {
                    this.props.username !== '' ?
                        <Header statusPage='UserLogin' />
                        : 
                        null
                }

                {
                    this.props.username === '' ?
                    <Header statusPage='Home' />
                    :
                    null
                } */}
               
                
                    {/* // this.props.loading ? 
                    //    <div className='container-fluid'>
                    //        <div className="row">
                    //            <div className="col-12 text-center">
                    //                 <div className="spinner-border" role="status">
                    //                     <span className="sr-only">Loading...</span>
                    //                 </div>
                    //            </div>
                    //        </div>
                    //    </div>
                    // : */}
                    <div>
                            <Carousel />
                            <PopularProduct />
                    </div>

                
            </div>
        )
    }
}

const mapStateToProps = ({register, admin}) => {
    return {
        loading: register.loading,
        email: register.email,
        name: register.name,
        role: register.role,
    }
}

export default connect(mapStateToProps, {showCart})(Home);