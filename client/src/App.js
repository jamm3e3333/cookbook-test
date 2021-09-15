import SignUp from './components/user/SignUp';
import Navigation from './components/Navigation';

import { useSelector } from 'react-redux';

function App() {
  const authUser = useSelector(state => state.auth.user);
  const authIsAuth = useSelector(state => state.auth.isAuth);
  const authToken = useSelector(state => state.auth.token);
  return (
    <>
      <Navigation />
      {authIsAuth && 
        <div>
          <p>{authUser}</p>
          <p>{authToken}</p>
        </div>
      }
      {!authIsAuth && <SignUp />}
    </>
  );
}

export default App;
