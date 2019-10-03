import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { UncontrolledCollapse, Button } from 'reactstrap'
import {
    adminGetCategoryProduct
} from '../redux/actions';

class CategoryListUI extends Component {
    state = {
        categorySelected: 0,
        categoryParent: ''
    }
    componentDidMount() {
        this.props.adminGetCategoryProduct();
    }

    componentWillReceiveProps(newProps) {
        if (this.props.categoryName !== newProps.categoryName) {
            this.setState({
                categorySelected: 0
            })
        }
    }

    renderAllCategoryComponent = () => {
        return this.props.categoryProduct.map((val, index) => {
            return (
                <Button className='btn btn-warning mr-3' id={`accordionCategory-${val.id}`} key={index} onClick={() => this.setState({ categorySelected: val.id, categoryParent: val.name})}>
                    {val.name}
                </Button>
            )
        })
    }

    renderCategoryComponent = (id) => {
        return this.props.categoryProduct.map((val, index) => {
            if(val.name === this.props.categoryName) {
                return (
                    <Button className='btn btn-warning' id={`accordionCategory-${val.id}`} key={index} onClick={() => this.setState({ categorySelected: val.id, categoryParent: val.name})}>
                        {val.name}
                    </Button>
                )
            }

            return null
        })
    }

    renderSubCategoryComponent = (id) => {
        return this.props.subCatPro.map((val, index) => {
            if (val.parentId === id) {
               return <Link 
                    to={`searchproduct?product=${this.props.categoryName ? this.props.categoryName : this.state.categoryParent}&subCategoryId=${val.idsubcategory}`} 
                    className='d-block'
                    key={index}
                    >
                    {val.subcategory}
                    </Link>
            }
            return null
        })
    }

    render() {
        // if(this.props.loading ){
        //     return (
        //         <div className='container-fluid'>
        //             <div className="row">
        //                 <div className="col-12 text-center">
        //                     <div className="spinner-border" role="status">
        //                         <span className="sr-only">Loading...</span>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     )
        // }
            
        return (
            <div className="accordion" id="accordionMaCommerce">
                <div className="card">
                    <div className="card-header" id="headingOne">
                        <h2 className="mb-0">
                            {
                                this.props.categoryName ?
                                    this.renderCategoryComponent(this.props.categoryName)
                                    :
                                    this.renderAllCategoryComponent()
                            }
                        </h2>
                    </div>
                    {
                        this.state.categorySelected ?
                            <UncontrolledCollapse toggler={`#accordionCategory-${this.state.categorySelected}`}>
                                <div className="card-body">
                                    <Link
                                        to={`searchproduct?product=${this.props.categoryName ? this.props.categoryName : this.state.categoryParent}&page=1`}
                                        className='d-block'
                                    >
                                        All Product {this.props.categoryName}
                                    </Link>
                                    {this.renderSubCategoryComponent(this.state.categorySelected)}
                                </div>
                            </UncontrolledCollapse>
                            :
                           null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({admin}) => {
    return {
        categoryProduct: admin.categoryProduct,
        subCatPro: admin.subCategoryProduct,
        loadingAdmin: admin.loading,
        error: admin.error,
    }
}

export default connect(mapStateToProps, {
    adminGetCategoryProduct
})(CategoryListUI)