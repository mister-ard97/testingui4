import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import {sendCartToTransaction } from '../redux/actions'

import ModalMaCommerce from '../components/modal';

var numeral = require('numeral');

class ConfirmOrder extends Component {
    state = {
        link: '', 
        loadingProcess: false,
        FirstName: '',
        LastName: '',
        Address: '',
        error: '',
        modalNewAddress: false
    }

    componentDidMount() {
        document.title = 'Confirm Order'
        if (this.props.role) {
            window.scrollTo(0, 0);
            document.getElementById('Header').classList.add('bg-light')
            document.getElementById('CollapseMaCommerce').classList.remove('link-white')
        }
    }

    componentDidUpdate() {
        if (this.props.transactionUser.length !== 0) {
            this.setState({
                loadingProcess: false,
                link: 'GoToPayment'
            })
        }
    }

    sendDataCartToTransaction = () => {
        if(this.state.Address || this.state.FirstName || this.state.LastName) {
            let obj = []
            // make callback function for make loadingProcess true
            // make promise to make action creator run first then our setState to move page automatically
            this.setState({ loadingProcess: true, error: '' }, () => {

                // forEach is a syncronous, which means the code will run until forEach process completed
                this.props.cartUser.forEach((val, id) => {
                    obj.push(val)
                })

                this.props.sendCartToTransaction(
                    obj,
                    this.TotalPrice(),
                    this.state.Address,
                    this.state.FirstName,
                    this.state.LastName)
            })
        } else {
            this.setState({error: 'Harap memilih untuk menggunakan alamat yang mana'})
        }
    }

    TotalPrice = () => {
        let totalBiaya = 0

        if (this.props.cartUser) {
            this.props.cartUser.forEach((val) => {
                totalBiaya += val.total_price
            })

            return totalBiaya
        }

        return null
    }


    renderOrderConfirmation = () => {
        if (this.props.cartUser) {
            // Kalo cart tidak kosong
           if(this.props.cartUser.length !== 0) {
               return this.props.cartUser.map((val, id) => {
                   return (
                       <tr key={id}>
                           <td>{val.productName}</td>
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
                       </tr>
                   )
               })
           } else {
               return (
                   // <Redirect to='/' />
                   <p>Wishlist</p>
               )
           }
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

    addNewAddress = () => {
        if (this.FirstName.value || this.LastName.value || this.Address.value) {
            this.setState({
                modalNewAddress: false,
                FirstName: this.FirstName.value,
                LastName: this.LastName.value,
                Address: this.Address.value,
                errorModal: ''
            })
        } else {
            this.setState({
                errorModal: 'Firstname, Lastname atau Address tidak boleh kosong'
            })
        }
    }

    renderModalNewAddress = (params) => {
        if(params) {
            return (
                <ModalMaCommerce 
                    idModal='modalNewAddress'
                    className='modal-md'
                    modal={this.state.modalNewAddress}
                    errorMessage={this.state.errorModal}
                    toggle={this.toggle}
                    ModalHeader={'Input New Address Shipment'}
                    ModalBody={
                        <form onSubmit={this.addNewAddress}>
                            <div className='form-group'>
                                <label>FirstName</label>
                                <input ref={(FirstName) => this.FirstName = FirstName} type="text" className="form-control" placeholder="Enter Your Firstname" required />
                                <label>LastName</label>
                                <input ref={(LastName) => this.LastName = LastName} type="text" className="form-control" placeholder="Enter Your Lastname" maxLength='16' minLength='6' required />
                                <label>Address</label>
                                <textarea ref={(Address) => this.Address = Address} className='form-control' placeholder='Enter New Address' required></textarea>
                            </div>
                        </form>
                    }
                    buttonClickName={'Save'}
                    colorOnClick="success"
                    onClickModal={this.addNewAddress}
                />
            )
        }
    }

    toggle = () => {
        this.setState({
            modalNewAddress: !this.state.modalNewAddress,
            error: '',
            errorModal: ''
        })
    }


    render() {
        if (this.state.link === 'GoToPayment'){
            return <Redirect to='/payment' />
        }
        // if (this.props.loading) {
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
                                <div className='container py-3'>
                                    <div className='row py-3'>
                                        <div className="offset-2 col-8 py-3">
                                            <div className='py-3 text-center'>
                                                <h4>Order Confirmation for user: {this.props.username}</h4>
                                            </div>
                                            <div className="card px-3">
                                                <div className="card-body">
                                                    {
                                                        this.state.error ?
                                                            <div className="alert alert-danger" role="alert">
                                                                {window.scrollTo(0, 0)}
                                                                {this.state.error}
                                                            </div>
                                                        :
                                                        null
                                                    }
                                                    <div className='mb-3'>

                                                        <button className='btn btn-warning' onClick={() => this.setState({
                                                            FirstName: this.props.FirstName,
                                                            LastName: this.props.LastName,
                                                            Address: this.props.addressUser,
                                                            error: '',
                                                            
                                                        })}>
                                                                Gunakan Nama dan Alamat Utama
                                                        </button>

                                                        <button className='btn btn-warning ml-3' onClick={() => this.setState({ 
                                                            modalNewAddress: true, 
                                                            Address: '', 
                                                            FirstName: '', 
                                                            LastName: '',
                                                            error: '',
                                                            })}
                                                        >
                                                                Gunakan Nama dan Alamat Baru
                                                        </button>
                                                        {this.renderModalNewAddress(this.state.modalNewAddress)}
                                                    </div>
                                                    {
                                                        this.state.Address ?
                                                            <div className='font-weight-bold'>
                                                                <hr/>
                                                                <h6 className='text-center'>Address Shipment</h6>
                                                                <p>Alamat : {this.state.Address}</p>
                                                                <p>Receiver: {this.state.FirstName} {this.state.LastName}</p>
                                                                <hr/>
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                    <table className="table">
                                                        <thead className="thead-dark">
                                                            <tr>
                                                                <th scope="col">Product Name</th>
                                                                <th scope="col">Size</th>
                                                                <th scope='col'>Total Qty</th>
                                                                <th scope='col'>Total Price</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.renderOrderConfirmation()}
                                                        </tbody>
                                                    </table>
                                                    <Link to='/cart' className='btn btn-warning mr-3'>
                                                        Back to Cart
                                                    </Link>
                                                    {
                                                        this.state.loadingProcess ? 
                                                        <button className=' btn btn-success'>
                                                                <div className="spinner-border" role="status">
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>
                                                        </button>
                                                           
                                                        :
                                                            <button className='btn btn-success' onClick={() => {
                                                                this.sendDataCartToTransaction()
                                                            }}>
                                                                Proceed to Payment Product
                                                        </button>
                                                    }
                                                   
                                                </div>
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

const mapStateToProps = ({ cart , register, transaction }) => {
    return {

        cartUser: cart.cart,
        
        role: register.role,
        loading: register.loading,
        auth: register.authChecked,
        username: register.username,
        FirstName: register.FirstName,
        LastName: register.LastName,
        addressUser: register.address,

        transactionUser: transaction.transaction_selected
    }
}

export default connect(mapStateToProps, {
    sendCartToTransaction
})(ConfirmOrder)