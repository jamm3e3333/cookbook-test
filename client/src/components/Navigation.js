import classes from './Navigation.module.scss';
import Button from './UI/Button';

const Navigation = () => {
    return (
        <nav className={classes['nav__main']}>
            <h3>Cookbook</h3>
            <p>Jakub</p>
            <Button>Log out</Button>
        </nav>
    )
}

export default Navigation;