import classes from './Button.module.scss';

const Button = props => {
    return <button disabled={props.disabled} className={classes['ui__button']} onClick={props.onClick}>{props.children}</button>
}

export default Button;