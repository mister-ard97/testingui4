import Axios from 'axios';
import {
    AUTH_LOGIN_ERROR,
    AUTH_LOGIN_LOADING,
    USER_LOGIN_SUCCESS,
    VERIFICATION_SUCCESS,
    VERIFICATION_FAILED,
    ALL_CATEGORY,
    ADMIN_LOADING,
    ADMIN_LOADING_ERROR,
    ADMIN_CLEAN,
    ALL_PRODUCT
} from './types';
import { URL_API } from '../../helpers/Url_API';

export const adminRegister = (data) => {
    let {
        username,
        password,
        confPassword,
        FirstName,
        LastName,
        email,
        address
    } = data

    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN_LOADING });
        if (username === '' ||
            password === '' ||
            confPassword === '' ||
            FirstName === '' ||
            LastName === '' ||
            email === '' ||
            address === '') {

            dispatch({
                type: AUTH_LOGIN_ERROR, payload: {
                    error: 'Semua Form Input Harus Diisi',
                }
            })
        } else if (!(password === confPassword)) {
            dispatch({
                type: AUTH_LOGIN_ERROR, payload: {
                    error: 'Password dan Confirmation Password Harus Sama',
                }
            })
        } else {

            delete data.confPassword;

            Axios.post(URL_API + '/admin/adminRegister', data)
                .then((res) => {
                    let { FirstName, LastName, username, email, token, status, role } = res.data
                    localStorage.setItem('token', token);
                    dispatch({
                        type: USER_LOGIN_SUCCESS, payload: {
                            FirstName,
                            LastName,
                            username,
                            email,
                            token,
                            status,
                            role,
                            justRegister: true,
                            loginChecked: true,
                            NextPage: true
                        }
                    })
                })
                .catch((err) => {
                    if (err.response) {
                        dispatch({
                            type: AUTH_LOGIN_ERROR, payload: {
                                error: err.response.data.message,
                            }
                        })
                    }
                })
        }
    }      
}

export const adminLogin = (username, password) => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN_LOADING });

        Axios.post(URL_API + '/admin/adminLogin', {
            username, password
        })
            .then((res) => {
                let { FirstName, LastName, username, email, token, status, role } = res.data
                localStorage.setItem('token', token);
                dispatch({
                    type: USER_LOGIN_SUCCESS, payload: {
                        FirstName,
                        LastName,
                        username,
                        email,
                        token,
                        status,
                        role,
                        loginChecked: true
                    }
                })
            })
            .catch((err) => {
                if (err.response) {
                    dispatch({
                        type: AUTH_LOGIN_ERROR, payload: {
                            error: err.response.data.message,
                        }
                    })
                }
            })
    }
}


export const resendAdminEmailVerification = (username, email) => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN_LOADING });

        Axios.post(URL_API + '/admin/adminResendEmailVerification', {
            username,
            email
        })
            .then((res) => {
                let { FirstName, LastName, username, email, token, status, role } = res.data
                localStorage.setItem('token', token);
                dispatch({
                    type: USER_LOGIN_SUCCESS, payload: {
                        FirstName,
                        LastName,
                        username,
                        email,
                        token,
                        status,
                        role,
                        justRegister: true,
                        loginChecked: true
                    }
                })
                dispatch({ type: VERIFICATION_SUCCESS });
            })
            .catch((err) => {
                dispatch({ type: VERIFICATION_FAILED });
            })
    }
}

