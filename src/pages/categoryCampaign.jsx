import React, { Component } from 'react';
import Axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { URL_API } from '../helpers/Url_API';

class categoryCampaign extends Component {
    state = {
        loading: true, 
        categoryList: []
    }
    componentDidMount() {
        Axios.get(URL_API + '/admin/getCategory')
        .then((res) => {
            this.setState({
                categoryList: res.data,
                loading: false
            })
        })
        .catch((err) => {
            console.log(err)
            this.setState({
                loading: false
            })
        })
    }
    renderCategory = () => {
        return this.state.categoryList.map((val) => {
            return (
                <p>
                    <Link className='text-dark' to={`search?categoryId=${val.id}`}>
                        {val.name}
                    </Link>
                </p>
            )
        })
    }
    render() {
        return (
            <div>
                <div className='container'>
                    <div className="col-12">
                        {
                            this.state.loading ?
                                <p>Loading...</p>
                                :
                                this.renderCategory()
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default categoryCampaign;