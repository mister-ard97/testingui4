import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Redirect } from 'react-router-dom';
import {
    getAllUserTransaction,
    getTransactionAdminDetail
} from '../../../redux/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { URL_API } from '../../../helpers/Url_API';

class AdminTransactionList extends Component {
    state = {
        link: null
    }

    componentDidMount() {
        document.title = 'Admin Controller Transaction History User'
        this.props.getAllUserTransaction()
    }

    transactionDetail = (id) => {
        this.props.getTransactionAdminDetail(id)
    }

    componentDidUpdate() {
        if (this.props.transactionDetail.length !== 0) {
            this.setState({
                link: 'GoToPayment'
            })
        }
    }

    renderTransactionHistoryList = () => {
        if (this.props.transactionAllUser) {
            if (this.props.transactionAllUser.length !== 0) {
                return this.props.transactionAllUser.map((val, id) => {
                    return (
                        <tr key={id}>
                            <td>
                                {val.kodeTransaksi}
                            </td>
                            <td>
                                {
                                    val.transactionImage === null ?
                                        'Belum ada bukti pembayaran'
                                        :
                                        <img src={`${URL_API}${val.transactionImage}`} className='img-fluid' style={{ width: '150px' }} alt={`${val.kodeTransaksi}-${val.username}`}/>
                                }
                            </td>
                            <td>
                                {
                                    val.status === 10 ?
                                        <p className='text-secondary'>Menunggu Konfirmasi dari Admin</p>
                                        :
                                        null
                                }
                                {
                                    val.status === 11 ?
                                        <p className='text-danger'>Transaction Di Tolak</p>
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
                                        <p>Status: <span className='text-info'>Menunggu Konfirmasi</span></p>
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
                                    val.status === 4 ?
                                        <p>Status: <span className='text-success'>Product telah diterima oleh user</span></p>
                                        :
                                        null
                                }
                                {
                                    val.status === 8 ?
                                        <p>Status: <span className='text-danger'>User belum menerima product</span></p>
                                        :
                                        null
                                }
                                {
                                    val.status === 9 ?
                                        <p>Status: <span className='text-danger'>Bukti Pemabayaran User Ditolak</span></p>
                                        :
                                        null
                                }
                            </td>
                            <td>
                                {val.username}
                            </td>
                            <td>
                                <button
                                    className='btn btn-info alert alert-info'
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Transaction Detail"
                                    onClick={() => this.transactionDetail(val.id)}
                                >
                                    <FontAwesomeIcon icon={faBookOpen} />
                                </button>
                            </td>
                        </tr>
                    )
                })
            } else {
                return (
                    <tr>
                        <td colSpan='5' className='text-center'>
                            Tidak ada transaksi untuk sekarang
                        </td>
                    </tr>
                )
            }
        }

        return (
            <div className="spinner-border text-warning" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    render() {
        if (this.state.link === 'GoToPayment') {
            return <Redirect to='/adminDashboard/payment' />
        }

        return (
            <div className='container-fluid'>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body d-flex justify-content-between">
                            <table className="table">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col">Transaction Code</th>
                                        <th scope="col">Payment Slip</th>
                                        <th scope='col'>Status</th>
                                        <th scope='col'>User</th>
                                        <th scope='col'>Transaction Detail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.renderTransactionHistoryList()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ transaction }) => {
    return {
        transactionAllUser: transaction.transaction,
        transactionDetail: transaction.transaction_detail
    }
}

export default connect(mapStateToProps, {getAllUserTransaction, getTransactionAdminDetail})(AdminTransactionList);