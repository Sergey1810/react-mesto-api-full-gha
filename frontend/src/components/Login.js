import React, { useState } from 'react'
import { auth } from '../utils/Auth'
import { useNavigate } from 'react-router-dom'

export default function Login(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            return;
        }
        auth.authorize(password, email)
            .then((data) => {
                data.token && props.handleInfoTooltipClick(true)
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    setEmail('');
                    setPassword('');
                    props.handleLogin();
                    navigate('/', { replace: true });
                }
            })
            .catch((e) => e && props.handleInfoTooltipClick(false));
    }

    return (
        <div className='auth'>
            <form onSubmit={handleSubmit}>
                <h2 className='auth__title'>Вход</h2>
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
                        onChange={onChangeEmail} />

                    <input
                        type="password"
                        className="auth__input"
                        value={password || ''}
                        name="url"
                        placeholder="Пароль"
                        required
                        onChange={onChangePassword} />

                </div>
                <button className=" auth__btn" type="submit">Войти</button>
            </form>
        </div>
    )
}
