import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, BottomNavigation, BottomNavigationAction, CircularProgress } from '@material-ui/core'
import { Home, Restore, Favorite, LocationCity, Folder, AccountCircle} from '@material-ui/icons';
import { connect } from 'react-redux';

class BottomNav extends Component{
    state={
        value : 'null'
    }

    handleChange=(event, newValue)=>{
        this.setState({ value: newValue})
    }

    componentDidUpdate() {
        if(this.props.loading) {
            console.log(this.props.loading)
            console.log(this.props.name)
        }
    }

    render(){
        return(
            <div className='container'>
                <div className='row'>
                <div style={{position: 'fixed', bottom: 0, left: '-0.2%'}} className='offset-3 col-6'>
                    <BottomNavigation value={this.state.value} onChange={this.handleChange}>
                            <BottomNavigationAction 
                                label="Home" 
                                value='home' 
                                icon={<Home />} 
                                component={Link}
                                to='/' 
                                className='mt-2'
                            />
                        
                            <BottomNavigationAction 
                                label="Test" 
                                value='recents' 
                                icon={<Restore/>}
                                component={Link}
                                to='/' 
                                className='mt-2'
                            />
                        
                        <BottomNavigationAction label="Test2" value='folder' icon={<Folder/>}/>

                        {
                            this.props.loading ?
                                   <CircularProgress 
                                    size={30}
                                    color='secondary'
                                    className='mt-2'
                                   />
                                    :
                                    <BottomNavigationAction
                                        label={
                                            this.props.name === '' ?
                                                "Login"
                                                :
                                                this.props.name.split(' ')[0]
                                        }
                                        value={
                                            this.props.name === '' ?
                                                'login'
                                                :
                                                'user'
                                        }
                                        icon={<AccountCircle />}
                                        component={Link}
                                        to={
                                            this.props.name === '' ?
                                                '/login'
                                                :
                                                '/user'
                                        }
                                        className='mt-2'
                                    />
                        }
                        
                       
                    </BottomNavigation>

                </div>
            </div>
            </div>
        )
    }
}

const mapStateToProps = ({register}) => {
    return {
        loading: register.loading,
        name: register.name
    }
}

export default connect(mapStateToProps)(BottomNav);