export const adminEmailVerification = () => {
    return (dispatch) => {
        dispatch({ type: AUTH_LOGIN_LOADING });
        const token = localStorage.getItem('token');
        const options = {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
        Axios.put(URL_API + '/admin/adminEmailVerification', {}, options)
            .then((res) => {
                let { FirstName, LastName, username, email, token, status, role } = res.data
                localStorage.setItem('token', token);
                dispatch({
                    type: USER_LOGIN_SUCCESS, payload: {
                        FirstName,
                        LastName,
                        username,
                        email,
                        token,
                        status,
                        role,
                        justRegister: true,
                        loginChecked: true
                    }
                })
                dispatch({ type: VERIFICATION_SUCCESS });
            })
            .catch((err) => {
                dispatch({ type: VERIFICATION_FAILED });
            })
    }
}

// CATEGORY ACTION CREATOR

export const adminGetCategoryProduct = () => {
    return (dispatch) => {
        dispatch({ type: ADMIN_LOADING })
        Axios.get(URL_API + '/admin/getCategory')
        .then((res) => {
            dispatch({
                type: ALL_CATEGORY, payload: {
                    categoryProduct: res.data.categoryParent,
                    subCategoryProduct: res.data.subCategory,
                    loading: false
                }
            })
        })
        .catch((err) => {
            if (err.response) {
                dispatch({
                    type: ADMIN_LOADING_ERROR, payload: {
                        error: err.response.data.message,
                    }
                })
            }
            
        })
    }
}

export const adminAddCategoryProduct = (datacategory) => {
    let {
        categoryName,
        categoryImage
    } = datacategory
    return (dispatch) => {
        dispatch({ type: ADMIN_LOADING })
        if (categoryName === '' || !categoryImage) {
            if(categoryName === '') {
                dispatch({
                    type: ADMIN_LOADING_ERROR, payload: {
                        error: 'Category Name tidak boleh kosong',
                    }
                })
            }
            if(!categoryImage) {
                dispatch({
                    type: ADMIN_LOADING_ERROR, payload: {
                        error: 'Category Name tidak boleh kosong',
                    }
                })
            }
        } else {

            const token = localStorage.getItem('token');
            
            let formData = new FormData();
            let options = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }

            formData.append('categoryImage', categoryImage)

            delete datacategory.categoryImage

            formData.append('dataCategory', JSON.stringify(datacategory))

            Axios.post(URL_API + '/admin/addCategory', formData, options)
                .then((res) => {
                    dispatch({
                        type: ALL_CATEGORY, payload: {
                            categoryProduct: res.data.categoryParent,
                            success: 'Category berhasil ditambahkan',
                            loading: false
                        }
                    })
                })
                .catch((err) => {
                       dispatch({
                           type: ADMIN_LOADING_ERROR, payload: {
                               error: err.response.data.message,
                           }
                       })
                })
        }
    }
}

export const adminAddSubCategoryProduct = (objSubCategory) => {
    let {
        parentCategoryId,
        subCategoryName
    } = objSubCategory

    return (dispatch) => {
        dispatch({ type: ADMIN_LOADING })
        if (subCategoryName === '') {
            dispatch({
                type: ADMIN_LOADING_ERROR, payload: {
                    error: 'Nama Sub Category harus diisi',
                }
            })
        } else {
            const token = localStorage.getItem('token');

            let options = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
            Axios.post(URL_API + '/admin/addSubCategory', { parentCategoryId, subCategoryName }, options)
                .then((res) => {
                    dispatch({
                        type: ALL_CATEGORY, payload: {
                            subCategoryProduct: res.data.subCategory,
                            success: 'Sub Category berhasil ditambahkan',
                            loading: false
                        }
                    })
                })
                .catch((err) => {
                        dispatch({
                            type: ADMIN_LOADING_ERROR, payload: {
                                error: err.response.data.message,
                            }
                        })
                })
        }        
    }
}

export const adminEditCategoryProduct = (dataEditCategory) => {
    let {
        categoryId,
        categoryImage
    } = dataEditCategory

    return(dispatch) => {
        dispatch({ type: ADMIN_LOADING })

            let formData = new FormData();
            const token = localStorage.getItem('token');

            let options = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }

            formData.append('categoryImage', categoryImage);

            delete dataEditCategory.categoryImage

            formData.append('dataCategory', JSON.stringify(dataEditCategory))

            Axios.put(URL_API + '/admin/editCategory/' + categoryId, formData, options)
                .then((res) => {
                    dispatch({
                        type: ALL_CATEGORY, payload: {
                            categoryProduct: res.data.categoryParent,
                            success: 'Category berhasil diupdate',
                            loading: false
                        }
                    })
                })
                .catch((err) => {
                        dispatch({
                            type: ADMIN_LOADING_ERROR, payload: {
                                error: err.response.data.message,
                            }
                        })
                })     
    }
}

