import { useSelector } from 'react-redux';

import SignIn from './components/user/SignIn';
import SignUp from './components/user/SignUp';
import Navigation from './components/Navigation';
import WelcomeSign from './components/user/WelcomeSign';

function App() {
  const authUser = useSelector(state => state.auth.user);
  const authIsAuth = useSelector(state => state.auth.isAuth);
  const authToken = useSelector(state => state.auth.token);
  const authPage = useSelector(state => state.auth.page);
  console.log(authUser);
  return (
    <>
      <Navigation />
      {(!authIsAuth && authPage === 2) && <SignUp />}
      {(!authIsAuth && authPage === 1) && <SignIn />}
      {(!authIsAuth && authPage === 0) && <WelcomeSign />}
    </>
  );
}

export default App;
