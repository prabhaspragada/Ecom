import React,{useState,useEffect} from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'
import { backend_url, currency } from "../../App";

const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([]);

    const fetchInfo = () => {
        fetch(`${backend_url}/allproducts`)
          .then((res) => res.json())
          .then((data) => setAllProducts(data))
      }
      useEffect(() => {
        fetchInfo();
      }, [])

      const removeProduct = async (id) => {
        await fetch(`${backend_url}/removeproduct`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id }),
        })
    
        fetchInfo();
      }

  return (
    <div className="listproduct">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p> <p>Title</p> <p>Old Price</p> <p>New Price</p> <p>Category</p> <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <div key={index}>
            <div className="listproduct-format-main listproduct-format">
              <img className="listproduct-product-icon" src={backend_url+product.image} alt="" />
              <p className="cartitems-product-title">{product.name}</p>
              <p>{currency}{product.old_price}</p>
              <p>{currency}{product.new_price}</p>
              <p>{product.category}</p>
              <img className="listproduct-remove-icon" onClick={() => { removeProduct(product.id) }} src={cross_icon} alt="" />
            </div>
            <hr />
          </div>
        ))}
      </div>
    
    </div>

  )
}

export default ListProduct