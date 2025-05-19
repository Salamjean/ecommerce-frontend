import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.css';
import { AuthContext } from '../App';

function Cart({ cartItems, updateCart, removeFromCart }) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateCart(id, newQuantity);
  };

  const handleCheckout = async () => {
    if (!user) {
      Swal.fire({
        title: 'Connexion requise',
        text: 'Veuillez vous connecter pour passer commande.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Se connecter',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    setIsCheckingOut(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé. Veuillez vous reconnecter.');
      }

      // Préparer les données de la commande
      const orderData = {
        items: cartItems.map(item => ({
          product: item._id || item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        shippingAddress: {
          street: user.address || '',
          city: user.city || '',
          postalCode: user.postalCode || '',
          country: user.country || ''
        },
        paymentMethod: 'Carte bancaire'
      };

      console.log('Données de la commande:', orderData);

      // Envoyer la commande au serveur
      const response = await fetch('https://ecommerce-backend-3-5qe9.onrender.com/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la commande');
      }

      const result = await Swal.fire({
        title: 'Commande réussie !',
        text: 'Votre commande a été passée avec succès.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#2ecc71',
        background: '#fff',
        customClass: {
          popup: 'animated fadeInDown'
        }
      });

      if (result.isConfirmed) {
        // Vider le panier après confirmation
        cartItems.forEach(item => removeFromCart(item.id));
        // Rediriger vers la page des commandes
        navigate('/orders');
      }
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      Swal.fire({
        title: 'Erreur !',
        text: error.message || 'Une erreur est survenue lors de la commande.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Votre panier est vide</h2>
        <Link to="/products" className="continue-shopping">
          Continuer vos achats
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Votre panier</h1>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img 
              src={item.image.startsWith('http') ? item.image : `https://ecommerce-backend-3-5qe9.onrender.com${item.image}`}
              alt={item.name}
              onError={(e) => {
                console.error(`Erreur de chargement de l'image: ${item.image}`);
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/100x100?text=Image+non+disponible';
              }}
            />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="price">{item.price} Fcfa</p>
            </div>
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
            </div>
            <button 
              className="remove-item"
              onClick={() => removeFromCart(item.id)}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Résumé de la commande</h2>
        <div className="summary-row">
          <span>Sous-total</span>
          <span>{total} Fcfa</span>
        </div>
        <div className="summary-row">
          <span>Livraison</span>
          <span>Gratuite</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>{total} Fcfa</span>
        </div>
        <button 
          className="checkout-button"
          onClick={handleCheckout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? 'Traitement...' : 'Passer la commande'}
        </button>
      </div>
    </div>
  );
}

export default Cart; 