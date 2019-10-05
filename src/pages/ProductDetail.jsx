import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import Slider from 'react-slick';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { UncontrolledCollapse, CardBody, Card } from 'reactstrap';
import ScrollspyNav from 'react-scrollspy-nav';


import {
    userAddProduct
} from '../redux/actions'
import { URL_API } from '../helpers/Url_API';
import ModalMaCommerce from '../components/modal';

var numeral = require('numeral')

class ProductDetail extends Component {
    state = {
        modalConfirmation: '', 
        modalWishlist: '',
        userWishlist: 0,
        productDetail: null,
        imageProductDetail: null,
        loadingProduct: null,
        loadingComment: null,
        loadingReply: false,
        stockQty: null,
        stockSelected: '',
        error: '',
        errorComment: '',
        commentProduct: null,
        replyCommentProduct: null,
        showButtonReply: false,
        commentSelected: null,
        errorReplyComment: null,
        rowsTextArea: 1
    }

    componentDidMount() {
        document.title = 'Product Detail'
        window.scrollTo(0, 0);

        let parsedQuery = queryString.parse(this.props.location.search)

        this.setState({loadingProduct: true})

        const token = localStorage.getItem('token');
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }

        Axios.get(URL_API + '/user/userWishlistProduct/' + parsedQuery.productId,  options)
            .then((res) => {
                this.setState({ userWishlist: res.data.wishlistUser })
            })
            .catch((err) => {
                console.log(err)
            })

