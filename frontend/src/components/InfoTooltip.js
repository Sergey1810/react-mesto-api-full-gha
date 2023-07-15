import React from 'react'
import success from '../images/success.png'
import errors from '../images/error.png'

export default function InfoTooltip(props) {

    return (
        <section className={`popup  ${props.isOpen ? 'popup_open' : ''}`}>
            <div className="popup__container">
                <button className={`popup__btn-close `} onClick={props.onClose} type="button"></button>
                <div className='popup__form'>
                    <div className='popup__tooltip'>
                        <img src={props.toolTipStatus ? success : errors} alt='статус' className='popup__toolTip-img' />
                        <h2 className="popup__title popup__tooltip-title">{props.toolTipStatus ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}</h2>
                    </div>
                </div>
            </div>
        </section>
    )
}
