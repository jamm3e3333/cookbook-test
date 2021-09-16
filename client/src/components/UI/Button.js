import classes from './Button.module.scss';

const Button = props => {
    return <button type={props.type} disabled={props.disabled} className={classes['ui__button']} onClick={props.onClick}>{props.children}</button>
}

export default Button;