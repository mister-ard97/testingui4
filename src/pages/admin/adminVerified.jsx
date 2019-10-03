import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { adminEmailVerification } from '../../redux/actions';
import { checkBg } from '../../helpers/stylefunction';

class AdminVerifiedPage extends Component {
    componentDidMount() {
        checkBg('AdminVerifiedPage', 'bg-dark');

        this.props.adminEmailVerification()
    }
    render() {
        if (localStorage.getItem('token') !== null) {
            return (
                <div id='AdminVerifiedPage'>
                    <div className='container py-1'>
                        <div className='row py-1'>
                            <div className="offset-2 offset-md-3 col-8 col-md-6 py-3">
                                <div className='py-3 text-center'>
                                    <Link to='/' className='navbar-brand text-white'>
                                        <span>Ma</span>Commerce Admin
                                    </Link>
                                </div>
                                <div className="card p-3 font-weight-bold text-center">
                                    {
                                        this.props.loading ?
                                            <div className="spinner-border" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                            :
                                            null
                                    }

                                    {
                                        this.props.status === 'Verified' ?
                                            <p className='text-success'>Verification Success. Thanks for your patience :)</p>
                                            :
                                            null
                                    }

                                    {
                                        this.props.status === 'Unverified' ?
                                            <p className='text-danger'>Verification Failed. Please refresh your page</p>
                                            :
                                            null
                                    }
                                    <p className='mt-3'><Link to='/adminDashboard'>Go to Admin Dashboard</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return <Redirect to='/' />
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

export default connect(mapStateToProps, { adminEmailVerification })(AdminVerifiedPage);