        this.getProductDetail(parsedQuery.productId)
    }

    getProductDetail = (id) => {
        Axios.get(URL_API + '/productMaCommerce/productDetail/' + id)
            .then((res) => {
                this.setState({
                    productDetail: res.data.dataProductDetail,
                    imageProductDetail: res.data.linkImageProduct,
                    loadingProduct: false
                })
                Axios.get(URL_API + '/productMaCommerce/commentProduct/' + id)
                .then((res) => {
                   this.setState({
                       commentProduct: res.data.dataComment,
                       replyCommentProduct: res.data.dataReply
                   })
                })
                .catch((err) => {
                    console.log(err)
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    ToWishlist = (id) => {
        const token = localStorage.getItem('token');
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }

        Axios.post(URL_API + '/user/userToggleWishlist/' + id, {}, options)
        .then((res) => {
            console.log(res.data.wishlistUser)
            this.getProductDetail(id)
            this.setState({ userWishlist: res.data.wishlistUser, modalWishlist: true, loadingProduct: true })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    addedToWishlist = (id) => {
        this.ToWishlist(id)
    } 

    removeFromWishlist = (id) => {
        this.ToWishlist(id)
    }

    addUserComment = () => {
        if(this.props.role !== '') {
            this.setState({ loadingComment: true })
            if (this.Comment.value !== '') {
                this.setState({
                    errorComment: ''
                })

                let parsedQuery = queryString.parse(this.props.location.search)

                const token = localStorage.getItem('token');
                const options = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                }

                let dataComment = {
                    productId: Number(parsedQuery.productId),
                    comment: this.Comment.value
                }

                Axios.post(URL_API + '/user/userComment', { dataComment }, options)
                    .then((res) => {
                        console.log(res.data.commentResults)
                        console.log(res.data)
                        this.setState({
                            loadingComment: false,
                            commentProduct: res.data.dataComment,
                            replyCommentProduct: res.data.dataReply
                        })
                        this.Comment.value = ''
                    })
                    .catch((err) => {
                        console.log(err)
                    })

            } else {
                this.setState({
                    errorComment: 'Kolom pertanyaan tidak boleh dikirim kosong. Harap isi terlebih dahulu',
                    loadingComment: false
                })
            }
        } 
       
    }

    btnReplyComment = (id) => {
        console.log(this.replyComment.value)
        if(this.replyComment.value !== '') {
            this.setState({ loadingReply: true, errorReplyComment: '' })
            
            let parsedQuery = queryString.parse(this.props.location.search)

            const token = localStorage.getItem('token');
            const options = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }

            let dataReply = {
                productId: Number(parsedQuery.productId),
                comment: this.replyComment.value,
                commentId: id
            }

            console.log(dataReply)

            Axios.post(URL_API + '/user/userReplyComment', { dataReply }, options)
                .then((res) => {
                    this.setState({
                        loadingReply: false,
                        commentProduct: res.data.dataComment,
                        replyCommentProduct: res.data.dataReply
                    })
                    this.replyComment.value = ''
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            this.setState({
                errorReplyComment: 'Harap masukkan minimal 5 karakter untuk membalas pertanyaan'
            })
        }
    }

    renderReplyComment = (dataReply, commentId) => {
        if(dataReply.length !== 0) {
            return dataReply.map((val, id) => {
                if(val.commentId === commentId) {
                    return (
                        <div className='row' key={id}>
                            <div className='col-1'></div>
                            <div className="col-1">
                                <img src={`${URL_API}${val.UserImage}`} alt={`${val.username}-${val.UserImage}`} className='img-fluid rounded-circle' />
                            </div>
                            <div className='col-9'>
                                <p className='font-weight-bold'>{val.username} ({val.role}) - <small>{new Date(val.date_created).toLocaleDateString('id-IND', { dateStyle: 'full', timeStyle: 'medium' }).replace(/[.]/g, ':')}</small></p>
                                <p>{val.comment}</p>
                                <hr />
                            </div>
                        </div>
                    )
                }

                return null
            })
        }
        return null
    }

    clearError = (e) => {
        if(e.target.value !== '') {
            this.setState({
                errorReplyComment: ''
            })
        }
    }

    addedToCart = (productId, productPrice) => {
            
            if (!this.state.stockSelected) {
                console.log(true)
                this.setState({
                    error: 'Harap pilih Size Product yang ingin dibeli'
                })
            } else if (Number(this.stockProduct.value) === 0) {
                console.log(true)
                this.setState({
                    error: 'Harap masukkan jumlah quantity (barang) pada size yang ingin dibeli'
                })
            } else if (Number(this.stockProduct.value) > this.state.stockQty) {
                console.log(true)
                this.setState({
                    error: 'Jangan menginput data stock lebih dari yang tersedia'
                })
            } else {
                let objCart = {
                    productId,
                    price: productPrice,
                    stockSelected: this.state.stockSelected,
                    Qty: Number(this.stockProduct.value)
                }

                this.props.userAddProduct(objCart)
                this.setState({
                    modalConfirmation: true,
                    error: '',
                    stockQty: null,
                    stockSelected: ''
                })
                this.stockProduct.value = ''
            }
    }

    renderCoverProduct = () => {
       if(this.state.productDetail) {
           return this.state.productDetail.map((val, index) => {
                return (
                    <img src={`${URL_API}${val.coverImage}`} alt={'Carousel-' + val.coverImage} className='img-fluid' key={index}/>
                )
           })
       }
    }

    renderImageProduct = () => {
        if(this.state.imageProductDetail) {
            return this.state.imageProductDetail.map((val2, index2) => {
                return <img src={`${URL_API}${val2.imagePath}`} alt={'Carousel-' + val2.imagePath} className='img-fluid' key={index2} />
            })
        }
    }

    protectString = (e) => {
        if (e.keyCode === 69 || e.keyCode === 189) {
            e.preventDefault();
        }
    }

    renderDetailProduct = () => {
        if(this.state.productDetail) {
            return this.state.productDetail.map((val, index) => {
                return (
                    <div key={index} className='ml-5 col-12 col-md-6 mt-3'>
                        <small>
                            <Link to={`/searchproduct?product=${val.category_name}`}>
                                {val.category_name}
                            </Link> >  
                            <Link to={`/searchproduct?product=${val.category_name}&subCategoryId=${val.id_sub_category}`}>
                                 {val.sub_category_name}
                            </Link> >
                             {val.name}
                            </small>
                        <hr/>
                        {
                            this.state.error ?
                                <div className='alert alert-danger font-weight-bold'>
                                    {this.state.error}
                                </div>
                                : 
                                null
                        }
                        <h3>{val.name}</h3>
                        
                        <p>
                            <FontAwesomeIcon icon={faHeart} className='text-danger' /> {val.popularCount}
                        </p>
                        {
                            this.props.username !== '' ?
                                this.state.userWishlist === 0 ?
                                    <button className='badge badge-danger btn' onClick={() => this.addedToWishlist(val.id)}>
                                        <FontAwesomeIcon icon={faHeart} className='text-warning' /> Added to Your Wishlist
                                    </button>
                                    :
                                    <button className='badge badge-info btn' onClick={() => this.removeFromWishlist(val.id)}>
                                        <FontAwesomeIcon icon={faHeart} className='white' /> Remove From Wishlist
                                    </button>
                                :
                                null
                        }
                        <hr />
                        <h4 className='text-danger'>Rp. {numeral(val.price).format(0,0)}</h4>
                        <hr />
                        <h5>Size Product</h5>
                        <div className='d-flex'>
                            {
                                val.small !== 0 ?
                                    <button className='btn btn-secondary alert alert-info mr-3' onClick={() => this.setState({stockQty: val.small, stockSelected: 'small' })}>S</button>
                                    :
                                    <button className='btn btn-secondary alert alert-info mr-3' disabled>S</button>
                            }
                            {
                                val.medium !== 0 ?
                                    <button className='btn btn-secondary alert alert-info mr-3' onClick={() => this.setState({ stockQty: val.medium, stockSelected: 'medium'})}>M</button>
                                    :
                                    <button className='btn btn-secondary alert alert-info mr-3' disabled>M</button>
                            }
                            {
                                val.large !== 0 ?
                                    <button className='btn btn-secondary alert alert-info mr-3' onClick={() => this.setState({ stockQty: val.large, stockSelected: 'large' })}>L</button>
                                    :
                                    <button className='btn btn-secondary alert alert-info mr-3' disabled>L</button>
                            }
                            {
                                val.xlarge !== 0 ?
                                    <button className='btn btn-secondary alert alert-info mr-3' onClick={() => this.setState({ stockQty: val.xlarge, stockSelected: 'xlarge' })}>XL</button>
                                    :
                                    <button className='btn btn-secondary alert alert-info mr-3' disabled>XL</button>
                            }
                        </div>
                        <hr />
                        <p>Stock Condition: Size: {this.state.stockSelected} {
                            !this.state.stockQty ?
                            null
                            :
                            this.state.stockQty> 9 ?
                                <span className='text-danger'>Available {this.state.stockQty} Stocks</span>
                            :
                                <span className='text-danger'>Available {this.state.stockQty} Stock</span>
                        } </p>

                        <div className='col-6 m-0 p-0'>
                            <input type="number" min='0' max={this.state.stockQty} className='form-control' ref={(stockProduct) => { this.stockProduct = stockProduct} } onKeyDown={(e) => this.protectString(e)}/>
                        </div>
                        <hr />
                        <button className='alert alert-info' id="togglerDescription" style={{ marginBottom: '1rem' }}>
                            Show Description
                        </button>
                        <UncontrolledCollapse toggler="#togglerDescription">
                            <Card>
                                <CardBody>
                                    {val.description}
                                </CardBody>
                            </Card>
                        </UncontrolledCollapse>
                        <hr />
                        {
                            this.props.username === '' ?
                            <span>Mau Belanja? Login dulu yuuk... <Link to='/login'>Klik disini yah untuk login</Link> </span>
                            :
                            <button className='btn btn-warning' onClick={() => this.addedToCart(val.id, val.price)}>Added To Cart</button>
                        }
                       
                    </div>
                )
            })
        }
    }

    renderModalConfirmation = (params) => {
        if (params) {
            return (
                <ModalMaCommerce
                    idModal='modalConfirmation'
                    className='modal-md'
                    modal={this.state.modalConfirmation}
                    toggle={this.toggle}
                    ModalHeader={'Added To Cart'}
                    ModalBody={
                        'Product telah dimasukkan kedalam Cart'
                    }
                    buttonClickName={'Oke'}
                    colorOnClick="success"
                    onClickModal={
                        () => this.setState({modalConfirmation: false}, () => {
                            window.scrollTo(0,0)
                        })
                    }
                />
            )
        }
    }

    renderModalWishlist = (params) => {
        if(params) {
            return (
                <ModalMaCommerce
                    idModal='modalWishlist'
                    className='modal-md'
                    modal={this.state.modalWishlist}
                    toggle={this.toggle}
                    ModalHeader={
                        this.state.userWishlist !== 0 ?
                        'Added To Your Wishlist'
                        :
                        'Remove From Your Wishlist'
                    }
                    ModalBody={
                        this.state.userWishlist !== 0 ?
                            'Product telah dimasukkan kedalam daftar Wishlist'
                            :
                            'Product telah dihapus dalam daftar Wishlist'
                    }
                    buttonClickName={'Oke'}
                    colorOnClick="success"
                    onClickModal={() => this.setState({ modalWishlist: false })}
                />
            )
        }
    }

    renderCommentProduct = () => {
        if(this.state.commentProduct) {
            if(this.state.commentProduct.length !== 0) {
               return this.state.commentProduct.map((val, id) => {
                   if(val.commentId === null) {
                       return (
                           <div className='card mt-3'>
                               <div className='card-body'>
                                   <div className='row'>
                                       <div className="col-1">
                                           <img src={`${URL_API}${val.UserImage}`} alt={`${val.username}-${val.UserImage}`} className='img-fluid rounded-circle' />
                                       </div>
                                       <div className='col-9'>
                                           <p className='font-weight-bold'>{val.username} ({val.role}) - <small>{new Date(val.date_created).toLocaleDateString('id-IND', { dateStyle: 'full', timeStyle: 'medium' }).replace(/[.]/g, ':')}</small></p>
                                           <p>{val.comment}</p>
                                       </div>
                                       <div className='col-2'>
                                           {/* {
                                           val.wishlistUser === val.userId ?
                                               <small>User ini me-Wishlist product ini</small>
                                               :
                                               <small>User ini tidak menambahkan product ini ke daftar Wishlistnya.</small>
                                       } */}
                                           {/* {
                                           this.props.username === val.username ?
                                               <p>Edit Pertanyaan Ini</p>
                                               :
                                               null
                                       } */}
                                       </div>
                                   </div>
                                   <hr />
                                    {
                                        this.renderReplyComment(this.state.replyCommentProduct, val.id)
                                    }
                                   {
                                       this.props.username ?
                                       
                                           <div className='row'>
                                               <div className='col-1'></div>
                                               <div className='col-1'>
                                                   <img src={`${URL_API}${this.props.UserImage}`} alt={`${this.props.username}-${this.props.UserImage}`} className='img-fluid rounded-circle' />
                                               </div>
                                               <div className='col-10'>
                                                   
                                                   {
                                                       this.props.username ?
                                                           <div>
                                                               {
                                                                  console.log(val.commentId)
                                                               }
                                                               {
                                                                   this.state.commentSelected === val.id ?
                                                                       this.state.errorReplyComment ?
                                                                           <div className='alert alert-danger'>
                                                                               {this.state.errorReplyComment}
                                                                           </div>
                                                                           :
                                                                           null
                                                                       :
                                                                       null
                                                               }
                                                               
                                                               <textarea
                                                                   className='form-control'
                                                                   placeholder='Balas Pertanyaan ini'
                                                                   rows={
                                                                       this.state.commentSelected === val.id ?
                                                                           this.state.rowsTextArea : 2
                                                                   }
                                                                   ref={
                                                                       this.state.commentSelected === val.id ?
                                                                           (replyComment) => this.replyComment = replyComment
                                                                           :
                                                                           null
                                                                   }
                                                                   onClick={() => this.setState({ showButtonReply: true, commentSelected: val.id, rowsTextArea: 3 })} onChange={this.clearError} />
                                                               {
                                                                   this.state.commentSelected === val.id ?
                                                                       this.state.loadingReply ?
                                                                           <button className='float-right btn btn-warning mt-3' disabled>
                                                                               <div className="spinner-border text-white" role="status">
                                                                                   <span className="sr-only">Loading...</span>
                                                                               </div>
                                                                           </button>
                                                                           :

                                                                           <button className='float-right btn btn-warning mt-3' onClick={() => this.btnReplyComment(val.id)}>
                                                                               Balas Pertanyaan
                                                                        </button>
                                                                       :
                                                                       null
                                                               }
                                                           </div>
                                                           :
                                                           null
                                                   }
                                               </div>
                                           </div>

                                           :

                                           null
                                   }
                               </div>
                           </div>
                       )
                   }

                   return null
               })
            } else {
                return (
                    <div className='card mt-3 bg-light'>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-12 text-center'>
                                    <p>Kolom pertanyaan untuk product ini kosong</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        } 

        return (
            <p>Loading...</p>
        )
    }

    toggle = () => {
        if(this.state.modalConfirmation) {
            this.setState({
                modalConfirmation: !this.state.modalConfirmation
            })
        }
        if(this.state.modalWishlist) {
            this.setState({
                modalWishlist: !this.state.modalWishlist
            })
        }
         
    }

    render() {
        var settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
        };

        // if(this.props.loading) {
        //     return (
        //        <div>
        //             <Header statusPage='ProductDetail' />
        //                 <div className='container'>
        //                     <div className='row'>
        //                        <div className="col-12 text-center">
        //                             <div className="spinner-border text-warning" role="status">
        //                                 <span className="sr-only">Loading...</span>
        //                             </div>
        //                        </div>
        //                     </div>
        //                 </div>
        //             <Footer />
        //        </div>
        //     )
        // }
           
        return (
            <div>
              
                <div className='container mt-3'>
                    {this.renderModalConfirmation(this.state.modalConfirmation)}
                    {this.renderModalWishlist(this.state.modalWishlist)}
                    <div className='row'>
                        <div className="col-12 col-md-3">
                            <Slider {...settings}>
                                {this.renderCoverProduct()}
                                {this.renderImageProduct()}
                            </Slider>
                        </div>
                        {this.renderDetailProduct()}
                       
                        {
                            !this.state.loadingProduct ?
                                <div className='col-12 col-md-10 mt-3'>
                                    <hr />
                                    <h5>Komentar mengenai Product</h5>

                                    <div className='card mt-3'>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className="col-10">
                                                    Ingin menulis pertanyaan mengenai product ini?
                                        </div>
                                                <div className='col-2 font-weight-bold'>
                                                    <ScrollspyNav
                                                        scrollTargetIds={
                                                            ["kolomAskProduct"]
                                                        }
                                                        scrollDuration="1000"
                                                        headerBackground="false"
                                                    >
                                                        <a className='btn btn-warning' href='#kolomAskProduct' >
                                                            Tulis pertanyaan
                                                </a>
                                                    </ScrollspyNav>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {this.renderCommentProduct()}

                                </div>

                                :

                                null
                        }
                    </div>

                   {
                       !this.state.loadingProduct ?
                            <div id='kolomAskProduct' className='row'>
                                <div className="col-10">
                                    <div className='card mt-5'>

                                        <div className='card-body'>
                                            {
                                                this.state.errorComment ?
                                                    <div className='alert alert-danger'>
                                                        {this.state.errorComment}
                                                    </div>
                                                    :
                                                    null
                                            }
                                            <textarea ref={(Comment) => this.Comment = Comment} className='form-control' placeholder='Apa yang ingin anda tanyakan mengenai produk ini? (maks 500 huruf)' maxLength='500'></textarea>
                                            {
                                                this.state.loadingComment ?
                                                    <button className='float-right btn btn-success mt-3' disabled>
                                                        <div className="spinner-border text-white" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </div>
                                                    </button>
                                                    :

                                                    this.props.role !== '' ?

                                                        <button className='float-right btn btn-success mt-3' onClick={this.addUserComment}>
                                                            Kirim Pertanyaan
                                                        </button>
                                                        :
                                                        <Link className='float-right btn btn-success mt-3' to='/login'>
                                                            Kirim Pertanyaan
                                                        </Link>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            :

                            null
                   }
                    
                </div>
            </div>
        )
    }
}


const mapStateToProps = ({ register }) => {
    return {
        UserImage: register.UserImage,
        username: register.username,
        loading: register.loading,
        role: register.role
    }
}

export default connect(mapStateToProps, { userAddProduct })(ProductDetail);