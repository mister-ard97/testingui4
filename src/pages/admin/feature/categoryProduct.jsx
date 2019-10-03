import React, { Component } from 'react'
import { connect } from 'react-redux';
import { 
    adminGetCategoryProduct,
    adminAddCategoryProduct,
    adminAddSubCategoryProduct,
    adminEditCategoryProduct,
    adminEditSubCategoryProduct,
    adminDeleteCategoryProduct,
    adminDeleteSubCategoryProduct,
    cleanErrorSuccess
} from '../../../redux/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ModalMaCommerce from '../../../components/modal';
import { URL_API } from '../../../helpers/Url_API';
import { CustomInput } from 'reactstrap';

class AdminCategoryProduct extends Component {
    state = {
        categoryProductSelected: null,
        categoryProductNameSelected: '',
        categoryProductImageSelected: null,
        
        subCategoryProductSelected: null,
        subCategoryProductNameSelected: '',

        categoryProductSelectedForSubCat: null,
        
        modalAddCategory: false,
        modalAddSubCategory: false,
        modalEditCategory: false,
        modalDeleteCategory: false,
        
        categoryImageFile: `${URL_API}/defaultPhoto/defaultCategory.png`,
        categoryImageName: 'Select Image' ,
        categoryImageDB: undefined,
        
        errorState: '',
        successState: '',
    }
    
    componentDidMount() {
        document.title = 'Admin Controller Category'
        // this.props.adminGetCategoryProduct();
    }

     // componentDidUpdate() {
    //     console.log(this.props.categoryProduct)
    // }

    addCategory = () => {
        let objCategory = {
            categoryName: this.CategoryProduct.value,
            categoryImage: this.state.categoryImageDB
        }

        this.props.adminAddCategoryProduct(objCategory)
        this.CategoryProduct.value = ''
        this.setState({
            categoryImageFile: `${URL_API}/defaultPhoto/defaultCategory.png`,
            categoryImageName: 'Select Image',
            categoryImageDB: undefined,
            categoryProductSelected: null
        })
    }
    
    addSubCategory = () => {
        let objSubCategory = {
            parentCategoryId: this.state.categoryProductSelectedForSubCat,
            subCategoryName: this.subCategoryProduct.value,
        }

        this.props.adminAddSubCategoryProduct(objSubCategory)
        this.subCategoryProduct.value = ''
        document.getElementById('getInnerCategory').value = ''
        this.setState({
            categoryProductSelectedForSubCat: null,
            categoryProductNameSelected: ''
        })
    }

    onBtnEditCatOrSubCat = () => {
        if (isNaN(this.state.categoryProductSelected) === true || this.state.categoryProductSelected === null) {
            this.setState({
                errorState: 'Harap pilih category yang ingin diedit',
            })
            return null
        } 
        if (this.state.subCategoryProductSelected === 'Select Sub Category' ||
                this.state.subCategoryProductSelected === null ) {
                let categoryImage = document.getElementById('CategoryImage').src
                this.setState({
                    subCategoryProductSelected: false,
                    errorState: '',
                    successState: '',
                    modalEditCategory: true,
                    categoryProductImageSelected: categoryImage
                })
                return null  
        } else {
            this.setState({
                errorState: '',
                successState: '',
                modalEditCategory: true
            })
            return null
        }
    }

    onBtnDeleteCatOrSubCat = ( ) => {
        if (isNaN(this.state.categoryProductSelected) === true || this.state.categoryProductSelected === null) {
            this.setState({
                errorState: 'Harap pilih category yang ingin dihapus',
            })
            return null
        }
        if (this.state.subCategoryProductSelected === 'Select Sub Category' ||
            this.state.subCategoryProductSelected === null) {
            let categoryImage = document.getElementById('CategoryImage').src
            this.setState({
                subCategoryProductSelected: false,
                errorState: '',
                successState: '',
                modalDeleteCategory: true,
                categoryProductImageSelected: categoryImage
            })
            return null
        } else {
            this.setState({
                errorState: '',
                successState: '',
                modalDeleteCategory: true
            })
            return null
        }
    }
    

    editCategory = () => {
        let objCategory = {
            categoryId: this.state.categoryProductSelected,
            categoryName: this.EditCategoryProduct.value,
            categoryImage: this.state.categoryImageDB,
        }

        this.props.adminEditCategoryProduct(objCategory)       
        this.EditCategoryProduct.value = ''
       
    }

