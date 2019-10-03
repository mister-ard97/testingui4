import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { UncontrolledCollapse, Button } from 'reactstrap';
import { sendPaymentSlipToAdmin, confirmProductToAdmin, sendNotificationToAdmin} from '../redux/actions';

import { URL_API } from '../helpers/Url_API';
import { CustomInput } from 'reactstrap';
import Axios from 'axios';

var numeral = require('numeral')

class PaymentPage extends Component {
    state = {
        paymentImageFile: `${URL_API}/defaultPhoto/defaultCategory.png`,
        paymentImageName: 'Select Image',
        paymentImageDB: undefined,

        errorState: '',
        successState: '',

        tokenMidtrans: '',
        clientKeyMidtrans: ''
    }

    // Midtrans Snap Coba Coba
    getTokenForSnapMidTrans = (totalPrice) => {
        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.post(`${URL_API}/transaction/simple_checkout_with_midtrans` , {total_price:  totalPrice} , options)
        .then((res) => {
          window.snap.pay(res.data.token, {
              
          })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    componentDidMount() {
        document.title = 'Pembayaran User'
        window.scrollTo(0,0)
        this.setState({
            paymentImageFile: `${URL_API}/defaultPhoto/defaultCategory.png`,
            paymentImageName: 'Select Image',
            paymentImageDB: undefined,

            errorState: '',
            successState: '',
        })

        console.log(this.state.clientKeyMidtrans);
        console.log(this.state.tokenMidtrans)

        if (this.props.location.search || !this.props.transactionUserSelected) {
            return <Redirect to='/' />
        }
    }

    paymentImageChange = (e) => {
        if (e.target.files[0]) {
            this.setState({
                paymentImageFile: URL.createObjectURL(e.target.files[0]),
                paymentImageName: e.target.files[0].name,
                paymentImageDB: e.target.files[0]
            })
        } else {
            this.setState({
                paymentImageFile: `${URL_API}/defaultPhoto/defaultCategory.png`,
                paymentImageName: 'Select Image',
                paymentImageDB: undefined,
            })
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.transactionUserSelected !== newProps.transactionUserSelected) {
            window.scrollTo(0,0)
            this.setState({
                loading: false
            })
        }
    }


    sendPaymentSlip = (id) => {
        if (!this.state.paymentImageDB) {
            this.setState({
                errorState: 'Harap Masukkan Bukti Pembayaran'
            })
        } else {
            this.setState({ loading: true, errorState: '', successState: '' }, () => {
                this.props.sendPaymentSlipToAdmin(id, this.state.paymentImageDB)
            })
            this.setState({
                successState: 'Success Kirim Bukti Pembayaran',
            })
        }
    }

    confirmProduct = (id) => {
        this.setState({ loading: true, errorState: '', successState: '' }, () => {
            this.props.confirmProductToAdmin(id, this.state.paymentImageDB)
        })
        this.setState({
            successState: 'Terima Kasih Telah Berbelanja di Toko Kami.',
        })
    }

    sendNotificationToAdmin = (id) => {
        this.setState({ loading: true, errorState: '', successState: '' }, () => {
            this.props.sendNotificationToAdmin(id, this.state.paymentImageDB)
        })
        this.setState({
            successState: 'Kirim Notifikasi mengenai keberadaan product berhasil, mohon untuk bersabar hingga admin mengirim ulang produk anda. Terima kasih',
        })
    }

    renderTransactionHistory = () => {
        if (this.props.transactionUserSelected) {
            if (this.props.transactionUserSelected.length !== 0) {
                return this.props.transactionUserSelected.map((val, id) => {
                    return (
                        <div className='card-body' key={id}>
                            {
                                this.state.errorState ?
                                    <div className="alert alert-danger" role="alert">
                                        {this.state.errorState}
                                    </div>
                                    :
                                    null
                            }
                            {
                                this.state.successState ?
                                    <div className="alert alert-success" role="alert">
                                        {this.state.successState}
                                    </div>
                                    :
                                    null
                            }
                            <div className='font-weight-bold text-center'>
                                <h5>
                                    Payment For User {val.username}
                                </h5>
                                <p>Payment Code: {val.kodeTransaksi}</p>
                                
                            </div>
                            <p>Nomor Rekening MaCommerce: 1234567890</p>
                            <div className='text-center'>
                                <h6 className='font-weight-bold'>Send Product To</h6>
                                <p>{val.firstName} {val.lastName}</p>
                                <p>Address: {val.addressUser}</p>
                            </div>
                            {
                                val.status === 10 ?
                                    <p className='text-secondary'>Waiting for Transaction Checking</p>
                                    :
                                    null
                            }
                            {
                                val.status === 0 ?
                                    <p>Status: <span className='text-danger'>Belum Membayar</span></p>
                                    : 
                                    null
                            }

                            {
                                val.status === 1 ?
                                    <p>Status: <span className='text-info'>Menunggu Konfirmasi dari Admin</span></p>
                                    :
                                    null
                            }
                            {
                                val.status === 2 ?
                                    <p>Status: <span className='text-success'>Pembayaran telah dikonfirmasi, menunggu Produk dikirim</span></p>
                                    :
                                    null
                            }
                            {
                                val.status === 3 ?
                                    <p>Status: <span className='text-secondary'>Produk telah dikirim, menunggu konfirmasi dari penerima produk</span></p>
                                    :
                                    null
                            }
                            {
                                val.status === 9 ?
                                    <p>Status: <span className='text-danger'>Bukti Pembayaran Anda Di Tolak, Silahkan kirim lagi bukti pembayaran.</span></p>
                                    :
                                    null
                            }
                            <Button className='btn btn-warning mb-1' id={`transactionUser-${val.id}`}>
                               Transaction Detail
                            </Button>
                            <UncontrolledCollapse toggler={`#transactionUser-${val.id}`}>
                                <table className="table">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th scope="col">Product Name</th>
                                            <th scope="col">Size</th>
                                            <th scope='col'>Qty</th>
                                            <th scope='col'>Total Qty</th>
                                            <th scope='col'>Total Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.transactionDetail.map((val2, id2) => {
                                                return (
                                                    <tr key={id2}>
                                                        <td>
                                                            {val2.productName}
                                                        </td>
                                                        <td>
                                                            {val2.small !== 0 ? `S` : null}
                                                            {val2.medium !== 0 ? ` M` : null}
                                                            {val2.large !== 0 ? ` L` : null}
                                                            {val2.xlarge !== 0 ? ` XL` : null}
                                                        </td>
                                                        <td>
                                                            {val2.small !== 0 ? `Size S: ${val2.small}` : null}
                                                            {val2.medium !== 0 ? ` Size M: ${val2.medium}` : null}
                                                            {val2.large !== 0 ? ` Size L: ${val2.large}` : null}
                                                            {val2.xlarge !== 0 ? ` Size XL: ${val2.xlarge}` : null}
                                                        </td>
                                                        <td>
                                                            {val2.small + val2.medium + val2.large + val2.xlarge}
                                                        </td>
                                                        <td>
                                                            Rp. {numeral(val2.total_price).format(0,0)}
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </UncontrolledCollapse>
                            <div className='my-3 d-block'>
                                <h4>Total Biaya</h4>
                                <h5>Rp. {numeral(val.total_price).format(0,0)}</h5>
                            </div>
                            {
                                val.status === 10 ?
                                    <p className='text-secondary'>Menunggu Admin Mengkonfirmasi Transaction dan Stock Product</p>
                                    :
                                    null
                            }

                            {
                                val.status === 11 ?
                                    <p className='text-danger'>Mohon maaf Transaction dengan Kode Transaction: <strong>{val.kodeTransaksi}</strong> Telah ditolak oleh admin. (Ada beberapa kemungkinan antara product stock telah abis atau transaction ini dianggap spam). </p>
                                :
                                null
                            }
                            
                            {
                                val.status === 0 ?

                                    <div>
                                        <p className='text-success mb-3'>Transaction berhasil di approve oleh admin. Silahkan untuk mengirim bukti pembayaran</p>
                                        {/* Total Pembayaran */}
                                        {
                                            /* 
                                            <CustomInput id='psend_a' type='file' label={this.state.paymentImageName} onChange={this.paymentImageChange} />
                                            <img src={`${this.state.paymentImageFile}`} alt="payment-user" className='userImage my-3' />
                                            {
                                                this.state.loading ?
                                                    <button className='btn btn-success form-control my-3' disabled>
                                                        <div className="spinner-border" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </button>
                                                    :
                                                    <button className='btn btn-success form-control my-3' onClick={() => this.sendPaymentSlip(val.id)}>
                                                        Kirim Bukti Pembayaran
                                                    </button>
                                            }
                                            
                                            */
                                        }
                                        <input type="text" className='form-control' disabled value={val.total_price}/>
                                        <input type="button" onClick={() => this.getTokenForSnapMidTrans(val.total_price)}/>
                                    </div>
                                    : null
                            }
                            {
                                val.status === 1 ?
                                    <p className='text-secondary'>Menunggu konfirmasi dari Admin</p>
                                    :
                                    null
                            }
                            {
                                val.status === 2 ?
                                    <p className='text-success'>Pembayaran telah dikonfirmasi oleh admin</p>
                                    :
                                    null
                            }
                            {
                                val.status === 3 ?
                                    <div>
                                        {
                                            this.state.loading ?
                                                <div>
                                                    <button className='btn btn-success form-control mb-3' disabled>
                                                        <div className="spinner-border" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </button>
                                                    <button className='btn btn-danger form-control mb-1' disabled>
                                                        <div className="spinner-border" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </button>
                                                </div>
                                                :
                                                <div>
                                                    <Button className='btn btn-success mb-3 form-control' onClick={() => this.confirmProduct(val.id)}>
                                                        Barang telah sampai dan diterima.
                                                    </Button>
                                                    <Button className='btn btn-danger mb-1 form-control' onClick={() => this.sendNotificationToAdmin(val.id)}>
                                                        Saya belum menerima barangnya.
                                                    </Button>
                                                </div>
                                        }
                                    </div>
                                : 
                                null
                            }
                            {
                                val.status === 4 ?
                                    <p className='text-success'>Product telah diterima</p>
                                    :
                                    null
                            }
                            {
                                val.status === 8 ?
                                <p className='text-secondary'>Menunggu admin mengecek data dan mengirim ulang product</p>
                                :
                                null
                            }
                            {
                                val.status === 9 ?
                                    <div>

                                        <CustomInput id='psend_a' type='file' label={this.state.paymentImageName} onChange={this.paymentImageChange} />
                                        <img src={`${this.state.paymentImageFile}`} alt="payment-user" className='userImage my-3' />
                                        {
                                            this.state.loading ?
                                                <button className='btn btn-success form-control my-3' disabled>
                                                    <div className="spinner-border" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </button>
                                                :
                                                <button className='btn btn-success form-control my-3' onClick={() => this.sendPaymentSlip(val.id)}>
                                                    Kirim Ulang Bukti Pembayaran
                                                </button>
                                        }
                                    </div>
                                    : null
                            }
                            <small>
                                Date Created: {new Date(val.date_created).toLocaleDateString('id-IND', { dateStyle: 'full', timeStyle: 'medium' }).replace(/[.]/g, ':')}
                            </small>
                            <p><small>Note: Jika direfresh anda akan kembali ke halaman home, namun data transaksi telah tersimpan di menu transaksi user</small></p>
                        </div>
                    )
                })
            } else {
                
                return <Redirect to='/' />
            }
            
        }
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
                            <div className='container py-3'>
                                <div className='row py-3'>
                                    <div className="offset-2 col-8 py-3">
                                        <Link to='/transaction_list'>
                                            Back To Transaction List
                                        </Link>
                                        <div className="card px-3">
                                            {this.renderTransactionHistory()}
                                        </div>
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

const mapStateToProps = ({ transaction, register }) => {
    return {
        role: register.role,
        loading: register.loading,
        auth: register.authChecked,
        transactionUserSelected: transaction.transaction_selected,
        transactionDetail: transaction.transaction_detail
    }
}

export default connect(mapStateToProps, { sendPaymentSlipToAdmin, confirmProductToAdmin, sendNotificationToAdmin})(PaymentPage);

