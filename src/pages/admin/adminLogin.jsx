import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { adminLogin, cleanError } from '../../redux/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { checkBg } from '../../helpers/stylefunction';

class AdminLogin extends Component {

    componentDidMount() {
        checkBg('AdminLoginPage', 'bg-dark');
        this.props.cleanError();
    }

    handleSubmitLogin = (e) => {
        e.preventDefault();
       this.props.adminLogin(this.Username.value, this.Password.value);
    }

    renderButtonAdminLogin = () => {
        if (this.props.loading) {
            return (
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            )
        }

        return <button type="submit" className="btn btn-warning form-control">Login</button>
    }

    render() {
        if (localStorage.getItem('token') === null) {
            return (
                <div id='AdminLoginPage' >
                    <div className='container py-3'>
                        <div className='row py-3'>
                            <div className="offset-2 offset-md-3 col-8 col-md-6 py-3">
                                <div className='py-3 text-center'>
                                    <Link to='/adminLogin' className='navbar-brand text-white'>
                                        <span>Ma</span>Commerce Admin
                                    </Link>
                                </div>
                                <div className="card px-3 mb-3">
                                    <div className="card-body">
                                        <h5 className="card-title mb-3">Admin Login Page</h5>
                                        {
                                            this.props.error.length > 0 ?
                                                <div className="alert alert-danger" role="alert">
                                                    {window.scrollTo(0, 0)}
                                                    {this.props.error}
                                                </div>
                                                :
                                                null
                                        }
                                        <form onSubmit={this.handleSubmitLogin}>
                                            <div className="form-group">
                                                <FontAwesomeIcon icon={faUser} /> <label>Username</label>
                                                <input ref={(Username) => this.Username = Username} type="text" className="form-control" id="adminLogin" placeholder="Enter Your Username" required />
                                                
                                            </div>
                                            <div className="form-group">
                                                <FontAwesomeIcon icon={faKey} /> <label>Password</label>
                                                <input ref={(Password) => this.Password = Password} type="password" className="form-control" id="passwordLogin" placeholder="Password" maxLength='16' minLength='6' required />
                                            </div>
                                            {this.renderButtonAdminLogin()}
                                        </form>

                                        <hr />
                                        <p className='mt-3'>Belum Register?  <Link to='/adminRegister'>Register Now!</Link></p>
                                        
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
        } else {
            return <Redirect to='/adminDashboard' />
        }
        
    }

}

const mapStateToProps =  (state) => {
    return {
        loading: state.register.loading,
        error: state.register.error
    }
}

export default connect(mapStateToProps, { adminLogin, cleanError })(AdminLogin);