import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetch(`https://ecommerce-backend-3-5qe9.onrender.com/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <div>Chargement...</div>;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="product-detail">
      <div className="product-image">
        {!imageError ? (
          <img 
            src={product.image.startsWith('http') ? product.image : `https://ecommerce-backend-3-5qe9.onrender.com${product.image}`}
            alt={product.name} 
            onError={handleImageError}
          />
        ) : (
          <div className="image-placeholder">
            Image non disponible
          </div>
        )}
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="price">{product.price} Fcfa</p>
        <div className="quantity-selector">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>
        <button 
          className="add-to-cart"
          onClick={() => {
            const productToAdd = {
              _id: product._id,
              id: product._id,
              name: product.name,
              price: product.price,
              image: product.image,
              quantity: quantity
            };
            addToCart(productToAdd);
          }}
        >
          Ajouter au panier
        </button>
        <div className="product-description">
          <h2>Description</h2>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail; 