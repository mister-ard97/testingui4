import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Axios from 'axios'


import { URL_API } from '../helpers/Url_API';

var numeral = require('numeral')

class Wishlist extends Component {
    state = {
        userWishlist: null
    }

    componentDidMount() {
        document.title = 'Wishlist User';
        const token = localStorage.getItem('token');
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }

        Axios.get(URL_API + '/user/getWishlist', options)
            .then((res) => {
                this.setState({ userWishlist: res.data.allWishlistUser })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    renderWishlistUser = () => {
        if (this.state.userWishlist) {
            if (this.state.userWishlist.length !== 0) {
                return this.state.userWishlist.map((val, id) => {
                    return (
                        <tr key={id}>
                            <td>
                                {val.productName}
                            </td>
                            <td>
                                <img src={`${URL_API}${val.coverImage}`} className='img-fluid' style={{ width: '150px' }} alt={`${val.coverImage}-${val.productName}`} />
                            </td>
                            <td>
                                Rp. {numeral(val.price).format(0,0)}
                            </td>
                            <td>
                                <Link to={`/productDetail?productId=${val.productId}`} className='text-dark'>
                                    Go To Product &raquo;
                                </Link>
                            </td>
                            <td>
                                <FontAwesomeIcon icon={faHeart} className='text-danger' /> 
                            </td>
                        </tr>
                    )
                })
            } else {
                return (
                    <tr>
                        <td colSpan='4' className='text-center'>
                            Wishlist untuk {this.props.username} kosong
                        </td>
                    </tr>
                )
            }
        }

        return (
            <div className="spinner-border text-warning" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    render() {
        return (
            <div>
                {
                    this.props.auth ?

                        this.props.role === 'User' || this.props.role === 'Admin' ?
                            <div className='container d-flex mb-5 pb-5'>
                                <div className='col-12 my-5 pb-5'>
                                    <div className="card">
                                        <h4>Wishlist {this.props.username}</h4>
                                        <div className="card-body d-flex justify-content-between">
                                            <table className="table">
                                                <thead className="thead-dark">
                                                    <tr>
                                                        <th scope="col">Product Name</th>
                                                        <th scope="col">Cover Image</th>
                                                        <th scope='col'>Price</th>
                                                        <th scope='col'>Product Detail</th>
                                                        <th scope='col'>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {this.renderWishlistUser()}
                                                </tbody>
                                            </table>
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

const mapStateToProps = ({ register }) => {
    return {
        role: register.role,
        loading: register.loading,
        auth: register.authChecked,
        username: register.username
    }
}

export default connect(mapStateToProps, {})(Wishlist);