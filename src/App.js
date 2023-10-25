import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import Downloadandupload from './Downloadandupload';
import { CreateNewUser } from './components/CreateNewUser';
import { LoginExistingUser } from './components/LoginExistingUser';
import Navbar from './components/Navbar';
import { useState } from 'react';
import { auth } from './firebaseInit';
import { signOut } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(!!auth?.currentUser?.email);
  console.log(auth?.currentUser?.email);

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar user={user} logOut={logOut} />
      <Routes>
        <Route path="/" element={<LoginExistingUser user={user} setUser={setUser} />} />
        <Route path="/Signup" element={<CreateNewUser user={user} setUser={setUser} />} />
        <Route path="/dandu" element={<RequireAuth redirectTo="/">
          <Downloadandupload />
        </RequireAuth>} />
      </Routes>

    </>
  );
}
function RequireAuth({ children, redirectTo }) {
  let isAuthenticated = !!auth?.currentUser?.email;
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
}

export default App;
