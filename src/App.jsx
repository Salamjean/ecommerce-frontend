import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, createContext } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Orders from './pages/Orders'
import './App.css'

// Créer le contexte d'authentification
export const AuthContext = createContext()

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement de l'application
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + product.quantity }
          : item
      ))
    } else {
      setCart([...cart, product])
    }
  }

  const updateCart = (id, quantity) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ))
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="app">
          <Navbar cartItems={cart} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route 
                path="/product/:id" 
                element={<ProductDetail addToCart={addToCart} />} 
              />
              <Route 
                path="/cart" 
                element={
                  <Cart 
                    cartItems={cart}
                    updateCart={updateCart}
                    removeFromCart={removeFromCart}
                  />
                } 
              />
              <Route 
                path="/login" 
                element={user ? <Navigate to="/" /> : <Login />} 
              />
              <Route 
                path="/register" 
                element={user ? <Navigate to="/" /> : <Register />} 
              />
              <Route 
                path="/orders" 
                element={user ? <Orders /> : <Navigate to="/login" />} 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
