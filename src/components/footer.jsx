import React, { Component } from 'react';

class Footer extends Component {
    render() {
        return (
            <div id='Footer' className='bg-dark mt-5'>
                <div className='container text-white text-center mt-5'>
                    <div className='row py-5 mt-5'>
                        <div className="col-12 mt-5 mb-2 justify-content-between d-flex">
                            <h4 className='font-italic border-bottom'>Testing<span className='text-warning'>UI</span></h4>
                            <h6>Copyright &copy; 2019 - Muhammad Reza Ardiansyah</h6>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Footer;