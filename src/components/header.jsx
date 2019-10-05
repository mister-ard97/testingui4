import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';

class Header extends Component {
    state = {
        isOpen: false,
        logOut: false
    }

    componentDidMount() {
    }

    userLogOut = () => {
        // this.props.userLogOut();
        this.props.cleanErrorSuccess()
        // this.setState({
        //     logOut: true
        // })
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        // if (this.state.searchLinks) {
        //     return <Redirect to= {`/searchproduct?${this.state.searchLinks}`} />
        // }

        // if(this.state.logOut) {
        //     return <Redirect to={`/`} />
        // }

        return (
            <div className='sticky-top'>
                {
                    this.state.logOut ?
                        <Redirect to={`/`} />
                        :
                        null
                }
                
                <Navbar id='Header' expand="lg" className='bg-info'>
                    <div className='container'>
                        <NavbarToggler onClick={this.toggle} />

                        <Collapse id="CollapseMaCommerce" isOpen={this.state.isOpen} navbar className='link-white'>
                            <div className='container'>
                                <Link to='/' className='navbar-brand justify-content-start d-none d-lg-flex'>
                                    Testing<span>Ui</span>
                                </Link>
                            </div>
                        
                        </Collapse>
                    </div>
                </Navbar>
            </div>
        )
    }
}

export default Header;