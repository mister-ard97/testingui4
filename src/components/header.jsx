import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { userLogOut, adminGetCategoryProduct, cleanTransaction, cleanDetailAndSelectedTransaction, cleanErrorSuccess } from '../redux/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { URL_API } from '../helpers/Url_API'

var numeral = require('numeral')

class Header extends Component {
    state = {
        isOpen: false,
        login: false,
        loadingLogin: '',
        logOut: false
    }

    componentDidMount() {
        // if(this.props.statusPage !== 'Home') {
        //     document.getElementById('Header').classList.add('bg-light')
        //     document.getElementById('CollapseMaCommerce').classList.remove('link-white')
        //     document.getElementById('CollapseMaCommerce').classList.add('link-dark')
        // }
        // window.addEventListener('scroll', this.navbarBgChangeWhenScroll);
        this.props.adminGetCategoryProduct();
    }

    // navbarBgChangeWhenScroll = () => {
    //     if(document.getElementById('Header')) {
    //         if (this.props.statusPage === 'Home') {
    //             if (window.scrollY >= 10) {
    //                 document.getElementById('Header').classList.add('bg-light')
    //                 document.getElementById('CollapseMaCommerce').classList.remove('link-white')
    //                 document.getElementById('CollapseMaCommerce').classList.add('link-dark')
    //             } else {
    //                 document.getElementById('Header').classList.remove('bg-light')
    //                 document.getElementById('CollapseMaCommerce').classList.add('link-white')
    //             }
    //         } else {
    //             document.getElementById('Header').classList.add('bg-light')
    //             document.getElementById('CollapseMaCommerce').classList.remove('link-white')
    //         }
    //     } else {
    //         return null;
    //     }
    // }

    userLogOut = () => {
        this.props.userLogOut();
        this.props.cleanTransaction()
        this.props.cleanDetailAndSelectedTransaction()
        this.props.cleanErrorSuccess()
        this.setState({
            logOut: true
        })
    }

