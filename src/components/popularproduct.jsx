import React , { Component } from 'react';
import Slider from 'react-slick';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    getAllProductUI
} from '../redux/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { URL_API } from '../helpers/Url_API';

var numeral = require('numeral')

class PopularProduct extends Component {
    componentDidMount() {
        this.props.getAllProductUI(6)
    }
    
    renderPopularProduct = () => {
        if (this.props.productListHome) {
            return this.props.productListHome.map((val, index) => {
               return (
                   <Link to={`/productDetail?productId=${val.productId}`} className='card' key={index}>
                       <img src={`${URL_API}${val.coverImage}`} className="card-img-top" alt={`${val.coverImage}-${val.productId}`} style={{height: '250px'}}/>
                       <div className="card-body font-weight-bold p-2">
                           <h5 className="card-title">{
                               val.name.length > 13 ?
                               val.name.substr(0, 13) + '...'
                                : 
                                val.name
                            }</h5>
                           <p className="card-text text-danger">Rp. {numeral(val.price).format(0,0)}</p>
                           <div className='container-fluid'>
                               <div className='row'>

                               </div>
                           </div>
                           <p className="card-text mt-3">
                               <FontAwesomeIcon icon={faHeart} className='text-danger' /> {val.popularCount}
                           </p>
                       </div>
                   </Link>
               )
           })
       }

       return (
           <div className="spinner-border" role="status">
               <span className="sr-only">Loading...</span>
           </div>
       )

    }
    render() {
        
        var settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 5,
            slidesToScroll:1,
            
            responsive: [
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 3
                    }
                }, 
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 2
                    }
                }, 
                {
                    breakpoint: 580,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        };
        return (
            <div className='container pt-5'>
                <h2 className='my-5 pl-2 text-center text-sm-left'>
                    Product Populer Right Now!!
                </h2>
                   <Slider {...settings}>
                        {this.renderPopularProduct()}
                    </Slider>
            </div>
        )
    }
}

const mapStateToProps = ({admin}) => {
    return {
        productListHome: admin.productListHome,
        loading: admin.loading
    }
}

export default connect(mapStateToProps, { getAllProductUI })(PopularProduct);