import React from 'react'

export default function PopupWithForm(props) {
      
  return (
   <section className={`popup popup-${props.name} ${props.isOpen ? 'popup_open' : ''}`}>
    <div className="popup__container">
      <button className={`popup__btn-close popup__btn-${props.name}-close`} onClick = {props.onClose} type="button"></button>
      <form className={`popup__form popup__form-${props.name}`} name={props.name} onSubmit={props.onSubmit}>  
        <h2 className="popup__title">{props.title}</h2>
        {props.children}
        <button className="popup__btn-save" type="submit">Сохранить</button>
      </form>
    </div>
  </section>
  )
}
