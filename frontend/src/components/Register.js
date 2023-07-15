import { useState } from 'react';
import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../utils/Auth';

export default function Register(props) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate();

  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }
  const handleChangePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password) {
      auth.register(password, email)
        .then((data) => {
          data.data && props.handleInfoTooltipClick(true)
          navigate('/sign-in', { replace: true });
        })
        .catch((e) => e && props.handleInfoTooltipClick(false))
    }
  }


  return (
    <div className='auth'>
      <form onSubmit={handleSubmit}>
        <h2 className='auth__title'>Регистрация</h2>
        <div className='auth__form'>

          <input
            type="text"
            className="auth__input"
            value={email || ''}
            name="title"
            placeholder="Email"
            minLength="2"
            maxLength="30"
            required
            onChange={handleChangeEmail} />

          <input
            type="password"
            className="auth__input"
            value={password || ''}
            name="url"
            placeholder="Пароль"
            required
            onChange={handleChangePassword} />

        </div>
        <button className="auth__btn" type="submit">Зарегистрироваться</button>
        <p className='auth__subtitle'>Уже зарегистрированны? <Link to='/sign-in' className='auth__link'> Войти</Link></p>
      </form>
    </div>
  )
}
