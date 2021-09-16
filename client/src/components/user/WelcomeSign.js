import Button from '../UI/Button';
import Cart from '../UI/Cart';

import { authActions } from '../../store/auth-slice';
import { useDispatch } from 'react-redux';

import classes from './WelcomeSign.module.scss';

const WelcomeSign = () => {
    const dispatch = useDispatch();

    const signInHandler = () => {
        dispatch(authActions.changePage(1));
    }

    const signUpHandler = () => {
        dispatch(authActions.changePage(2));
    }

    return(
        <Cart className={classes['welcome__cart']}>
            <h2>Sign up or sign in.</h2>
            <div className={classes['pic__holder']}>
            </div>
            <div>
                <Button onClick={signInHandler} >Sign In</Button>
                <Button onClick={signUpHandler} >Sign Up</Button>
            </div>
        </Cart>
    )
}

export default WelcomeSign;