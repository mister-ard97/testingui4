import React, { Component }  from 'react'
import {Link, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import { userLogOut } from '../redux/actions'

class UserPage extends Component {
    state = {
        logOut: false
    }

    userLogOut = () => {
        this.props.userLogOut()
        this.setState({
            logOut: true
        })
    }

    render() {
        return (
            <div>
                {
                    this.state.logOut ?
                    <Redirect to='/' />
                    :
                    null
                }
                <button onClick={this.userLogOut}>
                    Log Out
                </button>
            </div>
        )
    }
}

const mapStateToProps = ({register}) => {
    return {

    }
}

export default connect(mapStateToProps, {userLogOut})(UserPage);