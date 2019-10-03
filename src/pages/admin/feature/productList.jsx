import React, { Component } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import queryString from 'query-string'
import { CustomInput, UncontrolledCollapse, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt, faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { 
    getProduct,
    getFilteredProduct,
    adminAddProduct,
    adminEditProduct,
    adminDeleteProduct,
    cleanErrorSuccess
} from '../../../redux/actions';
import ModalMaCommerce from '../../../components/modal';
import { URL_API } from '../../../helpers/Url_API';

var numeral = require('numeral');

class ProductList extends Component {
    state = {
        modalAddProduct: false,
        modalDetailProduct: false,
        modalEditProduct: false,
        modalDeleteProduct: false,

        categoryProductSelectedInProduct: null,
        categoryProductNameSelectedInProduct: '',
        subCategoryProductSelectedInProduct: null,
        subCategoryProductNameSelectedInProduct: '',
        
        searchCategoryProductSelectedInProduct: null,
        searchCategoryProductNameSelectedInProduct: '',
        searchSubCategoryProductSelectedInProduct: null,
        searchSubCategoryProductNameSelectedInProduct: '',

        editCategoryProductSelectedInProduct: null,
        editCategoryProductNameSelectedInProduct: '',
        editSubCategoryProductNameSelectedInProduct: '',
        editSubCategoryProductSelectedInProduct: null,

        productCoverImageFile: `${URL_API}/defaultPhoto/defaultCategory.png`,
        productImage1File: `${URL_API}/defaultPhoto/defaultCategory.png`,
        productImage2File: `${URL_API}/defaultPhoto/defaultCategory.png`,

        productCoverImageName: `Select Cover Image`,
        productImage1Name: `Select Product Image`,
        productImage2Name: `Select Product Image`,

        productCoverImageDB: undefined,
        productImage1DB: undefined,
        productImage2DB: undefined,

        errorStateProduct: '',
        successStateProduct: '',
        successStateGetProduct: '',
        productFiltered: false,

        productDetail: [],
        imageProductDetail: [],
        detailProductSelected: null,
        
    }

    componentDidMount() {
        document.title = 'Admin Controller List Product'
        this.props.cleanErrorSuccess();
        
        if(this.props.location.search) {
            let parsedQuery = queryString.parse(this.props.location.search)
            console.log(parsedQuery)
        
            if(parsedQuery.allproduct) {
                    this.getAllProduct(parsedQuery.page)
            }

            if(parsedQuery.productFilter) {
                let objQueryFilteredProduct = {
                    productName: parsedQuery.productName,
                    categoryId: parsedQuery.categoryId,
                    subCategoryId: parsedQuery.subCategoryId,
                    page: parsedQuery.page
                }

                this.props.getFilteredProduct(objQueryFilteredProduct)

            }
            
        }
    }

    componentWillReceiveProps(newProps) {
        // this.props.cleanErrorSuccess();

        if (this.props.location.search !== newProps.location.search) {
            let parsedQuery = queryString.parse(newProps.location.search)
            console.log(parsedQuery)

            if (parsedQuery.allproduct) {
                this.getAllProduct(parsedQuery.page)
            }

            if (parsedQuery.productFilter) {
                let objQueryFilteredProduct = {
                    productName: parsedQuery.productName,
                    categoryId: parsedQuery.categoryId,
                    subCategoryId: parsedQuery.subCategoryId,
                    page: parsedQuery.page
                }

                this.props.getFilteredProduct(objQueryFilteredProduct)

            }

        }
    }

    componentDidUpdate() {
       if(this.props.success) {
           this.props.cleanErrorSuccess() 
       }
    }

    backToTopModal = (params, params2) => {
       if(params) {
           if (document.getElementById('modalHeader')) {
               document.getElementById('modalHeader').scrollIntoView(true)
           } else {
               return null
           }
       }

       if(this.state.modalAddProduct) {
           
           if (params2) {
               this.setState({
                   successStateProduct: 'Product berhasil ditambahkan',
                   modalAddProduct: !this.state.modalAddProduct,
                   
                   productCoverImageFile: `${URL_API}/defaultPhoto/defaultCategory.png`,
                   productImage1File: `${URL_API}/defaultPhoto/defaultCategory.png`,
                   productImage2File: `${URL_API}/defaultPhoto/defaultCategory.png`,

                   productCoverImageName: `Select Cover Image`,
                   productImage1Name: `Select Product Image`,
                   productImage2Name: `Select Product Image`,

                   productCoverImageDB: undefined,
                   productImage1DB: undefined,
                   productImage2DB: undefined
               })
           }
        } else if (this.state.modalEditProduct) {
            if (params2) {
                this.setState({
                    successStateProduct: 'Product berhasil diupdate',
                    modalEditProduct: !this.state.modalEditProduct,
                    detailProductSelected: null
                })
            }
        } else if(this.state.modalDeleteProduct) {
           if(params2) {
               this.setState({
                   successStateProduct: 'Product berhasil dihapus',
                   modalDeleteProduct: !this.state.modalDeleteProduct,
                   detailProductSelected: null
               })
           }
        }

       return null
    }

    productImageCoverChange = (e) => {
        if(e.target.files[0]) {
            this.setState({
                productCoverImageFile: URL.createObjectURL(e.target.files[0]),
                productCoverImageName: e.target.files[0].name,
                productCoverImageDB: e.target.files[0]
            })
        } else {
            this.setState({
                productCoverImageFile: `${URL_API}/defaultPhoto/defaultCategory.png`,
                productCoverImageName: `Select Cover Image`,
                productCoverImageDB: undefined
            })
        }
    }

    productImage1Change = (e) => {
        if(e.target.files[0]) {
            this.setState({
                productImage1File: URL.createObjectURL(e.target.files[0]),
                productImage1Name: e.target.files[0].name,
                productImage1DB: e.target.files[0]
            })
        } else {
            this.setState({
                productImage1File: `${URL_API}/defaultPhoto/defaultCategory.png`,
                productImage1Name: `Select Product Image`,
                productImage1DB: undefined
            })
        }
    }

    productImage2Change = (e) => {
        if (e.target.files[0]) {
            this.setState({
                productImage2File: URL.createObjectURL(e.target.files[0]),
                productImage2Name: e.target.files[0].name,
                productImage2DB: e.target.files[0]
            })
        } else {
            this.setState({
                productImage2File: `${URL_API}/defaultPhoto/defaultCategory.png`,
                productImage2Name: `Select Product Image`,
                productImage2DB: undefined
            })
        }
    }

    selectedCategoryInProduct = () => {
        let categoryProduct = document.getElementById('categoryInProduct')
        let selectedOptions = categoryProduct.options[categoryProduct.selectedIndex]
        this.setState({
            categoryProductSelectedInProduct: parseInt(selectedOptions.value),
            categoryProductNameSelectedInProduct: selectedOptions.innerHTML,
            subCategoryProductNameSelectedInProduct: '',
            subCategoryProductSelectedInProduct: null
        })
    }

    selectedSubCategoryInProduct = () => {
        let subCategoryProduct = document.getElementById('subCategoryInProduct')
        let selectedOptions = subCategoryProduct.options[subCategoryProduct.selectedIndex]
        this.setState({
            subCategoryProductSelectedInProduct: parseInt(selectedOptions.value),
            subCategoryProductNameSelectedInProduct: selectedOptions.innerHTML
        })
    }

    selectedEditCategoryInProduct = () => {
        let categoryProduct = document.getElementById('editCategoryInProduct')
        let selectedOptions = categoryProduct.options[categoryProduct.selectedIndex]
        this.setState({
            editCategoryProductSelectedInProduct: parseInt(selectedOptions.value),
            editCategoryProductNameSelectedInProduct: selectedOptions.innerHTML,
            editSubCategoryProductNameSelectedInProduct: '',
            editSubCategoryProductSelectedInProduct: null
        })
    }

    selectedEditSubCategoryInProduct = () => {
        let subCategoryProduct = document.getElementById('editSubCategoryInProduct')
        let selectedOptions = subCategoryProduct.options[subCategoryProduct.selectedIndex]
        this.setState({
            editSubCategoryProductNameSelectedInProduct: parseInt(selectedOptions.value),
            editSubCategoryProductSelectedInProduct: selectedOptions.innerHTML
        })
    }

    selectedSearchCategoryInProduct = () => {
        let searchCategoryProduct = document.getElementById('searchCategoryInProduct')
        let searchSelectedOptions = searchCategoryProduct.options[searchCategoryProduct.selectedIndex]
        this.setState({
            searchCategoryProductSelectedInProduct: parseInt(searchSelectedOptions.value),
            searchCategoryProductNameSelectedInProduct: searchSelectedOptions.innerHTML,
            
            searchSubCategoryProductSelectedInProduct: null,
            searchSubCategoryProductNameSelectedInProduct: '',
        })
    }

    selectedSearchSubCategoryInProduct = () => {
        let searchSubCategoryProduct = document.getElementById('searchSubCategoryInProduct')
        let searchSubSelectedOptions = searchSubCategoryProduct.options[searchSubCategoryProduct.selectedIndex]
        this.setState({
            searchSubCategoryProductSelectedInProduct: parseInt(searchSubSelectedOptions.value),
            searchSubCategoryProductNameSelectedInProduct: searchSubSelectedOptions.innerHTML
        })
    }

    renderCategoryProduct = () => {

        return this.props.categoryProduct.map((val, index) =>
            <option
                key={index}
                value={val.id} >
                {val.name}
            </option>
        )
    }

    renderCategoryProductDetail = (id) => {
        return this.props.categoryProduct.map((val, index) => {
            if (val.id === id) {
                return (
                    <option
                        key={index}
                        value={val.id} >
                        {val.name}
                    </option>
                )
            }

            return null
        })
    }

    renderSubCategoryProduct = (id) => {
        return this.props.subCatPro.map((val, index) => {
            if (val.parentId === id) {
                return (
                    <option
                        key={index}
                        value={parseInt(val.idsubcategory)} >
                        {val.subcategory}
                    </option>
                )
            }
            return null
        })
    }
    renderSubCategoryProductDetail = (id) => {
        return this.props.subCatPro.map((val, index) => {
            if (val.idsubcategory === id) {
                return (
                    <option
                        key={index}
                        value={parseInt(val.idsubcategory)} >
                        {val.subcategory}
                    </option>
                )
            }
            return null
        })
    }

    checkInput = (e) => {
        if (e.keyCode === 189) {
            e.preventDefault();
        }
    }

    // Product Function

    getAllProduct = (page) => {
        this.setState({ productFiltered: false })
        this.props.history.push(`productlist?allproduct=true&page=${page}`)
        if(this.props.page === page ) {
            return null
        } else {
            this.props.getProduct(page);
            this.setState({
                successStateGetProduct: 'Pencarian Product berhasil dengan seacrh by: "All Product"',
                successStateProduct: ''
            })
        }

        
    }

    getProductByFilter = (page) => {
        this.setState({productFiltered: true})
        let objFilteredProduct = {
            productName: this.filterProductName.value ? this.filterProductName.value : 'undefined',
            categoryId: this.state.searchCategoryProductSelectedInProduct,
            categoryName: this.state.searchCategoryProductNameSelectedInProduct,
            subCategoryId: this.state.searchSubCategoryProductSelectedInProduct,
            subCategoryName: this.state.searchSubCategoryProductNameSelectedInProduct,
            page
        }
        let { productName, categoryId, subCategoryId} = objFilteredProduct

        this.props.history.push(`productlist?productName=${productName}&categoryId=${categoryId}&subCategoryId=${subCategoryId}&page=${page}`)
        
        this.props.getFilteredProduct(objFilteredProduct)

        if(this.props.error !== '') {
            this.setState({
                errorStateProduct: this.props.error,
                successStateGetProduct: '',
                successStateProduct: ''
            })
        } 

        if(this.props.success !== '') {
            this.setState({
                successStateGetProduct: `Pencarian Product berhasil dengan search by: Categories`,
                errorStateProduct: '',
                successStateProduct: ''
            })
        }
        
    }

    detailProductById = (params) => {
        if(params) {
            Axios.get(URL_API + '/productMaCommerce/productDetail/' + params)
            .then((res) => {
                this.setState({
                    productDetail: res.data.dataProductDetail,
                    imageProductDetail: res.data.linkImageProduct,
                    modalDetailProduct: true
                })
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    editProductDetail = (id) => {
        if(id) {
            Axios.get(URL_API + '/productMaCommerce/productDetail/' + id)
            .then((res) => {

                this.setState({
                    productDetail: res.data.dataProductDetail,
                    imageProductDetail: res.data.linkImageProduct,
                    productCoverImageFile: URL_API + '/' + res.data.dataProductDetail[0].coverImage,
                    productImage1File: URL_API + res.data.linkImageProduct[0].imagePath,
                    productImage2File: URL_API + res.data.linkImageProduct[1].imagePath,
                    productCoverImageDB: res.data.dataProductDetail[0].coverImage,
                    productImage1DB: res.data.linkImageProduct[0].imagePath,
                    productImage2DB: res.data.linkImageProduct[1].imagePath,
                    detailProductSelected: id,
                    modalEditProduct: true
                })
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    getDeleteProductItem = (id) => {
        if (id) {
            Axios.get(URL_API + '/productMaCommerce/productDetail/' + id)
                .then((res) => {

                    this.setState({
                        productDetail: res.data.dataProductDetail,
                        detailProductSelected: id,
                        modalDeleteProduct: true
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    renderPagination = () => {
        let pageNumbers = []
        if(this.props.total_pages > 0) {
            for(let i = 1; i <= this.props.total_pages; i++) {
                pageNumbers.push(i)
            }
        }

        if(pageNumbers.length > 0) {
            let jsx = pageNumbers.map((number, index) => {
                let activePage = this.props.page === number ? 'active' : '';

                if(number === 1 || number === this.props.total_pages ||( number >= this.props.page - 2 && number <= this.props.page + 2 )) {
                    return (
                        <li key={index} className={'cursorPointer page-item ' + activePage } onClick={
                            this.state.productFiltered ?

                            () => this.getProductByFilter(number)
                            :
                            () => this.getAllProduct(number)
                            
                        }><span className="page-link">{number}</span></li>
                    )
                } else {
                    return null
                }
            })
            return jsx
        } else {
            return null
        }
        
    }

    renderProductList = () => {
        if(this.props.productList.length !== 0) {
            return this.props.productList.map((val, index) => {
                return (
                    <tr key={index}>
                        <td>{val.name}</td>
                        <td>
                            <Button color='primary' id={`togglerCoverImage` + val.productId}>
                                Show Image
                        </Button>
                            <UncontrolledCollapse toggler={`#togglerCoverImage` + val.productId}>
                                <img src={`${URL_API}${val.coverImage}`} alt={`${val.name}-product`} style={{ width: '150px' }} className='mt-1 rounded' />
                            </UncontrolledCollapse>
                        </td>
                        <td>
                            Rp. {numeral(val.price).format(0,0)}
                        </td>
                        <td>
                            {val.popularCount}
                        </td>
                        <td>
                            <button
                                className='btn btn-info alert alert-info'
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Detail Product"
                                onClick={() => this.detailProductById(val.productId)}
                            >
                                <FontAwesomeIcon icon={faBookOpen} />
                            </button>
                        </td>
                        <td>
                            <button
                                className='btn btn-success alert alert-success'
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Edit Product"
                                onClick={() => this.editProductDetail(val.productId)}
                            >
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                        </td>
                        <td>
                            <button
                                className='btn btn-danger alert alert-danger'
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Delete Button"
                                onClick={() => this.getDeleteProductItem(val.productId)}
                            >
                                <FontAwesomeIcon icon={faTrashAlt} />
                            </button>
                        </td>
                    </tr>
                )
            })
        } 
    }

    handleAddProduct = (e) => {
        e.preventDefault();
        
        let objAddProduct = {
            productName: this.ProductName.value,
            productCategory: this.state.categoryProductSelectedInProduct,
            productSubCategory: this.state.subCategoryProductSelectedInProduct,
            sizeS: Number(this.SizeS.value),
            sizeM: Number(this.SizeM.value),
            sizeL: Number(this.SizeL.value),
            sizeXL: Number(this.SizeXL.value),
            productPrice: Number(this.ProductPrice.value),
            productDescription: this.DescriptionProduct.value,
            productCoverImageDB: this.state.productCoverImageDB,
            productImage1DB: this.state.productImage1DB,
            productImage2DB: this.state.productImage2DB,
            categoryName: this.state.categoryProductNameSelectedInProduct,
            subCategoryName: this.state.subCategoryProductNameSelectedInProduct
        }

        this.props.adminAddProduct(objAddProduct)
        this.props.history.push(`productlist?addProduct=success`)
        
        this.setState({
            productCoverImageFile: `${URL_API}/defaultPhoto/defaultCategory.png`,
            productImage1File: `${URL_API}/defaultPhoto/defaultCategory.png`,
            productImage2File: `${URL_API}/defaultPhoto/defaultCategory.png`,
            productCoverImageDB: undefined,
            productImage1DB: undefined,
            productImage2DB: undefined
        })
    }

    handleEditProduct = (e) => {
        e.preventDefault();

        let objEditProduct = {
            productName: this.ProductName.value,
            productCategory: this.state.editCategoryProductSelectedInProduct,
            productSubCategory: this.state.editSubCategoryProductNameSelectedInProduct,
            sizeS: Number(this.SizeS.value),
            sizeM: Number(this.SizeM.value),
            sizeL: Number(this.SizeL.value),
            sizeXL: Number(this.SizeXL.value),
            productPrice: Number(this.ProductPrice.value),
            productDescription: this.DescriptionProduct.value,
            productCoverImageDB: this.state.productCoverImageDB,
            productImage1DB: this.state.productImage1DB,
            productImage2DB: this.state.productImage2DB,
            categoryName: this.state.editCategoryProductNameSelectedInProduct,
            subCategoryName: this.state.editSubCategoryProductNameSelectedInProduct,
            popularCount: Number(this.PopularCount.value)
        }

        this.props.adminEditProduct(objEditProduct, this.state.detailProductSelected)
    }

    renderModalAddProduct = (params) => {
        if(params) {
            return (
                <ModalMaCommerce 
                    idModal='modalProduct'
                    className='modal-lg'
                    modal={this.state.modalAddProduct}
                    toggle={this.toggle}
                    succesMessage={this.props.success}
                    errorMessage={this.props.error}
                    ModalHeader={'Add New Product'}
                    ModalBody={
                       this.renderFormAddProduct()
                    }
                    loading={this.props.loading}
                    buttonClickName={'Add New Product'}
                    colorOnClick="success"
                    onClickModal={this.handleAddProduct}
                    cancelButton="Cancel"
                />
            )
        }
    }

    renderModalDetailProduct = (params) => {
        if(params) {
            return (
                <ModalMaCommerce
                    idModal='modalProduct'
                    className='modal-lg'
                    modal={this.state.modalDetailProduct}
                    toggle={this.toggle}
                    ModalHeader={'Detail Product'}
                    ModalBody={
                        this.renderDetailProduct()
                    }
                    cancelButton="Close"
                />
            )
        }
    }

    renderModalEditProduct = (params) => {
        if(params) {
             return (
                <ModalMaCommerce
                    idModal='modalProduct'
                    className='modal-lg'
                    modal={this.state.modalEditProduct}
                    toggle={this.toggle}
                     succesMessage={this.props.success}
                     errorMessage={this.props.error}
                    ModalHeader={'Edit Product'}
                    ModalBody={
                        this.renderFormEditProduct()
                    }
                     loading={this.props.loading}
                     buttonClickName={'Edit Product'}
                     colorOnClick="success"
                     onClickModal={this.handleEditProduct}
                     cancelButton="Cancel"
                />
            )
        }
    }

    renderModalDeleteProduct = (params) => {
        if(params) {
            return (
                <ModalMaCommerce
                    idModal='modalProduct'
                    className='modal-lg'
                    modal={this.state.modalDeleteProduct}
                    toggle={this.toggle}
                    succesMessage={this.props.success}
                    errorMessage={this.props.error}
                    ModalHeader={'Delete Product'}
                    ModalBody={
                        this.renderDeleteProduct()
                    }
                    loading={this.props.loading}
                    buttonClickName={'Delete Product'}
                    colorOnClick="warning"
                    onClickModal={() => this.props.adminDeleteProduct(this.state.detailProductSelected)}
                    cancelButton="Cancel"
                />
            )
        }
    }

    renderFormAddProduct = () => {
        return (
            <form onSubmit={this.handleAddProduct} id='formAddProduct'>
                {this.backToTopModal(this.props.error, this.props.success)}
                <h4 className='text-info'>Product Image</h4>
                <div className='d-flex font-weight-bold mb-3 addNewProduct'>
                    <div>
                        <p>Product Cover Image</p>
                        <img src={`${this.state.productCoverImageFile}`}
                            className='userImage rounded'
                            alt='cover_product'
                        />
                        <CustomInput 
                        id='addc_p' 
                        type='file' 
                        label={`${this.state.productCoverImageName}`} 
                        className='mt-3' 
                        onChange={this.productImageCoverChange}
                        /> 
                    </div>   
                    <div>
                        <p>Product Image 1</p>
                        <img src={`${this.state.productImage1File}`}
                            className='userImage rounded'
                            alt='cover_product'
                        />
                        <CustomInput 
                            id='add_pi1' 
                            type='file' 
                            label={`${this.state.productImage1Name}`} 
                            className='mt-3' 
                            onChange={this.productImage1Change}
                        />
                    </div>   
                    <div>
                        <p>Product Image 2</p>
                        <img src={`${this.state.productImage2File}`}
                            className='userImage rounded'
                            alt='cover_product'
                        />
                        <CustomInput 
                            id='add_pi2' 
                            type='file' 
                            label={`${this.state.productImage2Name}`} 
                            className='mt-3' 
                            onChange={this.productImage2Change}
                        />
                    </div>          
                </div>
                <hr/>
                <div className='container'>
                   <div className="row">
                        <div className="col-10 offset-1 font-weight-bold">
                            <h4 className='text-info'>Product Detail</h4>
                            <p>Product Name</p>
                            <input ref={(ProductName) => { this.ProductName = ProductName }} type="text" className="form-control" placeholder="Product Name" />

                            <div className="form-row my-3">
                                <div className="col">
                                    <label>Category Parent</label>
                                    <select id="categoryInProduct" className="form-control mb-3" onChange={this.selectedCategoryInProduct}>
                                        <option value=''>Select Category</option>
                                        {this.renderCategoryProduct()}
                                    </select>
                                </div>
                                <div className="col">
                                    <label>Select Sub Category</label>
                                    {
                                        isNaN(this.state.categoryProductSelectedInProduct) === true ||
                                            this.state.categoryProductSelectedInProduct === null ?

                                            <select id="subCategoryInProduct" className="form-control">
                                                <option value=''>Select Sub Category</option>
                                            </select>

                                            :
                                            <select id="subCategoryInProduct" className="form-control" onChange={this.selectedSubCategoryInProduct}>
                                                <option value=''>Select Sub Category</option>
                                                {this.renderSubCategoryProduct(this.state.categoryProductSelectedInProduct)}
                                            </select>

                                    }
                                </div>
                            </div>

                            <h4 className='text-info'>Stock Product</h4>
                            <div className='form-row mb-3'>
                                <div className="col">
                                    <label>Size S</label>
                                    <input type='number' ref={(SizeS) => { this.SizeS = SizeS }} min="0" className='form-control' onKeyDown={(e) => this.checkInput(e)} placeholder='Size S' />
                                </div>
                                <div className="col">
                                    <label>Size M</label>
                                    <input type='number' ref={(SizeM) => { this.SizeM = SizeM }} min="0" className='form-control' onKeyDown={(e) => this.checkInput(e)} placeholder='Size M' />
                                </div>
                                <div className="col">
                                    <label>Size L</label>
                                    <input type='number' ref={(SizeL) => { this.SizeL = SizeL }} min="0" className='form-control' onKeyDown={(e) => this.checkInput(e)} placeholder='Size L' />
                                </div>
                                <div className="col">
                                    <label>Size XL</label>
                                    <input type='number' ref={(SizeXL) => { this.SizeXL = SizeXL }} min="0" className='form-control' onKeyDown={(e) => this.checkInput(e)} placeholder='Size XL' />
                                </div>
                            </div>
                            <label>Price</label>
                            <input type='number' ref={(ProductPrice) => { this.ProductPrice = ProductPrice }} min="0" className='form-control text-right mb-3' onKeyDown={(e) => this.checkInput(e)} placeholder='Product Price'/>
                            <label>Product Description</label>
                            <textarea ref={(DescriptionProduct) => this.DescriptionProduct = DescriptionProduct} placeholder='Product Description' className='form-control'></textarea>
                       </div>
                   </div>
                   <button type='submit' hidden className='align-items-end'></button>
                </div>
            </form>
        )
    }

    renderDetailProduct = () => {

        return this.state.productDetail.map((val, id) => {
            return (
                <form key={id}>
                    <h4 className='text-info'>Product Image</h4>
                    <div className='d-flex justify-content-around font-weight-bold mb-3 addNewProduct'>
                        <div>
                            <p>Product Cover Image</p>
                            <img src={`${URL_API}/${val.coverImage}`}
                                className='userImage rounded'
                                alt='cover_product'
                            />
                        </div>
                        <div>
                            <p>Product Image 1</p>
                            <img src={`${URL_API}/${this.state.imageProductDetail[0].imagePath}`}
                            className='userImage rounded'
                            alt='cover_product'
                        />
                        </div>
                        <div>
                            <p>Product Image 2</p>
                            <img src={`${URL_API}/${this.state.imageProductDetail[1].imagePath}`}
                            className='userImage rounded'
                            alt='cover_product'
                        />
                        </div>
                    </div>
                    <hr />
                    <div className='container'>
                        <div className="row">
                            <div className="col-10 offset-1 font-weight-bold">
                                <h4 className='text-info'>Product Detail {val.name}</h4>
                                <p>Product Name</p>
                                <input type="text" className="form-control" placeholder="Product Name" value={val.name} disabled />

                                <div className="form-row my-3">
                                    <div className="col">
                                        <label>Category Parent</label>
                                        <select disabled className="form-control mb-3">
                                            {this.renderCategoryProductDetail(val.categoryId)}
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label>Sub Category</label>
                                        {
                                            val.categoryId ?
                                                <select disabled className="form-control">
                                                    {this.renderSubCategoryProductDetail(val.subcategoryId)}
                                                </select>
                                                :

                                                <select disabled className="form-control">
                                                    <option value=''>Select Sub Category</option>
                                                </select>
                                        }
                                    </div>
                                </div>

                                <h4 className='text-info'>Stock Product</h4>
                                <div className='form-row mb-3'>
                                    <div className="col">
                                        <label>Size S</label>
                                        <input type='number' min="0" className='form-control' placeholder='Size S' value={val.small} disabled />
                                    </div>
                                    <div className="col">
                                        <label>Size M</label>
                                        <input type='number' min="0" className='form-control' placeholder='Size M' value={val.medium} disabled />
                                    </div>
                                    <div className="col">
                                        <label>Size L</label>
                                        <input type='number' min="0" className='form-control' placeholder='Size L' value={val.large} disabled />
                                    </div>
                                    <div className="col">
                                        <label>Size XL</label>
                                        <input type='number' min="0" className='form-control' placeholder='Size XL' value={val.xlarge} disabled />
                                    </div>
                                </div>
                                <label>Price (in Rupiah)</label>
                                <input type='number' className='form-control text-right mb-3' placeholder='Product Price' value={val.price} disabled />
                                <label>Product Description</label>
                                <textarea placeholder='Product Description' className='form-control' value={val.description} disabled></textarea>
                                <label>Popular Count</label>
                                <input type='number' min="0" className='form-control' placeholder='Popular Count' value={val.popularCount} disabled />
                            </div>
                        </div>
                        <button type='submit' hidden className='align-items-end'></button>
                    </div>
                </form>
            )
        })
    }

    renderFormEditProduct = () => {
        return this.state.productDetail.map((val, id) => {
            return (
                <form key={id} onSubmit={this.handleEditProduct} id='formEditProduct' onClick={() => this.props.cleanErrorSuccess()}>
                    {this.backToTopModal(this.props.error, this.props.success)}
                    <h4 className='text-info'>Product Image</h4>
                    <div className='d-flex font-weight-bold mb-3 addNewProduct'>
                        <div>
                            <p>Product Cover Image</p>
                            <img src={`${this.state.productCoverImageFile}`}
                                className='userImage rounded'
                                alt='cover_product'
                            />
                            <CustomInput
                                id='edit_p'
                                type='file'
                                label={`${this.state.productCoverImageName}`}
                                className='mt-3'
                                onChange={this.productImageCoverChange}
                            />
                        </div>
                        <div>
                            <p>Product Image 1</p>
                            <img src={`${this.state.productImage1File}`}
                                className='userImage rounded'
                                alt='cover_product'
                            />
                            <CustomInput
                                id='edit_pi1'
                                type='file'
                                label={`${this.state.productImage1Name}`}
                                className='mt-3'
                                onChange={this.productImage1Change}
                            />
                        </div>
                        <div>
                            <p>Product Image 2</p>
                            <img src={`${this.state.productImage2File}`}
                                className='userImage rounded'
                                alt='cover_product'
                            />
                            <CustomInput
                                id='edit_pi2'
                                type='file'
                                label={`${this.state.productImage2Name}`}
                                className='mt-3'
                                onChange={this.productImage2Change}
                            />
                        </div>
                    </div>
                    <hr />
                    <div className='container'>
                        <div className="row">
                            <div className="col-10 offset-1 font-weight-bold">
                                <h4 className='text-info'>Product Detail {val.name}</h4>
                                <p>Product Name</p>
                                <input ref={(ProductName) => { this.ProductName = ProductName }} type="text" className="form-control" placeholder="Product Name" defaultValue={val.name}/>

                                <div className="form-row my-3">
                                    <div className="col">
                                        <label>Category Parent</label>
                                        <br />
                                        <small className='mb-2'>Category Sebelumnya {val.category_name}</small>
                                        <select id="editCategoryInProduct" className="form-control mb-3 mt-2" onChange={this.selectedEditCategoryInProduct}>
                                            <option value=''>Select Category</option>
                                            {this.renderCategoryProduct()}
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label>Select Sub Category</label>
                                        <br />
                                        <small>Sub Category Sebelumnya {val.sub_category_name}</small>
                                        {
                                            isNaN(this.state.editCategoryProductSelectedInProduct) === true ||
                                                this.state.editCategoryProductSelectedInProduct === null ?

                                                <select id="editSubCategoryInProduct" className="form-control mt-2">
                                                    <option value=''>Select Sub Category</option>
                                                </select>

                                                :
                                                <select id="editSubCategoryInProduct" className="form-control" onChange={this.selectedEditSubCategoryInProduct}>
                                                    <option value=''>Select Sub Category</option>
                                                    {this.renderSubCategoryProduct(this.state.editCategoryProductSelectedInProduct)}
                                                </select>

                                        }
                                    </div>
                                </div>

                                <h4 className='text-info'>Stock Product</h4>
                                <div className='form-row mb-3'>
                                    <div className="col">
                                        <label>Size S</label>
                                        <input type='number' ref={(SizeS) => { this.SizeS = SizeS }} min="0" className='form-control' onKeyDown={(e) => this.checkInput(e)} placeholder='Size S' defaultValue={val.small}/>
                                    </div>
                                    <div className="col">
                                        <label>Size M</label>
                                        <input type='number' ref={(SizeM) => { this.SizeM = SizeM }} min="0" className='form-control' onKeyDown={(e) => this.checkInput(e)} placeholder='Size M' defaultValue={val.medium} />
                                    </div>
                                    <div className="col">
                                        <label>Size L</label>
                                        <input type='number' ref={(SizeL) => { this.SizeL = SizeL }} min="0" className='form-control' onKeyDown={(e) => this.checkInput(e)} placeholder='Size L' defaultValue={val.large}/>
                                    </div>
                                    <div className="col">
                                        <label>Size XL</label>
                                        <input type='number' ref={(SizeXL) => { this.SizeXL = SizeXL }} min="0" className='form-control' onKeyDown={(e) => this.checkInput(e)} placeholder='Size XL' defaultValue={val.xlarge}/>
                                    </div>
                                </div>
                                <label>Price (in Rupiah)</label>
                                <input type='number' ref={(ProductPrice) => { this.ProductPrice = ProductPrice }} min="0" className='form-control text-right mb-3' onKeyDown={(e) => this.checkInput(e)} placeholder='Product Price' defaultValue={val.price}/>
                                <label>Product Description</label>
                                <textarea ref={(DescriptionProduct) => this.DescriptionProduct = DescriptionProduct} placeholder='Product Description' className='form-control' defaultValue={val.description}></textarea>
                                <label>Popular Count</label>
                                <input ref={(PopularCount) => { this.PopularCount = PopularCount}} type='number' min="0" className='form-control' placeholder='Popular Count' defaultValue={val.popularCount} disabled/>
                            </div>
                        </div>
                        <button type='submit' hidden className='align-items-end'></button>
                    </div>
                </form>
            )
        })
    }

    renderDeleteProduct = () => {
        return this.state.productDetail.map((val, id) => {
            return (
                <div>
                    {this.backToTopModal(this.props.error, this.props.success)}
                    <p>Apakah anda yakin akan menghapus product dengan nama <span className='font-weight-bold'>{val.name}</span> ?</p>
                </div>
            )
        })
    }

    toggle = () => {
      
        if(this.state.modalAddProduct) {
            
            this.setState({
                modalAddProduct: !this.state.modalAddProduct,
                errorStateProduct: '',
                successStateProduct: '',
                successStateGetProduct: '',
                
                productCoverImageFile: `${URL_API}/defaultPhoto/defaultCategory.png`,
                productImage1File: `${URL_API}/defaultPhoto/defaultCategory.png`,
                productImage2File: `${URL_API}/defaultPhoto/defaultCategory.png`,

                productCoverImageName: `Select Cover Image`,
                productImage1Name: `Select Product Image`,
                productImage2Name: `Select Product Image`,

                productCoverImageDB: undefined,
                productImage1DB: undefined,
                productImage2DB: undefined
                
            })
        } else if (this.state.modalDetailProduct) {
            this.setState({
                modalDetailProduct: !this.state.modalDetailProduct,
                errorStateProduct: '',
                successStateProduct: '',
                successStateGetProduct: '',
                productDetail: [],
                linkImageProduct: []
            })
        } else if (this.state.modalEditProduct) {
            this.setState({
                modalEditProduct: !this.state.modalEditProduct,
                errorStateProduct: '',
                successStateProduct: '',
                successStateGetProduct: '',

                productDetail: [],
                linkImageProduct: [],

                productCoverImageFile: '',
                productImage1File: '',
                productImage2File: '',

                productCoverImageDB: undefined,
                productImage1DB: undefined,
                productImage2DB: undefined
            })
        } else if (this.state.modalDeleteProduct) {
            this.setState({
                modalDeleteProduct: !this.state.modalDeleteProduct,
                errorStateProduct: '',
                successStateProduct: '',
                successStateGetProduct: ''
            })
        }
    }

    render() {
        return (
            <div className='container-fluid'>
                <div className="row">
                   
                    <div className="col-11">
                        {this.renderModalAddProduct(this.state.modalAddProduct)}
                        {this.renderModalDetailProduct(this.state.modalDetailProduct)}
                        {this.renderModalEditProduct(this.state.modalEditProduct)}
                        {this.renderModalDeleteProduct(this.state.modalDeleteProduct)}
                        {
                            this.state.successStateProduct ?
                                <div className='alert alert-success font-weight-bold'>
                                    
                                    {this.state.successStateProduct}
                                </div>
                                :
                                null
                        }
                        <button 
                            className='alert-secondary form-control text-left font-weight-bold'
                            onClick={() => this.setState({modalAddProduct: true})}
                            >
                            <p><FontAwesomeIcon icon={faPlus}/> Add New Product</p>
                        </button>
                        
                        <div className='table-responsive'>
                            <div className='font-weight-bold mt-5'>
                                {
                                    this.state.successStateGetProduct ?
                                        <div className='alert alert-success font-weight-bold mb-1'>
                                            
                                            {this.state.successStateGetProduct}
                                        </div>
                                        :
                                        null
                                }
                                {
                                    
                                    this.state.errorStateProduct ?
                                        <div className='alert alert-danger font-weight-bold mb-1'>
                                            {this.state.errorStateProduct}
                                        </div>
                                                :
                                        null
                                }
                                <span>Search by: </span>
                                <button 
                                    className='btn btn-warning alert-warning font-weight-bold mr-3'
                                    onClick={() => this.getAllProduct(1)}
                                >
                                    <span>All Product</span>
                                </button>
                                <Button 
                                    color='info' 
                                    className='alert-info font-weight-bold' id='productListByCategory' 
                                    onClick={() => this.setState({
                                        errorStateProduct: '',
                                        successStateGetProduct: ''
                                    })} >
                                    Filter Product
                                </Button>
                                <UncontrolledCollapse toggler='#productListByCategory'>
                                        <div className="form-row my-3">
                                            <div className='col-12'>
                                                <label>Product Name: </label>
                                                <input type='text' className='ml-3' ref={(filterProductName) => this.filterProductName = filterProductName} name='searchProductName' />
                                            </div>
                                            <div className="col-4">
                                                <label>Category</label>
                                                <select id="searchCategoryInProduct" className="form-control mb-3" onChange={this.selectedSearchCategoryInProduct} name='searchCategoryId'>
                                                    <option value=''>Select Category</option>
                                                    {this.renderCategoryProduct()}
                                                </select>
                                            </div>
                                            <div className="col-4">
                                                <label>Sub Category</label>
                                                {
                                                    isNaN(this.state.searchCategoryProductSelectedInProduct) === true ||
                                                        this.state.searchCategoryProductSelectedInProduct === null ?

                                                        <select id="searchSubCategoryInProduct" className="form-control">
                                                            <option value=''>Select Sub Category</option>
                                                        </select>

                                                        :
                                                        <select id="searchSubCategoryInProduct" className="form-control" onChange={this.selectedSearchSubCategoryInProduct} name='searchCategoryId'>
                                                            <option value=''>Select Sub Category</option>
                                                            {this.renderSubCategoryProduct(this.state.searchCategoryProductSelectedInProduct)}
                                                        </select>

                                                }
                                                <button
                                                    className='btn btn-warning alert-warning font-weight-bold mt-5 float-right'
                                                    onClick={() => this.getProductByFilter(1)}
                                                >
                                                    <span>Search</span>
                                                </button>
                                            </div>

                                        </div>
                                </UncontrolledCollapse>
                            </div>
                            <table className='table mt-3'>
                                <thead className="thead-dark text-center">
                                    <tr>
                                        <th scope="col">Nama Product</th>
                                        <th scope="col">Cover Image Product</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Popular Count</th>
                                        <th scope="col">Details</th>
                                        <th scope="col">Edit</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.loading ?
                                            <tr>
                                                <td colSpan='7' className='text-center'>
                                                    <div className="spinner-border" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            :
                                            this.renderProductList()
                                    }
                                   
                                </tbody>
                            </table>
                            {
                                this.props.total_pages === 0 ?
                                null
                                :
                                        <ul className="d-flex justify-content-center pagination">
                                            {
                                                this.props.page === 1 ?
                                                    <li className="page-item disabled">
                                                        <span className="page-link">&laquo;</span>
                                                    </li>
                                                    :
                                                <li className="page-item cursorPointer">
                                                        <span className="page-link" onClick={
                                                            this.state.productFiltered ?
                                                            () => this.getProductByFilter(1)
                                                            : 
                                                            () => this.getAllProduct(1)
                                                        }>&laquo; First</span>
                                                    </li>
                                            }
                                            {this.renderPagination()}
                                            {
                                                this.props.page === this.props.total_pages ?
                                                <li className="page-item disabled">
                                                        <span className="page-link">&raquo;</span>
                                                    </li>
                                                    :
                                                <li className="page-item cursorPointer">
                                                        <span className="page-link" onClick={
                                                            this.state.productFiltered ?
                                                            () => this.getProductByFilter(this.props.total_pages)
                                                            :
                                                            () => this.getAllProduct(this.props.total_pages)
                                                            }>Last &raquo;</span>
                                                    </li>
                                            }
                                            
                                        </ul>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({admin}) => {
    return {
        categoryProduct: admin.categoryProduct,
        subCatPro: admin.subCategoryProduct,
        
        page: admin.page,
        total_pages: admin.total_pages,
        total_product: admin.total_product,
        productList: admin.productList,
        
        loading: admin.loading,
        error: admin.error,
        success: admin.success
    }
}

export default connect(mapStateToProps, { 
    getProduct,
    adminAddProduct,
    getFilteredProduct,
    adminEditProduct,
    adminDeleteProduct,
    cleanErrorSuccess
 })(ProductList);