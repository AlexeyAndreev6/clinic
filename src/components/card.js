import "./card.css";
import React from "react";

function Card ({id, nameServices, price, description, onPlus}){
const [isAdded, setIsAdded]=React.useState(false);

const onClickPlus = () => {
    onPlus({id, nameServices, price});
    setIsAdded(!isAdded);
}
    return(
        <div className="card">
            <div>
            <h6 className="title">{nameServices}</h6>
            <p className="title">{description}</p>
            </div>
            <div className="cardInfo">
                <div className="price">{price}</div>
            </div>
            <div>
                <div>
                    <img className="plus" onClick={onClickPlus} width={50} height={25} src={isAdded? "/img/btn-plus.svg" : "/img/btn-plus.svg"} alt="Plus"/>
                </div>
            </div>
            </div>
            )
}
export default Card;