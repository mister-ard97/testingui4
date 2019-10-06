import React, { Component } from 'react';

import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { EmailVerification } from '../redux/actions';
import queryString from 'query-string';
import Axios from 'axios';
import { URL_API } from '../helpers/Url_API'


class VerifiedPage extends Component {
    state = {
        loading: true,
        token: null
    }

    componentDidMount() {
        document.title = 'Reset Password'
        let params = queryString.parse(this.props.location.search)
        console.log(params)
        if(params.token) {
            const options = {
                headers: {
                    'Authorization': `Bearer ${params.token}`,
                }
            }

            Axios.get(URL_API +'/user/userGetResetToken', options)
            .then((res) => {
                this.setState({loading: false, token: params.token})
            })
            .catch((err) => {
                if(err.response) {
                    return <Redirect to='/' />
                }
            })

        } else {
            this.setState({loading: false})
            return <Redirect to='/' />
        }
    }

    render() {
        if(this.state.loading) {
            return (
                <div className='container py-1'>
                    <div className='row py-1'>
                        <div className="offset-2 offset-md-3 col-8 col-md-6 py-3">
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if (this.state.token) {
            return (
                <div id='VerifiedPasswordToken'>
                    <div className='container py-1'>
                        <div className='row py-1'>
                            <div className="offset-2 offset-md-3 col-8 col-md-6 py-3">
                                <div className='py-3 text-center'>
                                    <Link to='/' className='navbar-brand text-dark'>
                                        Testing<span>Ui</span>
                                    </Link>
                                </div>
                                <div className="card p-3 font-weight-bold text-center">
                                    {/* {
                                        this.props.loading ?
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            :
                                            this.props.status === 'Unverified' ?
                                                <p className='text-danger'>Verification Failed. Please refresh your page</p>
                                                :
                                                this.props.status === 'Verified' ?
                                                    <p className='text-success'>Verification Success. Thanks for your patience :)</p>
                                                    :
                                                    null
                                    } */}
                                    {/* <p className='mt-3'><Link to='/'>Back to Home</Link></p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <Redirect to='/' />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.register.loading,
        status: state.register.status,
        token: state.register.token,
        justRegister: state.register.justRegister
    }
}

export default connect(mapStateToProps, { EmailVerification })(VerifiedPage);