export const adminEditSubCategoryProduct = (objSubCategory) => {
    let {subCategoryId} = objSubCategory;

    return (dispatch) => {
        dispatch({ type: ADMIN_LOADING })

        const token = localStorage.getItem('token');

        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.put(URL_API + '/admin/editSubCategory/' + subCategoryId, objSubCategory, options)
            .then((res) => {
                dispatch({
                    type: ALL_CATEGORY, payload: {
                        subCategoryProduct: res.data.subCategory,
                        success: 'Sub Category berhasil diupdate',
                        loading: false
                    }
                })
            })
            .catch((err) => {
                   dispatch({
                       type: ADMIN_LOADING_ERROR, payload: {
                           error: err.response.data.message,
                       }
                   })
            })
    }
}

export const adminDeleteCategoryProduct = (categoryName) => {
    return (dispatch) => {

        dispatch({ type: ADMIN_LOADING })
        const token = localStorage.getItem('token');
        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        console.log(options)

        Axios.delete(URL_API + '/admin/deleteCategory/' + categoryName, options)
        .then((res) => {
            dispatch({
                type: ALL_CATEGORY, payload: {
                    categoryProduct: res.data.categoryParent,
                    success: 'Category berhasil dihapus',
                    loading: false
                }
            })
        })
        .catch((err) => {
               dispatch({
                   type: ADMIN_LOADING_ERROR, payload: {
                       error: err.response.data.message,
                   }
               })
        })

    }
}

export const adminDeleteSubCategoryProduct = (subCategoryName) => {

    return (dispatch) => {
        dispatch({ type: ADMIN_LOADING })
        const token = localStorage.getItem('token');
        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }

        Axios.delete(URL_API + '/admin/deleteSubCategory/' + subCategoryName, options)
            .then((res) => {
                dispatch({
                    type: ALL_CATEGORY, payload: {
                        subCategoryProduct: res.data.subCategory,
                        success: 'Sub Category berhasil dihapus',
                        loading: false
                    }
                })
            })
            .catch((err) => {
                    dispatch({
                        type: ADMIN_LOADING_ERROR, payload: {
                            error: err.response.data.message,
                        }
                    })
            })

    }
}

// END OF CATEGORY ACTION CREATOR 

// PRODUCT ACTION CREATOR

export const getAllProductUI = (limit) => {
    return (dispatch) => {
        dispatch({ type: ADMIN_LOADING })
        Axios.get(URL_API + '/productMaCommerce/allProductUI?limit=' + limit)
            .then((res) => {
                dispatch({
                    type: ALL_PRODUCT,
                    payload: {
                        productListHome: res.data.dataProduct,
                        loading: false
                    }
                })
            })
            .catch((err) => {
                   dispatch({
                       type: ADMIN_LOADING_ERROR, payload: {
                           error: err.response.data.message,
                       }
                   })
            })
    }
}

export const getProduct = (page) => {
    return(dispatch) => {
        dispatch({ type: ADMIN_LOADING })
        Axios.get(URL_API + '/productMaCommerce/allProduct?page=' + page)
        .then((res) => {
            dispatch({
                type: ALL_PRODUCT,
                payload: {
                    allProduct: true,
                    filteredProduct: '',
                    page: res.data.page,
                    total_product: res.data.totalProduct,
                    total_pages: res.data.total_pages,
                    productList: res.data.dataProduct,
                    loading: false
                }
            })
        })
        .catch((err) => {
                dispatch({
                    type: ADMIN_LOADING_ERROR, payload: {
                        error: err.response.data.message,
                    }
                })
        })
    }
}

