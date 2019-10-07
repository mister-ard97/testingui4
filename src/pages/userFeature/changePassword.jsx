import React from 'react'
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Axios from 'axios'
import { URL_API } from '../helpers/Url_API';


class ChangePassword extends React.Component{
    state = {
        onsuccess : false,
        loadingButton : false
    }
 

    onChangePasswordClick = () =>{
      
        if(this.NewPassword.value === this.ConfNewPassword.value){
            this.setState({
                loadingButton : true
            })
            console.log('function change pw')
            const token = localStorage.getItem('token');
    
            let options = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
    
            Axios.post(`${URL_API}/user/changeUserPassword` , {
                email : this.props.email,
                oldpw : this.OldPassword.value,
                newpw : this.NewPassword.value
            } , options)
            .then((res) => {
                this.setState({
                    onsuccess : true,
                    loadingButton : false
                })
                window.alert('reset password success')
            })
            .catch((err) => {
                this.setState({
                    loadingButton : false
                })
            })
        }
        
    }
    render(){
        return(
            <div id='changePassword'>
            <div className='container py-1'>
                <div className='row py-1'>
                    <div className="offset-2 offset-md-3 col-8 col-md-6 py-3">
                        <div className='py-3 text-center navbar-brand text-dark pr-3' >
                            Change Password
                        </div>
                            <div className="card p-3 font-weight-bold text-center">
                                <div className="form-group mb-5">
                                    <label>Old Password</label>
                                    <input ref={(OldPassword) => this.OldPassword = OldPassword} type="password" className="form-control" id="oldPassword" placeholder="Enter Old Password" />
                                </div>
                                <div className="form-group mb-2">
                                    <label>New Password</label>
                                    <input ref={(NewPassword) => this.NewPassword = NewPassword} type="password" className="form-control" id="newPassword" placeholder="Enter New Password" />
                                </div>
                                <div className="form-group mb-2">
                                    <label>Confirm New Password</label>
                                    <input ref={(ConfNewPassword) => this.ConfNewPassword = ConfNewPassword} type="password" className="form-control" id="confNewPassword" placeholder="Confirmation New Password" />
                                </div>

                                
                                {
                                    this.state.loadingButton
                                     ?
                                        <button className='form-control btn btn-success'  disabled>
                                            <div className="spinner-border text-white" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </button>
                                    :
                                        <button className='form-control btn btn-success' onClick={this.onChangePasswordClick}>Change Password</button>
                                }

                            </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

const mapStateToProps = ({register}) => {
    return {
        email : register.email
    }
}

export default connect(mapStateToProps, null)(ChangePassword);