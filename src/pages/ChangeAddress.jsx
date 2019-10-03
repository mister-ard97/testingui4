import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
//import Axios from 'axios'


import { changeShipmentAddress } from '../redux/actions';

class ChangeAddress extends Component {
    state = {
        editAddress: false,
        loading: false,
    }

    componentDidMount() {
        document.title = 'Shipment Address User';
    }

    updateShipmentAddress = () => {
        let data = {
            FirstName: this.FirstName.value === '' ? this.props.FirstName : this.FirstName.value,
            LastName: this.LastName.value === '' ? this.props.LastName : this.LastName.value,
            address: this.Address.value === '' ? this.props.addressUser : this.Address.value
        }
        this.setState({loading: true}, () => {
            this.props.changeShipmentAddress(data)
            this.setState({
                loading: false,
                editAddress: false
            })
        })
    }

    render() {
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
                            <div className='container d-flex mb-5 pb-5'>
                                <div className='col-12 my-5 pb-5'>
                                    <div className="card">
                                        <h4>Shipment Address {this.props.username}</h4>
                                        {
                                            this.state.editAddress ?
                                                <div className="card-body">
                                                    <div className="row mb-3">
                                                        <div className="col">
                                                            <label>First Name</label>
                                                            <input ref={(FirstName) => { this.FirstName = FirstName }} type="text" className="form-control" defaultValue={this.props.FirstName ? this.props.FirstName : ''} />
                                                        </div>
                                                        <div className="col">
                                                            <label>Last Name</label>
                                                            <input ref={(LastName) => { this.LastName = LastName }} type="text" className="form-control" defaultValue={this.props.LastName ? this.props.LastName : ''} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Alamat</label>
                                                        <textarea ref={(Address) => { this.Address = Address }} className='form-control' defaultValue={this.props.addressUser ? this.props.addressUser : ''}></textarea>
                                                    </div>
                                                    {
                                                        this.state.loading ?
                                                            <button className='btn btn-warning' disabled>
                                                                <div className="spinner-border text-warning" role="status">
                                                                    <span className="sr-only">Loading...</span>
                                                                </div>
                                                            </button>
                                                        :

                                                            <button className='btn btn-warning' onClick={this.updateShipmentAddress}>
                                                                Update Shipment Address
                                                            </button>
                                                    }
                                                </div>

                                                :

                                                <div className="card-body">
                                                    <div className="row mb-3">
                                                        <div className="col">
                                                            <label>First Name</label>
                                                            <input type="text" className="form-control" value={this.props.FirstName} disabled />
                                                        </div>
                                                        <div className="col">
                                                            <label>Last Name</label>
                                                            <input  type="text" className="form-control" value={this.props.LastName} disabled />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Alamat</label>
                                                        <textarea className='form-control' value={this.props.addressUser} disabled></textarea>
                                                    </div>
                                                    <button className='btn btn-warning' onClick={() => this.setState({ editAddress: true })}>
                                                        Change Shipment Address
                                                </button>
                                                </div>
                                        }
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
        FirstName: register.FirstName,
        LastName: register.LastName,
        addressUser: register.address,
        role: register.role,
        loading: register.loading,
        auth: register.authChecked,
        username: register.username
    }
}

export default connect(mapStateToProps, { changeShipmentAddress})(ChangeAddress);