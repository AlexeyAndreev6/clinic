import React from "react";
import "./ModalDoc.css"

const Modal = ({active, setActive, children,}) => {
    return(
        <div className={active ? "modalWindow active" : "modalWindow"} onClick={() => setActive(false)}>
            <div className={active ? "modal__contentWindow active" : "modalWindow"} onClick={e => e.stopPropagation()}>
                {children}
            </div>

        </div>
    )
}

export default Modal;