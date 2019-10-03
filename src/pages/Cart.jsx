import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {
    showCart,
    deleteCartProduct,
    cleanTransaction
} from '../redux/actions';


import { URL_API } from '../helpers/Url_API';

var numeral = require('numeral');


class Cart extends Component {
    state = {
        total_price: 0
    }

    componentDidMount() {
       if(this.props.role) {
           document.title = `Cart's ${this.props.username}`
           window.scrollTo(0, 0);
        //    document.getElementById('Header').classList.add('bg-light')
        //    document.getElementById('CollapseMaCommerce').classList.remove('link-white')
           this.props.cleanTransaction()
       }
    }

    deleteCartProductById = (id) => {
        this.props.deleteCartProduct(id)
    }

    renderCart = () => {
        if(this.props.cartUser) {
            return this.props.cartUser.map((val, id) => {
                return (
                    <tr key={id}>
                        <td>{val.productName}</td>
                        <td>
                            <img src={`${URL_API}${val.coverImage}`} alt={`${val.coverImage}-${val.productName}`} style={{ width: '100px' }} />
                        </td>
                        <td>
                            {val.small !== 0 ? `S` : null}
                            {val.medium !== 0 ? ` M` : null}
                            {val.large !== 0 ? ` L` : null}
                            {val.xlarge !== 0 ? ` XL` : null}
                        </td>
                        <td>
                            {val.small !== 0 ? `Size S: ${val.small}` : null}
                            {val.medium !== 0 ? ` Size M: ${val.medium}` : null}
                            {val.large !== 0 ? ` Size L: ${val.large}` : null}
                            {val.xlarge !== 0 ? ` Size XL: ${val.xlarge}` : null}
                        </td>
                        <td>
                            Rp. {numeral(val.total_price).format(0,0)}
                        </td>
                        <td>
                            <button
                                className='btn btn-danger alert alert-danger'
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Delete Button"
                                onClick={() => this.deleteCartProductById(val.productId)}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                        </td>
                    </tr>
                )
            })
        } 

        return (
            <tr>
                <td colSpan='6'>
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </td>
            </tr>
        )
    }

    TotalPrice = () => {
        let totalBiaya = 0

       if(this.props.cartUser) {
           this.props.cartUser.forEach((val) => {
               totalBiaya += val.total_price
           })

           return totalBiaya
       } 

       return null
    }

    backToHome = () => {
        return <Redirect to='/' />
    }

    render() { 
        // if(this.props.loading) {
        //     return (
        //         <div className="spinner-border text-warning" role="status">
        //             <span className="sr-only">Loading...</span>
        //         </div>
        //     )
        // } 
                return (
                    <div>

                        {
                            this.props.auth ?

                                this.props.role === 'User' || this.props.role === 'Admin' ?
                                    <div className='container d-flex mb-5 pb-5'>
                                        <div className='col-9 my-5 pb-5'>
                                            <div className="card">
                                                <h4>{this.props.username}'s Cart</h4>
                                                <div className="card-body d-flex justify-content-between">
                                                    <table className="table">
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th scope="col">Product Name</th>
                                                                <th scope="col">Product Image</th>
                                                                <th scope="col">Size</th>
                                                                <th scope='col'>Total Qty</th>
                                                                <th scope='col'>Total Price</th>
                                                                <th scope='col'>Delete</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.renderCart()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-3 my-5 pb-5'>
                                            <div className="card">
                                                <div className="card-body">
                                                    <p>Total Price {this.props.username}'s Cart</p>
                                                    <h4 className='mb-3'>Rp. {numeral(this.TotalPrice()).format(0,0)}</h4>
                                                    <Link to='/confirm_order' className='form-control btn btn-warning'>
                                                        Confirm Pemesanan
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                :

                                    // <Redirect to='/' />
                                    <p>Wishlist</p>

                            : 
                            
                            null
                        }
                    </div>
                )
    }
}

const mapStateToProps = ({ cart,  register}) => {
    return {
      cartUser: cart.cart,
      role: register.role,
      loading: register.loading,
      auth: register.authChecked,
      username: register.username
    }
}

export default connect(mapStateToProps, {
    showCart,
    deleteCartProduct,
    cleanTransaction
})(Cart);