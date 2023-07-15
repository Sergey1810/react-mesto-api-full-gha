import React from 'react'
import {useState, useContext, useEffect} from 'react'
import PopupWithForm from './PopupWithForm'
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function EditProfilePopup(props) {
 
  const [name, setName] = useState(null)
  const [description, setDescription] = useState(null)

  const currentUser = useContext(CurrentUserContext);
  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]); 

    const onChangeName = (e) => {
        setName(e.target.value)
    }

    const onChangeDescripton = (e) => {
        setDescription(e.target.value)
    }

    function handleSubmit(e) {
        e.preventDefault();
       
        props.onUpdateUser({
          name,
          about: description,
        });
      } 

  return (
    <PopupWithForm isOpen={props.isOpen}  onClose={props.onClose} name = 'profile' title = 'Редактировать профиль' onSubmit={handleSubmit}> 
    <div className = "popup__field">
      <input type = "text" className = "popup__input popup__input_type_name" value = {name || ''} name="name" minLength="2" maxLength="40" required onChange={onChangeName}/>
      <span className = "popup__error-message name-input-error"></span>
    </div>
    <div className = "popup__field">
      <input type="text" className ="popup__input popup__input_type_job" value = {description || ''} name="job" minLength="2" maxLength="200" required onChange={onChangeDescripton}/>
      <span className ="popup__error-message job-input-error"></span>
    </div>
  </PopupWithForm>
  )
}
