import classes from './Navigation.module.scss';
import Button from './UI/Button';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/auth-slice';


const Navigation = props => {
    
    const dispatch = useDispatch();
    const iaAuth = useSelector(state => state.auth.isAuth);

    const logOutHandler = () => {
        dispatch(authActions.signOut());
    }
    return (
        <nav className={classes['nav__main']}>
            <h3>Cookbook</h3>
            {/* {props.name && <p>{props.name}</p>} */}
            <Button disabled={!iaAuth} onClick={logOutHandler}>Log out</Button>
        </nav>
    )
}

export default Navigation;