// excerpt frontend/src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, signOut } = React.useContext(AuthContext);

  return (
    <nav className="nav">
      <Link to="/">Home</Link>
      <Link to="/search">Search</Link>
      <Link to="/about">About</Link>

      <span className="spacer" />

      {user ? (
        <>
          <span>Hello&nbsp;{user.username}</span>
          <button onClick={signOut}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}

