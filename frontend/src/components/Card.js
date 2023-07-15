import React from 'react'
import clear from '../images/clear.svg'
import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function Card(props) {

  const users = useContext(CurrentUserContext)
  const isOwn = props.card.owner === users._id;

  const handleDeleteClick = () =>{ 
    props.onCardDelete(props.card._id)
  }
  const isLiked = props.card.likes.some(i => i === users._id);

  const cardLikeButtonClassName = ( 
    `element__like ${isLiked && 'element__like_active'}` 
  );

  function handleClick() {
    props.onCardClick({
      link:props.card.link,
      name:props.card.name});
  }  

  function handleLikeClick(){
    props.onCardLike({card:props.card})
  }

  return (  
  <div className="element">
    <img className="element__image" alt = {props.card.name} src = {props.card.link} onClick = {handleClick}/>
     <img src={clear} alt="корзина" className={`element__clear ${isOwn && 'element__clear_visible'}`} onClick={handleDeleteClick}/> 
    <div className="element__block">
      <h2 className="element__title">{props.card.name}</h2>
      <div className='element__likes'>
        <button type="button" className={cardLikeButtonClassName} onClick = {handleLikeClick}></button>
        <p className="element__like-info">{props.card.likes.length}</p>
      </div>
    </div>
  </div>
  )
}
