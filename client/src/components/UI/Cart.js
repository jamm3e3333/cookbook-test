import classes from './Cart.module.scss';

const Cart = props => {
    return <div className={`${classes.cart} ${props.className}`}>{props.children}</div>
}

export default Cart;