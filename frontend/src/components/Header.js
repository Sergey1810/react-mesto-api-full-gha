import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../index.css'


export default function Header(props) {
  const [mobileActive, setMobileActive] = useState(false)

  const handleMobileNav = () => {
    setMobileActive(!mobileActive)
  }

  const navigate = useNavigate()

  function singOut() {
    localStorage.removeItem('token')
    props.handleLoginOut()
    navigate('/sign-in')
  }

  const location = useLocation()


  return (
    <header className="header">
     {location.pathname === '/' && <div className={`header__info-mobile ${mobileActive && 'header__info-mobile_active'}`}>
        <p className='header__title'>{props.userData}</p>
        {props.isAuth ? <button className='header__button' onClick={singOut}>Выйти</button> : null}
      </div>}
      <div className='header__container'>
        <div className="header__logo"></div>
        <nav className="menu">
          {location.pathname === '/sign-up' && <Link to="/sign-in" className='menu__item'>Войти</Link>}
          {location.pathname === '/sign-in' && <Link to="/sign-up" className='menu__item'>Регистрация</Link>}
        </nav>
        {location.pathname === '/' && <div className='header__info'>
          <p className='header__title'>{props.userData}</p>
          {props.isAuth ? <button className='header__button' onClick={singOut}>Выйти</button> : null}
        </div>}
        {location.pathname === '/' && <button className={`header__nav ${mobileActive && 'header__nav_opened'}`} onClick={handleMobileNav} />}
      </div>
    </header>
  )
}
