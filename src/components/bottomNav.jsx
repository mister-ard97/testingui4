import React, {Component} from 'react'
import { makeStyles, BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import { Home, Restore, Favorite, LocationCity, Folder, AccountCircle} from '@material-ui/icons'

const useStyles = makeStyles({
    root: {
       // width: '500px'
    },
})

class BottomNav extends Component{
    state={
        value : 'home'
    }

    handleChange=(event)=>{
        this.setState({value: event})
    }
    render(){
        const { root } = useStyles
        return(
            <div className='container'>
                <div className='row'>
                <div style={{position: 'fixed', bottom: 0, left: '-0.2%'}} className='offset-3 col-6'>
                    <BottomNavigation value={this.state.value} onChange={this.handleChange} className={root}>
                        <BottomNavigationAction lable="Home" value='home' icon={<Home/>}/>
                        <BottomNavigationAction lable="Recents" value='recents' icon={<Restore/>}/>
                        <BottomNavigationAction lable="Folder" value='folder' icon={<Folder/>}/>
                        <BottomNavigationAction lable="nearby" value='nearby' icon={<AccountCircle/>}/>
                    </BottomNavigation>
                </div>
            </div>
            </div>
        )
    }
}

export default BottomNav;