    editSubCategory = () => {
        let objSubCategory = {
            parentCategoryId: this.state.categoryProductSelected,
            subCategoryId: this.state.subCategoryProductSelected,
            subCategoryName: this.EditSubCategoryProduct.value
        }

        this.props.adminEditSubCategoryProduct(objSubCategory)

        this.EditSubCategoryProduct.value = ''
        document.getElementById('categoryProduct').value = ''
        this.setState({
            categoryProductSelected: null
        })
    }

    deleteCategory = () => {
        this.props.adminDeleteCategoryProduct(this.state.categoryProductNameSelected)
       
        document.getElementById('categoryProduct').value = ''
        this.setState({
            categoryProductSelected: null,
            modalDeleteCategory: !this.state.modalDeleteCategory,
            successState: 'Category berhasil dihapus'
        })
    }
    
    deleteSubCategory = () => {
        this.props.adminDeleteSubCategoryProduct(this.state.subCategoryProductNameSelected)
        
        document.getElementById('categoryProduct').value = ''
        this.setState({
            categoryProductSelected: null,
            modalDeleteCategory: !this.state.modalDeleteCategory,
            successState: 'Sub Category berhasil dihapus'
        })
    }

    categoryImageChange = (e) => {
        if (e.target.files[0]) {
            this.setState({
                categoryImageFile: URL.createObjectURL(e.target.files[0]),
                categoryImageName: e.target.files[0].name,
                categoryImageDB: e.target.files[0]
            })
        } else {
            this.setState({
                categoryImageFile: `${URL_API}/defaultPhoto/defaultCategory.png`,
                categoryImageName: `Select Image`,
                categoryImageDB: undefined
            })
        }
    }

    selectedCategory = () => {
        let categoryProduct = document.getElementById('categoryProduct')
        let selectedOptions= categoryProduct.options[categoryProduct.selectedIndex]
        this.setState({
            categoryProductSelected: parseInt(selectedOptions.value),
            categoryProductNameSelected: selectedOptions.innerHTML,
            subCategoryProductSelected: null,
            subCategoryProductNameSelected: '',
        })
    }

    selectedSubCategory = () => {
        let subCategoryProduct = document.getElementById('subCategoryProduct')
        let selectedOptions = subCategoryProduct.options[subCategoryProduct.selectedIndex]
        this.setState({ 
            subCategoryProductSelected: parseInt(selectedOptions.value) ,
            subCategoryProductNameSelected: selectedOptions.innerHTML
        })
    }

