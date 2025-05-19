import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
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
          setFeaturedProducts(data.slice(0, 3));
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
    <div className="home">
      <section className="hero">
        <h1>Bienvenue sur notre boutique</h1>
        <p>Découvrez nos produits de qualité à prix compétitifs</p>
        <Link to="/products" className="cta-button">Voir les produits</Link>
      </section>

      <section className="featured-products">
        <h2>Produits en vedette</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div key={product._id} className="product-card">
              <img 
                src={product.image.startsWith('http') ? product.image : `https://ecommerce-backend-3-5qe9.onrender.com${product.image}`} 
                alt={product.name}
                onError={(e) => {
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
      </section>
    </div>
  );
}

export default Home; 