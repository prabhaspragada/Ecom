import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../assets/cart_cross_icon.png'


const CartItems = () => {
    const {getTotalCartAmount,all_product,cartItems,removefromCart}=useContext(ShopContext);
  return (
    <div className='cartitems'>
        <div className="cartitems-format-main">
            <p>Products</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
        </div>
        <hr />
            {all_product.map((e)=>{
                if(cartItems[e.id]>0)
                {
                    return <div>
                    <div className="cartitems-format cartitems-format-main">
                        <img src={e.image} alt="" className='carticon-product-icon' />
                        <p>{e.name}</p>
                        <p>${e.new_price}</p>
                        <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                        <p>${e.new_price*cartItems[e.id]}</p>
                        <img src={remove_icon}  className='cartitems-remove-icon' onClick={()=>{removefromCart(e.id)}} alt="" />
                    </div>
                    <hr />
                </div>
                }

                return null;
            })}

            <div className='cartitems-down' >
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cart-items-total-item">
                                <p>Subtotal</p>
                                <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div  className="cart-items-total-item">
                                <p>Shipping Fee</p>
                                <p>Free</p>
                        </div>
                        <hr />
                        <div className="cart-items-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount()}</h3>
                            <button>Proceed to CHECKOUT</button>
                        </div>
                    </div>
                
                </div>

                    <div className="cartitems-promocode">
                        <p>If you have promo code enter it here</p>
                        <div className="cartitems-promobox">
                            <input type="text" placeholder='promocode' />
                            <button>Submit</button>
                        </div>
                    </div>
            </div>
    </div>
  )
}

export default CartItems