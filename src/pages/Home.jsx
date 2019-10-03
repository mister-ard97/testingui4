import React, { Component } from 'react';
import { connect } from 'react-redux';

import Carousel from '../components/carousel';
import PopularProduct from '../components/popularproduct';
import { checkBg } from '../helpers/stylefunction';
import {showCart} from '../redux/actions'

class Home extends Component {
    componentDidMount() {
        document.title = 'MaCommerce Online Shop'
        window.scrollTo(0, 0);
       
        this.props.showCart()
        console.log('Jalan')
    }

    render() {
        return (
            <div>
                {/* {
                    this.props.username !== '' ?
                        <Header statusPage='UserLogin' />
                        : 
                        null
                }

                {
                    this.props.username === '' ?
                    <Header statusPage='Home' />
                    :
                    null
                } */}
               
                
                    {/* // this.props.loading ? 
                    //    <div className='container-fluid'>
                    //        <div className="row">
                    //            <div className="col-12 text-center">
                    //                 <div className="spinner-border" role="status">
                    //                     <span className="sr-only">Loading...</span>
                    //                 </div>
                    //            </div>
                    //        </div>
                    //    </div>
                    // : */}
                    <div>
                            <Carousel />
                            <PopularProduct />
                            <div className='container pt-5'>
                                <h2 className='my-3 pl-2 text-center text-center'>
                                   About MaCommerce
                                </h2>
                                <hr/>
                                <h5>MaCommerce Online Shop</h5>
                                <div className='text-justify'>
                                    <p>MaCommerce merupakan situs jual beli online di Indonesia yang menjual berbagai macam produk untuk memenuhi kebutuhan Anda. Belanja online terasa semakin mudah dan menyenangkan saat ini karena apapun yang Anda inginkan pasti bisa ditemukan di MaCommerce. Cek barang kesukaanmu, belanja kado terindah untuk si dia, beli berbagai kebutuhan rumah tangga, beli gadget terbaru yang sedang tren, belanja pakaian yang sudah kamu idamkan, sampai dengan bayar tagihan listrik setiap bulan, semua bisa kamu lakukan hanya dengan sekali klik.</p>
                                    <p>Selain berbelanja, MaCommerce memungkinkan penggunanya untuk membuka berbagai macam toko online. Karena saat ini, MaCommerce sudah berhasil merangkul jutaan pelaku usaha/individu untuk membangun usahanya sendiri. Tidak hanya memberikan yang terbaik untuk pembeli, MaCommerce juga menawarkan pengalaman jualan online yang mudah dan praktis. Sebagai salah satu platform jual beli online di Indonesia, MaCommerce sangat ingin memajukan perekonomian bangsa dengan membuka peluang usaha bagi para entrepreneur. Karena itu, bagi Anda yang ingin memulai usaha, mulailah bersama MaCommerce. Anda akan merasakan kenyamanan memiliki toko online terbaik hanya di MaCommerce.</p>
                                </div>
                            </div>
                    </div>

                
            </div>
        )
    }
}

const mapStateToProps = ({register, admin}) => {
    return {
        loading: register.loading,
        username: register.username,
        FirstName: register.FirstName,
        role: register.role,
    }
}

export default connect(mapStateToProps, {showCart})(Home);