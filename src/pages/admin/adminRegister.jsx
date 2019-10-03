import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { adminRegister, cleanError } from '../../redux/actions';
import { checkBg } from '../../helpers/stylefunction';

class AdminRegister extends Component {

    componentDidMount() {
        window.scrollTo(0, 0);
        checkBg('AdminRegisterPage', 'bg-dark');
        this.props.cleanError();
    }

    handleSubmitRegister = (e) => {
        e.preventDefault();

        let objAdminReg = {
            username: this.Username.value,
            password: this.Password.value,
            confPassword: this.ConfPassword.value,
            FirstName: this.FirstName.value,
            LastName: this.LastName.value,
            email: this.Email.value,
            address: this.Address.value
        }

        this.props.adminRegister(objAdminReg);
    }

    renderButtonAdminRegister = () => {
        if (this.props.loading) {
            return (
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            )
        }

        return <button type="submit" className="btn btn-warning form-control">Register</button>
    }

    render() {
        if (this.props.NextPage) {
            return <Redirect to='/adminWaitingVerification' />
        }

        if (localStorage.getItem('token') === null) {
            return (
                <div id='AdminRegisterPage' >
                    <div className='container py-3'>
                        <div className='row py-3'>
                            <div className="offset-2 offset-md-3 col-8 col-md-6 py-3">
                                <div className='py-3 text-center'>
                                    <Link to='/admin' className='navbar-brand text-white'>
                                        <span>Ma</span>Commerce Admin
                                    </Link>
                                </div>
                                <div className="card px-3 mb-3">
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">Admin Register Page</h5>
                                        {
                                            this.props.error.length > 0 ?
                                                <div className="alert alert-danger" role="alert">
                                                    {window.scrollTo(0, 0)}
                                                    {this.props.error}
                                                </div>
                                                :
                                                null
                                        }
                                        <form onSubmit={this.handleSubmitRegister}>
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <label>First Name</label>
                                                    <input ref={(FirstName) => { this.FirstName = FirstName }} type="text" className="form-control" placeholder="First name" />
                                                </div>
                                                <div className="col">
                                                    <label>Last Name</label>
                                                    <input ref={(LastName) => this.LastName = LastName} type="text" className="form-control" placeholder="Last name" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Username</label>
                                                <input ref={(Username) => this.Username = Username} type="text" className="form-control" placeholder="Your Username" maxLength='16' minLength='6' />
                                            </div>
                                            <div className="form-group">
                                                <label>Password</label>
                                                <input ref={(Password) => this.Password = Password} type="password" className="form-control" placeholder="Your Password" maxLength='16' minLength='6' />
                                            </div>
                                            <div className="form-group">
                                                <label>Confirm Password</label>
                                                <input ref={(ConfPassword) => this.ConfPassword = ConfPassword} type="password" className="form-control" placeholder="Your Password" maxLength='16' minLength='6' />
                                            </div>
                                            <div className="form-group">
                                                <label>Email address</label>
                                                <input ref={(Email) => this.Email = Email} type="email" className="form-control" placeholder="Enter email" />
                                                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                                            </div>
                                            <div className="form-group">
                                                <label>Alamat</label>
                                                <textarea ref={(Address) => this.Address = Address} placeholder='Your Address' className='form-control'></textarea>
                                            </div>
                                            {this.renderButtonAdminRegister()}
                                        </form>

                                        <hr />
                                        <p className='mt-3'>Sudah menjadi admin?  <Link to='/adminLogin'>Login Now !</Link></p>

                                    </div>
                                </div>
                                <Link to='/' className='text-center text-white'>
                                    <p>Back to MaCommerce Website</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return <Redirect to='/' />
    }

}

const mapStateToProps = (state) => {
    return {
        loading: state.register.loading,
        error: state.register.error,
        NextPage: state.register.NextPage
    }
}

export default connect(mapStateToProps, { adminRegister, cleanError })(AdminRegister);