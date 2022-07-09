import React from "react";
import Card from "../../components/card";
import "./services.css";
import Drawer from "./Drawer";
import axios from 'axios';
export default function Services() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([false]);
  const totalPrice = cartItems.reduce((sum, obj) => obj.price + sum,0);
  React.useEffect(() => {
    axios.get ('https://62761d4dbc9e46be1a12ec26.mockapi.io/items').then ((res) =>{
      setItems(res.data);
    })
    axios.get ('https://62761d4dbc9e46be1a12ec26.mockapi.io/cart').then ((res) =>{
      setCartItems(res.data);
    })
  }, []);

  const onAddToCart = (obj)=>{
    if (cartItems.find((item)=>Number(item.id) === Number(obj.id))) {
    setCartItems((prev) =>prev.filter((item)=>Number(item.id) !== Number(obj.id)));
  } else {
    axios.post ('https://62761d4dbc9e46be1a12ec26.mockapi.io/cart', obj);
    setCartItems((prev) =>[...prev, obj]);
          }
  };

  const onRemoveItem=(id) =>{
    axios.delete (`https://62761d4dbc9e46be1a12ec26.mockapi.io/cart/${id}`);
    setCartItems((prev) =>prev.filter(item=>item.id != id));
  };
  return (
  <div>
    <div className="header-title">
    <h2>Анализы</h2> 
    </div>
    <div className="Servic">
      <div>
      {items.map((it) => (
        <Card nameServices={it.nameServices} price={it.price}  description={it.description}
        onPlus={(obj)=>onAddToCart(obj)}/>
      ))}
      </div>
      <Drawer items={cartItems} onRemove={onRemoveItem} total={totalPrice}/>
    </div>
  </div>
  );
}