    getInnerCategory = () => {
        let categoryProduct = document.getElementById('getInnerCategory')
        this.setState({
            categoryProductSelectedForSubCat: parseInt(categoryProduct.options[categoryProduct.selectedIndex].value),
            categoryProductNameSelected: categoryProduct.options[categoryProduct.selectedIndex].innerHTML
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

    renderCategoryImage = (id) => {
        return this.props.categoryProduct.map((val, index) => {
            if(val.id === id) {
                return <img key={index} src={`${URL_API}${val.categoryImage}`} alt="user-default" className='userImage my-3' id='CategoryImage'/>
            }

            return null
        })
    }

    renderSubCategoryProduct = (id) => {
        return this.props.subCatPro.map((val, index) => {
            if(val.parentId === id) {
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

    renderModalAddCategory = (params) => {
        if(params) {
            return (
                <ModalMaCommerce 
                    modal={this.state.modalAddCategory}
                    toggle={this.toggle}
                    successMessage={this.props.success}
                    errorMessage={this.props.error}
                    ModalHeader={'Add Category'}
                    ModalBody={
                        <div>
                           <h3>New Category Name</h3>
                            <img src={`${this.state.categoryImageFile}`} alt="user-default" className='userImage my-3' />
                            <CustomInput id='addc' type='file' label={this.state.categoryImageName} onChange={this.categoryImageChange} />
                            
                            <input ref={(CategoryProduct) => this.CategoryProduct = CategoryProduct} 
                                    type="text" 
                                    className="form-control mt-3" 
                                    id="CategoryProduct" 
                                    placeholder="Enter New Category" 
                             />
                        </div>
                    }
                    loading={this.props.loading}
                    buttonClickName={'Add New Category'}
                    onClickModal={this.addCategory}
                />
            )
        }
    }

    renderModalAddSubCategory = (params) => {
        if (params) {
            return (
                <ModalMaCommerce
                    modal={this.state.modalAddSubCategory}
                    toggle={this.toggle}
                    successMessage={this.props.success}
                    errorMessage={this.props.error}
                    ModalHeader={'Add New Sub Category'}
                    ModalBody={
                        <div>
                            <h4>Select Category</h4>
                            <select id="getInnerCategory" className="form-control mb-3" onChange={this.getInnerCategory}>
                                <option value=''>Select Category</option>
                                {this.renderCategoryProduct()}
                            </select>
                            <h4>New Sub Category Name For: {this.state.categoryProductNameSelected === 'Select Category' ? '' : this.state.categoryProductNameSelected}</h4>

                            <input ref={(subCategoryProduct) => this.subCategoryProduct = subCategoryProduct}
                                type="text"
                                className="form-control mt-3"
                                id="subCategoryProduct"
                                placeholder="Enter New Sub Category"
                            />
                        </div>
                    }
                    loading={this.props.loading}
                    buttonClickName={'Add New Sub Category'}
                    onClickModal={this.addSubCategory}
                />
            )
        }
    }

    renderModalEdit = (params) => {
        if(params) {
            return (
                <ModalMaCommerce
                    className='modal-md'
                    modal={this.state.modalEditCategory}
                    toggle={this.toggle}
                    successMessage={this.props.success}
                    errorMessage={this.props.error}
                    ModalHeader={
                        this.state.subCategoryProductSelected ?
                            'Edit Sub Category'
                            :
                            'Edit Category'
                    }
                    ModalBody={
                        this.renderContentEditCatOrSubCat()
                    }
                    loading={this.props.loading}
                    buttonClickName={
                        this.state.subCategoryProductSelected ?
                            'Update Sub Category'
                            :
                            'Update Category'
                    }
                    colorOnClick="success"
                    onClickModal={
                        this.state.subCategoryProductSelected ?
                            this.editSubCategory
                        :
                            this.editCategory
                    }
                    cancelButton="Cancel"
                />
            )
        }
    }

    renderModalDelete = (params) => {
        if(params) {
           return (
               <ModalMaCommerce
                   className='modal-md'
                   modal={this.state.modalDeleteCategory}
                   toggle={this.toggle}
                   errorMessage={this.props.error}
                   ModalHeader={
                       this.state.subCategoryProductSelected ?
                           'Delete Sub Category'
                           :
                           'Delete Category'
                   }
                   ModalBody={
                       this.renderContentDeleteCatOrSubCat()
                   }
                   loading={this.props.loading}
                   buttonClickName={
                       this.state.subCategoryProductSelected ?
                           'Ya, saya ingin menghapus Sub Category ini'
                           :
                           'Ya, saya ingin menghapus Category ini'
                   }
                   colorOnClick="success"
                   onClickModal={
                       this.state.subCategoryProductSelected ?
                           this.deleteSubCategory
                           :
                           this.deleteCategory
                   }
                   cancelButton="Cancel"
               />
           )
        }
    }

    renderContentEditCatOrSubCat = () => {
        if (this.state.subCategoryProductSelected) {
            return (
                <div>
                    <h3>Edit Sub Category</h3>
                    <input type="text" className='form-control' disabled value={this.state.subCategoryProductNameSelected} />
                    <input ref={(EditSubCategoryProduct) => this.EditSubCategoryProduct = EditSubCategoryProduct}
                        type="text"
                        className="form-control mt-3"
                        id="EditSubCategoryProduct"
                        placeholder="Enter New Name Sub Category"
                    />
                </div>
            )
        }

        return (
            <div className='font-weight-bold'>
                <h3>Edit Category For {this.state.categoryProductNameSelected}</h3>
                <div className='d-flex flex-row'>
                  <div className='mr-5'>
                        <p>Previous Image</p>
                        <img src={`${this.state.categoryProductImageSelected}`} alt="user-default" className='userImage my-3' />
                  </div>
                   <div>
                        <p>Changed it into: </p>
                        <img src={`${this.state.categoryImageFile}`} alt="user-default" className='userImage my-3' />
                   </div>
                </div>
                <CustomInput id='editc' type='file' label={this.state.categoryImageName} onChange={this.categoryImageChange} />
                <input ref={(EditCategoryProduct) => this.EditCategoryProduct = EditCategoryProduct}
                    type="text"
                    className="form-control mt-3"
                    id="EditCategoryProduct"
                    placeholder="Enter New Name Category"
                />
            </div>
        )
    }

    renderContentDeleteCatOrSubCat = () => {
        if (this.state.subCategoryProductSelected) {
            return (
                <div className='text-center'>
                    <h4>Delete Sub Category</h4>
                    <p>Apakah anda yakin ingin menghapus sub Category
                    <span className='font-weight-bold'> {this.state.subCategoryProductNameSelected} </span>
                        dari Category 
                    `<span className='font-weight-bold'>{this.state.categoryProductNameSelected}</span>` ?
                    </p>
                </div>
            )
        }

        return (
            <div className='text-center'>
                <h4>Delete Category</h4>
                <p>Apakah anda yakin ingin menghapus Category `<span>{this.state.categoryProductNameSelected}</span>` ?</p>
                <p><small>Sub Category yang berada di Category {this.state.categoryProductNameSelected} akan ikut terhapus</small></p>
            </div>
        )
    }

    toggle = () => {
        this.props.cleanErrorSuccess();
        if (this.state.modalAddCategory) {
            this.setState({
                modalAddCategory: !this.state.modalAddCategory,
                
            });
        } 
        if (this.state.modalAddSubCategory){
            this.setState({
                modalAddSubCategory: !this.state.modalAddSubCategory,

            });
        }
        if(this.state.modalEditCategory) {
            this.setState({
                modalEditCategory: !this.state.modalEditCategory
            });
        }
        if(this.state.modalDeleteCategory) {
            this.setState({
                modalDeleteCategory: !this.state.modalDeleteCategory
            });
        }
       
    }

    render() {
        return (
            <div>
              <div className="container-fluid">
                    <div className="col-10">
                        {this.renderModalAddCategory(this.state.modalAddCategory)}
                        <button className="alert alert-secondary mr-3" onClick={() => this.setState({ modalAddCategory: true})}>
                            <p><FontAwesomeIcon icon={faPlus} /> Add New Category</p>
                        </button>
                        {this.renderModalAddSubCategory(this.state.modalAddSubCategory)}
                        {this.renderModalEdit(this.state.modalEditCategory)}
                        {this.renderModalDelete(this.state.modalDeleteCategory)}
                        <button className="alert alert-secondary" onClick={() => this.setState({ modalAddSubCategory: true })}>
                            <p><FontAwesomeIcon icon={faPlus} /> Add New Sub Category</p>
                        </button>
                        {
                            this.state.errorState ? 
                                <div className='alert alert-danger font-weight-bold'>
                                    {this.state.errorState}
                                </div>
                                :
                                null
                        }
                        {
                            this.state.successState ?
                                <div className='alert alert-success font-weight-bold'>
                                    {this.state.successState}
                                </div>
                                :
                                null
                        }
                        <table className="table">
                            <thead className="thead-dark text-center">
                                <tr>
                                    <th scope="col">Category</th>
                                    <th scope="col">Image Category</th>
                                    <th scope="col">Sub Category</th>
                                    <th scope="col">Edit</th>
                                    <th scope="col">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <select id="categoryProduct" className="form-control mb-3" onChange={this.selectedCategory}>
                                            <option value=''>Select Category</option>
                                            {this.renderCategoryProduct()}
                                        </select>
                                    </td>
                                    <td style={{display: 'block', width: '200px'}}>
                                        {
                                            this.state.categoryProductSelected !== null ?

                                                this.renderCategoryImage(this.state.categoryProductSelected)
                                                :
                                                <img src={`http://localhost:2002/defaultPhoto/defaultCategory.png`} alt="user-default" className='userImage my-3' />
                                        }
                                    </td>
                                    <td>
                                        {
                                            this.state.categoryProductSelected !== null ?
                                                <select id="subCategoryProduct" className="form-control" onChange={this.selectedSubCategory}>
                                                    <option value=''>Select Sub Category</option>
                                                    {this.renderSubCategoryProduct(this.state.categoryProductSelected)}
                                                </select>
                                                :
                                                <select id="subCategoryProduct" className="form-control">
                                                    <option value=''>Select Sub Category</option>
                                                </select>
                                        }
                                    </td>
                                    <td className='text-center p-1'>
                                        <button 
                                            className='btn btn-info alert alert-info' 
                                            onClick={this.onBtnEditCatOrSubCat}
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Edit Button"
                                            >
                                            <FontAwesomeIcon icon={faEdit}/>
                                        </button>
                                    </td>
                                    <td className='text-center p-1'>
                                        <button 
                                            className='btn btn-danger alert alert-danger'
                                            data-toggle="tooltip"
                                            data-placement="top"
                                            title="Delete Button"
                                            onClick={this.onBtnDeleteCatOrSubCat}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
              </div>
            </div>
        )
    }   
}

const mapStateToProps = (state) => {
    return {
        categoryProduct: state.admin.categoryProduct,
        subCatPro: state.admin.subCategoryProduct,   
        loading: state.admin.loading,
        error: state.admin.error,
        success: state.admin.success
    }
}


export default connect(mapStateToProps, {
    adminGetCategoryProduct,
    adminAddCategoryProduct,
    adminAddSubCategoryProduct,
    adminEditCategoryProduct,
    adminEditSubCategoryProduct,
    adminDeleteCategoryProduct,
    adminDeleteSubCategoryProduct,
    cleanErrorSuccess
})(AdminCategoryProduct);