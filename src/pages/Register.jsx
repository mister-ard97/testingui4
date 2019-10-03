import React, { Component } from 'react';
import { checkBg } from '../helpers/stylefunction';
import { CustomInput } from 'reactstrap';

import { connect } from 'react-redux';
import { onUserRegister, cleanError } from '../redux/actions';

import { Redirect, Link } from 'react-router-dom';

class Register extends Component {
    state = {
        UserImageName: 'Select Image',
        UserImageFile: 'http://localhost:2002/defaultPhoto/defaultUser.png',
        UserImageDB: undefined,
        NextPage: false
    }

    componentDidMount() {
        document.title = 'Register Page'
        window.scrollTo(0, 0);
        // checkBg('RegisterPage', 'bg-light');
        this.props.cleanError();
    }

    handleSubmitRegister = (e) => {
        e.preventDefault();

        let objUserReg = {
            username: this.Username.value,
            password: this.Password.value,
            confPassword: this.ConfPassword.value,
            FirstName: this.FirstName.value,
            LastName: this.LastName.value,
            email: this.Email.value,
            address: this.Address.value,
            UserImage: this.state.UserImageDB
        }

        this.props.onUserRegister(objUserReg);
    }

    addUserImageChange = (e) => {
        console.log(e.target.files)
        if(e.target.files[0]) {
            this.setState({ 
                UserImageFile: URL.createObjectURL(e.target.files[0]), 
                UserImageName: e.target.files[0].name,
                UserImageDB: e.target.files[0]
            })
        } else {
            this.setState({ 
                UserImageName: 'Select Image', 
                UserImageFile: 'http://localhost:2002/defaultPhoto/defaultUser.png' ,
                UserImageDB: undefined
            })
        }
    }

    renderErrorForm = () => {
        if(this.props.error.length > 0) {
            return (
                <div className="alert alert-danger" role="alert">
                    {window.scrollTo(0, 0)}
                    {this.props.error}
                </div>
            )
        }
    }

    renderButtonRegister = () => {
        if(this.props.loading) {
            return (
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            )
        }

        return <button type="submit" className="btn btn-primary form-control">Register</button>
    }

    render() {
        if(this.props.NextPage) {
            return <Redirect to='/waitingverification' />
        }
      if(this.props.token === '') {
          return (
              <div id='RegisterPage' >
                  <div className='container py-1'>
                      <div className='row py-1'>
                          <div className="offset-2 offset-md-3 col-8 col-md-6 py-3">
                              <div className='py-3 text-center'>
                                  <Link to='/' className='navbar-brand text-dark'>
                                      <span>Ma</span>Commerce
                                 </Link>
                              </div>
                              <div className="card px-3">
                                  <div className="card-body">
                                      <h5 className="card-title mb-3">Register Page</h5>
                                      {this.renderErrorForm()}
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
                                          <label>Profie Picture</label>
                                          <div className='form-group'>
                                              <img src={`${this.state.UserImageFile}`} alt="user-default" className='userImage my-3' />
                                              <CustomInput id='up_i_u' type='file' label={this.state.UserImageName} onChange={this.addUserImageChange} />
                                          </div>
                                          {this.renderButtonRegister()}
                                      </form>

                                      <hr />
                                      <p className='mt-3'>Sudah Punya Akun?  <Link to='/login'>Login Now!</Link></p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          )
      } else {
          return <Redirect to='/' />
      }

    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.register.loading,
        error: state.register.error,
        token: state.register.token,
        NextPage: state.register.NextPage
    }
}

export default connect(mapStateToProps, { onUserRegister, cleanError })(Register);