    renderCart = () => {
        if(this.props.cart) {
            if (this.props.cart.length !== 0) {
                return this.props.cart.map((val, index) => {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{val.productName}</td>
                            <td>
                                {val.small !== 0 ? `S` : null}
                                {val.medium !== 0 ? ` M` : null}
                                {val.large !== 0 ? ` L` : null}
                                {val.xlarge !== 0 ? ` XL` : null}
                            </td>
                            <td className='d-flex'>
                                {val.small !== 0 ? `Size S: ${val.small}` : null}&nbsp;
                                {val.medium !== 0 ? ` Size M: ${val.medium}` : null}&nbsp;
                                {val.large !== 0 ? ` Size L: ${val.large}` : null}&nbsp;
                                {val.xlarge !== 0 ? ` Size XL: ${val.xlarge}` : null}&nbsp;                                                                                       
                            </td>
                            <td>Rp. {numeral(val.total_price).format(0,0)}</td>
                        </tr>
                    )
                })
            } else {
                return (
                    <tr>
                        <td colSpan='5' className='text-center'>Data Cart Kosong</td>
                    </tr>
                )
            }
        }
        
    }

    renderCartAccount = (param) => {
        return (
            <div className='navbar-nav-cust d-flex font-weight-normal'>
                <UncontrolledDropdown nav inNavbar className='mr-2'>
                    <DropdownToggle nav caret>
                        <FontAwesomeIcon icon={faShoppingCart} className={param}/> <span>Cart ({this.props.cartCount})</span>
                    </DropdownToggle>
                    <DropdownMenu right={true} className='px-2'>
                        <table border='1'>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama Product</th>
                                    <th>Size</th>
                                    <th>Qty</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderCart()}
                            </tbody>
                        </table>
                        <DropdownItem divider />
                        <Link to='/cart' className='btn btn-warning'>Go To Cart Page</Link>
                    </DropdownMenu>
                </UncontrolledDropdown>

                        <UncontrolledDropdown nav inNavbar>                            
                            {
                                this.props.loading ?

                                <DropdownToggle nav caret >
                                        <div className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                </DropdownToggle>
                                :
                                    <DropdownToggle nav caret>
                                        {
                                            this.props.loginChecked ?
                                                <div style={{width: 40}}>
                                                    <img src={`${URL_API}${this.props.UserImage}`} alt={'User' + this.props.name} className='img-fluid' style={{borderRadius: 40}}/>
                                                </div>
                                                :
                                                <div className='bg-warning font-weight-bold rounded px-1'>
                                                    <span className='text-dark mr-2'>Login</span>
                                                    <FontAwesomeIcon icon={faUserCircle} className={param} />
                                                </div>

                                        }

                                    </DropdownToggle>
                            }
                            <DropdownMenu right={true} className='px-2 userDropdown' id='loginDropdown'>
                                {
                                    this.props.name !== '' ?
                                        
                                        this.props.justRegister ?
                                            <div>
                                                {
                                                    this.props.status === 'Unverified' ?
                                                    <p className='text-danger'>Anda belum verifikasi email <Link to='/waitingverification'> Klik Untuk Verification </Link></p>
                                                    :
                                                    null
                                                }
                                                <p>Selamat Bergabung di MaCommerce, {this.props.name}</p>
                                                <Link to='/' onClick={this.userLogOut}> Log Out </Link>
                                               
                                            </div>
                                        :
                                            <div>
                                                {
                                                    this.props.status === 'Unverified' ?
                                                        <p className='text-danger'>Anda belum verifikasi email <Link to='/waitingverification'> Klik Untuk Verification </Link></p>
                                                        :
                                                        null
                                                }
                                                <p>Selamat Datang Kembali, {this.props.name}</p>
                                                <Link to='/' onClick={this.userLogOut}> Log Out </Link>
                                            </div>
                                    :
                                        <div>
                                            <p>Anda belum login silahkan login <Link to='/login'>disini</Link></p>
                                            <p>Anda belum mendaftar? <Link to='/register'>Daftar</Link> Sekarang</p>
                                        </div>
                                }
                            </DropdownMenu>
                        </UncontrolledDropdown>
            </div>
        )
    }

    renderCategory = () => {
        console.log(this.props.categoryProduct)
        if(this.props.categoryProduct) {
            return this.props.categoryProduct.map((val, id) => {
                return (
                    <a href={`/searchproduct?product=${val.name}&page=1`} className='dropdown-item text-dark' key={id}>
                        {val.name}
                    </a>
                )
            })
        }
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
                {/* navbar-light font-weight-bold */}
                <Navbar id='Header' expand="lg" className='bg-secondary'>
                    <div className='container'>
                        <NavbarToggler onClick={this.toggle} />

                        {/* Untuk Small Device  */}
                        <Link to='/' className='navbar-brand mx-auto justify-content-start d-flex d-lg-none'>
                            Testing<span>Ui</span>
                        </Link>

                        <Collapse id="CollapseMaCommerce" isOpen={this.state.isOpen} navbar className='link-white'>
                            {/* <Nav className="mr-auto navbar-nav-cust" navbar>
                                <UncontrolledDropdown nav inNavbar className='mr-4'>
                                
                                       
                                        <DropdownToggle nav caret>
                                            Categories
                                        </DropdownToggle>
                                        <DropdownMenu left='true' onBlur={this.state.isOpen}>
                                            <a href={`/searchproduct?allproduct=true&page=1`} className='dropdown-item text-dark'>
                                                All Product
                                            </a>
                                            {this.renderCategory()}
                                        </DropdownMenu>
                                    
                                </UncontrolledDropdown>
                               
                            </Nav> */}
                            <div className='container'>
                                <Link to='/' className='navbar-brand justify-content-start d-none d-lg-flex'>
                                    Testing<span>Ui</span>
                                </Link>
                            </div>
                            {/* Untuk Large Device */}
                            <Nav navbar className='d-flex'>
                                {this.renderCartAccount('text-black-50')}
                            </Nav>
                        </Collapse>
                    </div>
                </Navbar>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        name: state.register.name,
        email: state.register.email,
        justRegister: state.register.justRegister,
        UserImage: state.register.UserImage,
        status: state.register.status,
        loginChecked: state.register.loginChecked,
        loading: state.register.loading,

        // category
        categoryProduct: state.admin.categoryProduct,
        subCatPro: state.admin.subCategoryProduct,
        loadingAdmin: state.admin.loading,
        error: state.admin.error,

        //cart
        cart: state.cart.cart,
        cartCount: state.cart.cartCount
    }
}

export default connect(mapStateToProps, { 
    adminGetCategoryProduct, 
    userLogOut, 
    cleanTransaction, 
    cleanDetailAndSelectedTransaction, 
    cleanErrorSuccess})(Header)