export const getFilteredProduct = (objFiltered) => {
    console.log(objFiltered)
    let { 
        categoryId,
        productName,
        subCategoryId,
        page, 
        product,
        // showData
    } = objFiltered

    return (dispatch) => {
        dispatch({ type: ADMIN_LOADING })

        if (productName === '' && 
            isNaN(categoryId) === true && 
            categoryId === null && 
            isNaN(subCategoryId) === true && 
            subCategoryId === null
        ) {
            dispatch({
                type: ADMIN_LOADING_ERROR, payload: {
                    error: 'Untuk dapat mem-filter product, tolong isi Product Name atau pilih salah satu dari Category yang tersedia.',
                }
            })
        } else {

            let searchQueryFilter = ''
            if(product) {
                searchQueryFilter += `product=${product}&`
            }
            if(productName) {
                searchQueryFilter += `productName=${productName}&`
            }
            if(categoryId) {
                searchQueryFilter += `categoryId=${categoryId}&`
            }

            if(subCategoryId) {
                searchQueryFilter += `subCategoryId=${subCategoryId}&`
            }

            // if (showData) {
            //     searchQueryFilter += `page=${page}&`
            // }

            if(page) {
                searchQueryFilter += `page=${page}`
            }

           

            Axios.get(URL_API + '/productMaCommerce/searchFilteredProduct?' + searchQueryFilter)
                .then((res) => {
                    
                    dispatch({
                        type: ALL_PRODUCT,
                        payload: {
                            filteredProduct: product,
                            allProduct: false,
                            page: res.data.page,
                            total_product: res.data.totalProduct,
                            total_pages: res.data.total_pages,
                            productList: res.data.dataProduct,
                            filteredProductCategory: res.data.categoryName,
                            filteredProductSubCategory: res.data.subCategoryName,
                            loading: false,
                            success: 'Success'
                        }
                    })
                })
                .catch((err) => {
                      dispatch({
                          type: ADMIN_LOADING_ERROR, payload: {
                              error: err.response.data.message,
                          }
                      })
                })
        }
        
    }
}

export const adminAddProduct = (objProduct) => {
    let {
        productName,
        productCategory,
        productSubCategory,
        productCoverImageDB,
        productImage1DB,
        productImage2DB,
    } = objProduct
    console.log(objProduct)

    return (dispatch) => {
        dispatch({ type: ADMIN_LOADING })

        if(!productImage2DB || !productImage1DB || !productCoverImageDB || productName === '' || 
            isNaN(productCategory) === true ||
            !productCategory || 
            isNaN(productSubCategory) === true ||
            !productSubCategory ) {
            
            
            if (productName === '' &&
                (isNaN(productCategory) === true ||
                productCategory === null) &&
                (isNaN(productSubCategory) === true ||
                productSubCategory === null)) {
                dispatch({
                    type: ADMIN_LOADING_ERROR, payload: {
                        error: `
                        Form yang tidak boleh kosong:
                            - Cover Image 
                            - Product Name
                            - Product Category
                            - Product Sub Category
                    `,
                    }
                })
            } else if (productName === '') {
                dispatch({
                    type: ADMIN_LOADING_ERROR, payload: {
                        error: 'Nama Product tidak boleh kosong',
                    }
                })
            } else if (isNaN(productCategory) === true ||
                productCategory === null) {
                dispatch({
                    type: ADMIN_LOADING_ERROR, payload: {
                        error: 'Category Product tidak boleh kosong',
                    }
                })
            } else if (isNaN(productSubCategory) === true ||
                productSubCategory === null) {
                dispatch({
                    type: ADMIN_LOADING_ERROR, payload: {
                        error: 'Sub Category Product tidak boleh kosong',
                    }
                })
            }
        } else {
            console.log('Semua data yang dibutuhkan telah terisi');
            const token = localStorage.getItem('token');

            let formData = new FormData();
            let options = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }

            formData.append('productImage', productCoverImageDB)
            formData.append('productImage', productImage1DB);
            formData.append('productImage', productImage2DB);

            delete objProduct.productCoverImageDB;
            delete objProduct.productImage1DB;
            delete objProduct.productImage2DB;

            formData.append('dataProduct', JSON.stringify(objProduct));


            Axios.post(URL_API + '/admin/addProduct', formData, options)
            .then((res) => {
                dispatch({
                    type: ALL_CATEGORY, payload: {
                        success: res.data.success,
                        loading: false,
                        page: 0,
                        total_product: 0,
                        total_pages: 0,
                        productList: []
                    }
                })
            })
            .catch((err) => {
                    dispatch({
                        type: ADMIN_LOADING_ERROR, payload: {
                            error: err.response.data.message,
                        }
                    })
            })
        }
    }
}

