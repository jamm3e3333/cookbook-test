import { useRef, useState } from 'react';
import { authActions } from '../../store/auth-slice';
import { useDispatch } from 'react-redux';

import Cart from '../UI/Cart';
import classes from './SignUp.module.scss';
import Button from '../UI/Button';



const SignIn = () => {
    const inputEmailRef = useRef();
    const inputPassRef = useRef();

    const dispatch = useDispatch();

    const [error, setError] = useState(false);


    const backHomeHandler = () => {
        dispatch(authActions.changePage(0));
    }

    const postUser = async () => {
        try{
            setError(false);
            const response = await fetch('api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: inputEmailRef.current.value,
                    password: inputPassRef.current.value,
                })
            });
            if(!response.ok) {
                throw new Error();
            }
            const data = await response.json();
            if(!data) {
                throw new Error();
            }
            dispatch(authActions.signUp({
                _id: data.user._id,
                email: data.user.email,
                nick: data.user.nick,
                token: data.token
            }))

        }
        catch(e) {
            setError(true);
        }
    }
    const formSubmitHandler = e => {
        e.preventDefault();
        postUser();
    }

    
    return (
        <Cart className={classes['cart__div']}>
            <form onSubmit={formSubmitHandler} className={classes['signup__form']}>
                <h2>Sign in user</h2>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" ref={inputEmailRef} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" ref={inputPassRef} />
                </div>
                <div>
                    <Button onClick={backHomeHandler} >Back</Button>
                    <Button type={'submit'}>Sign in</Button>
                </div>
            </form>
        </Cart>
    )
}

export default SignIn;