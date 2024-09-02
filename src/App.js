
import './App.css';
import Navbar  from './components/Navbar/Navbar';
import{BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Shop from './Pages/Shop';
import  Shopcategory  from './Pages/Shopcategory';
import Product  from './Pages/Product';
import LoginSignup from './Pages/LoginSignup';
import Cart from './Pages/Cart';
import Footer from './components/Footer/Footer';
import men_banner from './components/assets/banner_mens.png'
import women_banner from './components/assets/banner_women.png'
import kid_banner from './components/assets/banner_kids.png'

export const backend_url = 'http://localhost:4000';
export const currency = '₹';


function App() {
  return (
    <div >
      <Router>
      
     <Navbar/>
     <Routes>
      <Route path='/' element={<Shop/>}/>
      <Route path='/men' element={<Shopcategory banner={men_banner} category="men"/>}/>
      <Route path='/women' element={<Shopcategory banner={women_banner} category="women"/>}/>
      <Route path='/kids' element={<Shopcategory banner={kid_banner} category="kid"/>}/>
      <Route path="/product" element={<Product/>}>
        <Route path=":productId" element={<Product/>}/>
      </Route>
      <Route path='/' element={<Shop/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/login' element={<LoginSignup/>}/>
      </Routes>
      <Footer/>
    
     </Router>
    </div>
  );
}

export default App;
