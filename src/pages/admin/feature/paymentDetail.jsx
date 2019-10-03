import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { UncontrolledCollapse, Button } from 'reactstrap';
import { 
    refusePaymentSlipFromUser, 
    acceptPaymentSlipFromUser,
    sendProductToUser,
    refuseTransactionUser,
    acceptTransactionUser
} from '../../../redux/actions';

var numeral = require('numeral')

class PaymentDetail extends Component {
    state = {
        loading: false 
    }

    componentDidMount() {
        document.title = 'Admin Controller Pembayaran'
        window.scrollTo(0, 0)
        if (this.props.location.search || !this.props.transactionSelected) {
            return <Redirect to='/adminDashboard/transaction' />
        }
    }

    componentWillReceiveProps(newProps) {
        if (this.props.transactionSelected !== newProps.transactionSelected) {
            window.scrollTo(0, 0)
            this.setState({
                loading: false
            })
        }
    }

    acceptTransaction = (id) => {
        this.setState({ loading: true }, () => {
            this.props.acceptTransactionUser(id)
        })
    }

    refuseTransaction = (id) => {
        this.setState({ loading: true }, () => {
            this.props.refuseTransactionUser(id)
        })
    }

    refusePayment = (id) => {
        this.setState({loading: true}, () => {
            this.props.refusePaymentSlipFromUser(id)
        })
    }

    acceptPayment = (id) => {
        this.setState({ loading: true }, () => {
            this.props.acceptPaymentSlipFromUser(id)
        })
    }

    sendProduct = (id) => {
        this.setState({ loading: true }, () => {
            this.props.sendProductToUser(id)
        })
    }

    renderPaymentDetail = () => {
        if (this.props.transactionSelected) {
            if (this.props.transactionSelected.length !== 0) {
                return this.props.transactionSelected.map((val, id) => {
                    return (
                        <div className='card-body' key={id}>
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
                                // Transaction diterima atau approve karena barang sesuai dengan stock yg tersedia dan menunggu user membayar(status 0)
                                // Pembayran di tolak, dan user tidak bisa melanjutkan transactionnya (status 11)
                                
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
                                            <Button className='btn btn-success mb-3 form-control' onClick={() => this.acceptTransaction(val.id)}>
                                                Approve Transaction ini
                                                    </Button>
                                            <Button className='btn btn-danger mb-1 form-control' onClick={() => this.refuseTransaction(val.id)}>
                                                Tolak Transaction ini
                                        </Button>
                                    </div>
                                
                                :
                                null
                            }
                            {
                                val.status === 11 ?
                                    <p className='text-danger'>Transaction dengan kode Transaction: <strong>{val.kodeTransaksi}</strong> telah ditolak oleh Admin</p>
                                    :
                                    null
                            }
                            {
                                val.status === 0 ?
                                    <p>Status: <span className='text-danger'>User Belum Membayar</span></p>
                                    :
                                    null
                            }
                            {
                                val.status === 1 ?
                                    <p>Status: <span className='text-info'>Sudah mengirm bukti pembayaran, tinggal melakukan pengecekan</span></p>
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
                                val.status === 8 ?
                                    <p>Status: <span className='text-danger'>Product tidak sampai ke user. Mohon dicek kembali...</span></p>
                                    :
                                    null
                            }
                            {
                                val.status === 9 ?
                                    <p>Status: <span className='text-danger'>Bukti Pembayaran User Ditolak</span></p>
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
                                val.status === 0 ?
                                    <p className='text-danger'>Menunggu Pembayaran dari User</p>
                                    
                                    : null
                            }
                            {
                                val.status === 1 ?
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
                                                    <Button className='btn btn-success mb-3 form-control' onClick={() => this.acceptPayment(val.id)}>
                                                        Terima Bukti Pembayaran
                                                    </Button>
                                                    <Button className='btn btn-danger mb-1 form-control' onClick={() => this.refusePayment(val.id)}>
                                                        Total Bukti Pembayaran
                                                    </Button>
                                            </div>
                                        }
                                    </div>
                                    :
                                    null
                            }
                            {
                                // Status 2
                                val.status === 2 ?
                                    <div>
                                        {
                                            this.state.loading ?
                                                <button className='btn btn-success form-control mb-3' disabled>
                                                    <div className="spinner-border" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </button>
                                                :
                                                <Button className='btn btn-success mb-3 form-control' onClick={() => this.sendProduct(val.id)}>
                                                    Kirim Product Ke Alamat User
                                                </Button>
                                        }
                                    </div>
                                :
                                null
                            }

                            {
                                // Status 3
                                val.status === 3 ?
                                <p className='text-secondary'>Product telah dikirim ke alamat user, menunggu konfirmasi barang</p>
                                :
                                null
                            }

                            {
                                val.status === 4 ?
                                <p className='text-success'>Product telah diterima oleh user</p>
                                :
                                null
                            }

                            {
                                val.status === 8 ?
                                <div>
                                    {
                                        this.state.loading ?
                                            <button className='btn btn-success form-control mb-3' disabled>
                                                <div className="spinner-border" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                            </button>
                                            :
                                            <Button className='btn btn-success mb-3 form-control' onClick={() => this.sendProduct(val.id)}>
                                                Kirim Ulang Product Ke Alamat User
                                            </Button>
                                    }
                                </div>
                                :
                                null
                            }
                            {
                                val.status === 9 ?
                                    <p className='text-danger'>Pembayaran telah ditolak, menunggu user untuk mengirim bukti pembayaran</p>
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

                return <Redirect to='/adminDashboard/transaction' />
            }

        }
    }

    render() {
        return (
            <div className='container-fluid'>
                <div className='row py-3'>
                    <div className="offset-2 col-8 py-3">
                        <Link to='/adminDashboard/transaction'>
                            Back To All Transaction List
                                        </Link>
                        <div className="card px-3">
                            {this.renderPaymentDetail()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({transaction}) => {
    return {
        transactionSelected: transaction.transaction_selected,
        transactionDetail: transaction.transaction_detail
    }
}

export default connect(mapStateToProps, {
    refusePaymentSlipFromUser,
    acceptPaymentSlipFromUser,
    sendProductToUser,
    refuseTransactionUser,
    acceptTransactionUser
})(PaymentDetail);