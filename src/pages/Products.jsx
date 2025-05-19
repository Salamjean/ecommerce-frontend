import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://ecommerce-backend-3-5qe9.onrender.com/api/products')
      .then(res => {
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error('Les données reçues ne sont pas un tableau:', data);
          setError('Format de données invalide');
        }
      })
      .catch(err => {
        console.error('Erreur:', err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div className="error-message">Erreur: {error}</div>;
  }

  return (
    <div className="products-page">
      <h2 style={{textAlign: 'center', marginTop: '20px'}}>Tous nos produits</h2>
      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img 
              src={product.image.startsWith('http') ? product.image : `https://ecommerce-backend-3-5qe9.onrender.com${product.image}`}
              alt={product.name}
              onError={(e) => {
                console.error(`Erreur de chargement de l'image: ${product.image}`);
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/200x200?text=Image+non+disponible';
              }}
            />
            <h3>{product.name}</h3>
            <p className="price">{product.price} Fcfa</p>
            <Link to={`/product/${product._id}`} className="view-button">
              Voir le produit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products; 