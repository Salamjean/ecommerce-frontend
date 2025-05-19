import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import Swal from 'sweetalert2';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        if (!token) {
          throw new Error('Token non trouvé. Veuillez vous reconnecter.');
        }

        const response = await fetch('https://ecommerce-backend-3-5qe9.onrender.com/api/orders/my-orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la récupération des commandes');
        }

        const data = await response.json();
        console.log('Orders data:', data);
        setOrders(data);
      } catch (error) {
        console.error('Error details:', error);
        Swal.fire({
          title: 'Erreur !',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://ecommerce-backend-3-5qe9.onrender.com/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation de la commande');
      }

      // Mettre à jour la liste des commandes
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));

      Swal.fire({
        title: 'Succès !',
        text: 'La commande a été annulée',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      Swal.fire({
        title: 'Erreur !',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'processing': return '#3498db';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#2ecc71';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours de traitement';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  if (loading) {
    return <div className="loading">Chargement des commandes...</div>;
  }

  if (!user) {
    return (
      <div className="auth-required">
        <h2>Connexion requise</h2>
        <p>Veuillez vous connecter pour voir vos commandes.</p>
        <Link to="/login" className="auth-button">Se connecter</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Mes Commandes</h1>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>Vous n'avez pas encore de commandes.</p>
          <Link to="/products" className="continue-shopping">Continuer vos achats</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Commande #{order._id.slice(-6)}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div 
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusText(order.status)}
                </div>
              </div>
              <div className="order-items">
                {order.items.map(item => (
                  <div key={item._id} className="order-item">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h4>{item.product.name}</h4>
                      <p>Quantité: {item.quantity}</p>
                      <p>Prix: {item.price} Fcfa</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <div className="order-total">
                  Total: {order.totalAmount} Fcfa
                </div>
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="cancel-button"
                  >
                    Annuler la commande
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders; 