import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';

function Navbar({ cartItems }) {
  const { user, logout } = useContext(AuthContext);
  const cartItemsCount = cartItems ? cartItems.length : 0;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">E-Shop</Link>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Accueil</Link>
        <Link to="/products" className="navbar-item">Produits</Link>
      </div>
      <div className="navbar-end">
        {user ? (
          <>
            <div className="navbar-user">
              <span>👤 {user.name}</span>
            </div>
            <Link to="/orders" className="navbar-button">
              Mes Commandes
            </Link>
            <button onClick={handleLogout} className="navbar-button">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-button">
              Connexion
            </Link>
            <Link to="/register" className="navbar-button">
              Inscription
            </Link>
          </>
        )}
        <Link to="/cart" className="navbar-cart">
          🛒
          {cartItemsCount > 0 && (
            <span className="cart-count">{cartItemsCount}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar; 