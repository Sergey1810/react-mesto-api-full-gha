import React from 'react'

export default function ImagePopup(props) {
  return (
    <section className={`popup popup-image ${props.card.isOpen ? 'popup_open' : null}`}>
      <div className="popup__container">
        <button className="popup__btn-close popup__btn-image-close" type="button" onClick={props.onClose}></button>
        <div>
          <img className="popup__image" alt={props.card.name} src={props.card.card && props.card.card.link} />
          <h2 className="popup__subtitle">{props.card.card && props.card.card.name}</h2>
        </div>
      </div>
    </section>
  )
}
