import ModalDoc from './ModalDoc'
import React, {useState } from 'react';
import './DocCard.css'
import CloseIcon from '@mui/icons-material/Close';

function DocCard (props){
  const [modalActive, setModalActive] = useState(false)
    return(
        <div className="doctors">
        <div className="doctor">
          <img src={props.imageUrl} />
          <h2 className="doctor-name" onClick={() => setModalActive(true)}>{props.name}</h2>
          <p className="doctor-role">{props.text}</p>
        </div>
        <ModalDoc active={modalActive} setActive={setModalActive}>
          <div className='CloseIcon'> <CloseIcon className='Close' onClick={() => setModalActive(false)}></CloseIcon></div>
        <div className='modalCard'>
        <img className='DocImage' width={185} height={175} src={props.imageUrl} alt="Doc"/>
        <div className="titleModal">
            <h2>{props.name}</h2>
            <div className='infoModal'>
              <div>
            <p className="info">Специальность</p>
            <p className="informationModal">{props.text}</p>
            </div>
            <div>
            <p className="info">Опыт работы</p>
            <p className="information2Modal">{props.staj}</p>
            </div>
            <div>
            <p className="info">Образование</p>
            <p className="information3Modal">{props.obr}</p>
            <p className="information4Modal">{props.obr2}</p>
            <p className="information5Modal">{props.obr3}</p>
            </div>
            </div>
        </div>
        <div className="submit2">
                        <button type="submit" className="btn-sub">
                            Записаться к врачу
                        </button>
                    </div>
        </div> 
        </ModalDoc>
        </div>
    )
}
export default DocCard;