import { useRef, useState } from 'react';
import { authActions } from '../../store/auth-slice';
import { useDispatch } from 'react-redux';

import Cart from '../UI/Cart';
import classes from './SignUp.module.scss';
import Button from '../UI/Button';



const SignUp = () => {
    const inputNameRef = useRef();
    const inputEmailRef = useRef();
    const inputPassRef = useRef();

    const dispatch = useDispatch();

    const [error, setError] = useState(false);

    const postUser = async () => {
        try{
            setError(false);
            const response = await fetch('http://localhost/api/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nick: inputNameRef.current.value,
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
            dispatch(authActions({
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
                <h2>Sign up user</h2>
                <div>
                    <label htmlFor="nick">Nick</label>
                    <input type="text" ref={inputNameRef} />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" ref={inputEmailRef} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" ref={inputPassRef} />
                </div>
                <div>
                    <Button>Sign up</Button>
                </div>
            </form>
        </Cart>
    )
}

export default SignUp;