export const adminEditProduct = (objProduct, id) => {
    let {
        productName,
        productCategory,
        productSubCategory,
        productCoverImageDB,
        productImage1DB,
        productImage2DB,
    } = objProduct

    return(dispatch) => {
        dispatch({ type: ADMIN_LOADING })
        console.log(objProduct)
        if (productName === '' ||
            isNaN(productCategory) === true ||
            !productCategory ||
            isNaN(productSubCategory) === true ||
            !productSubCategory ) {

            if (productName === '' &&
                (isNaN(productCategory) === true ||
                    productCategory === null) &&
                (isNaN(productSubCategory) === true ||
                    productSubCategory === null)) {
                dispatch({
                    type: ADMIN_LOADING_ERROR, payload: {
                        error: `
                        Form yang tidak boleh kosong:
                            - Product Name
                            - Product Category
                            - Product Sub Category
                    `,
                    }
                })
            } else if (productName === '') {
                dispatch({
                    type: ADMIN_LOADING_ERROR, payload: {
                        error: 'Nama Product tidak boleh kosong',
                    }
                })
            } else if (isNaN(productCategory) === true ||
                productCategory === null) {
                dispatch({
                    type: ADMIN_LOADING_ERROR, payload: {
                        error: 'Category Product tidak boleh kosong',
                    }
                })
            } else if (isNaN(productSubCategory) === true ||
                productSubCategory === null) {
                dispatch({
                    type: ADMIN_LOADING_ERROR, payload: {
                        error: 'Sub Category Product tidak boleh kosong',
                    }
                })
            }
        } else {
            console.log('Semua data yang dibutuhkan telah terisi');
            const token = localStorage.getItem('token');

            let formData = new FormData();
            let options = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }

            formData.append('productImage', productCoverImageDB)
            formData.append('productImage', productImage1DB);
            formData.append('productImage', productImage2DB);

            formData.append('dataProduct', JSON.stringify(objProduct));


            Axios.put(URL_API + '/admin/editProduct/' + id, formData, options)
                .then((res) => {
                    dispatch({
                        type: ALL_PRODUCT, payload: {
                            success: res.data.success,
                            loading: false,
                            page: 0,
                            total_product: 0,
                            total_pages: 0,
                            productList: []
                        }
                    })
                })
                .catch((err) => {
                       dispatch({
                           type: ADMIN_LOADING_ERROR, payload: {
                               error: err.response.data.message,
                           }
                       })
                })
        }
    }
}

export const adminDeleteProduct = (id) => {
    return(dispatch) => {
        dispatch({ type: ADMIN_LOADING })

        const token = localStorage.getItem('token');
        let options = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        Axios.put(URL_API + '/admin/deleteProduct/' + id, {}, options)
            .then((res) => {
                dispatch({
                    type: ALL_PRODUCT, payload: {
                        success: res.data.success,
                        loading: false,
                        page: 0,
                        total_product: 0,
                        total_pages: 0,
                        productList: []
                    }
                })
            })
            .catch((err) => {
                    dispatch({
                        type: ADMIN_LOADING_ERROR, payload: {
                            error: err.response.data.message,
                        }
                    })
            })
    }
}

// END OF PRODUCT ACTION CREATOR

export const cleanErrorSuccess = () => {
    return {
        type: ADMIN_CLEAN
    }
}