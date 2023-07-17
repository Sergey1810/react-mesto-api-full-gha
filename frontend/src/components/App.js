import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import ImagePopup from "./ImagePopup";
import { api } from '../utils/Api'
import { auth } from '../utils/Auth'
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Login";
import ProtectedRouteElement from "./ProtectedRoute";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip"

function App() {
  const [currentUser, setCurrentUser] = useState({})
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isInfoTooltip, setInfoTooltip] = useState(false)
  const [selectedCard, setSelectedCard] = useState({ isOpen: false })
  const [cards, setCards] = useState([])
  const [isAuth, setIsAuth] = useState(false)
  const [userData, setUserData] = useState(null)
  const [isToolTipStatus, setTooltipStatus] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    handleTokenCheck();
  }, [navigate])

  const handleTokenCheck = () => {
    if (localStorage.getItem('token')) {
      const jwt = localStorage.getItem('token');
      auth.checkToken(jwt)
        .then((res) => {
          if (res) {
            setUserData(res.email)
            setIsAuth(true);
            navigate("/", { replace: true })
          }
        })
        .catch((e) => console.log(e));
    }
  }

  const handleLogin = () => {
    setIsAuth(true);
  }

  const handleLoginOut = () => {
    setUserData('')
    setIsAuth(false)
  }

  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard.isOpen || isInfoTooltip

  useEffect(() => {
    function closeByEscape(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen])

  useEffect(() => {
    if(isAuth){
      api.getUserInfo().then((users) => {
        setCurrentUser(users)
      })
      .catch((e) => console.log(e))
  }}, [isAuth])

  useEffect(() => {
    if(isAuth){
      api.getInitialCards().then((cards) => {
        setCards(cards)
      })
        .catch((e) => console.log(e))
    }
  }, [isAuth])

  const handleCardClick = (card) => {
    setSelectedCard({
      card: card,
      isOpen: true
    })
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setSelectedCard({ isOpen: false })
    setInfoTooltip(false)
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen)
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen)
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen)
  }

  const handleInfoTooltipClick = (status) => {
    setInfoTooltip(!isInfoTooltip)
    setTooltipStatus(status)
  }

  function handleCardLike(item) {

    if (item.card.likes.some(like => like === currentUser._id)) {
      api
        .setRemoveLike(item.card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === item.card._id ? newCard : c));
        })
        .catch(err => console.log(err))
    } else {
      api
        .setAddLike(item.card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === item.card._id ? newCard : c));
        })
        .catch(err => console.log(err))
    }
  }

  function handleCardDelete(id) {
    api
      .setDeleteCard(id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== id))
      })
      .catch(err => console.log(err))
  }

  const handleUpdateUser = (user) => {
    api
      .setUserInfo(user.name, user.about)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch(err => console.log(err))
  }

  const handleUpdateAvatar = (avatar) => {
    api
      .setChangeAvatar(avatar)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch(err => console.log(err))
  }

  const handleAddPlaceSubmit = (card) => {
    api
      .setAddCard(card.name, card.link)
      .then((newCard) => {
        setCards([newCard, ...cards])
        closeAllPopups()
      })
      .catch(err => console.log(err))
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header isAuth={isAuth} userData={userData} handleLoginOut={handleLoginOut} />
          <Routes>
            <Route path='/sign-in' element={<Login handleLogin={handleLogin} handleInfoTooltipClick={handleInfoTooltipClick} />} />
            <Route path='/sign-up' element={<Register handleInfoTooltipClick={handleInfoTooltipClick} />} />
            <Route path='/'
              element={<ProtectedRouteElement element={Main}
                isAuth={isAuth}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                cards={cards}
                onCardDelete={handleCardDelete} />} />
            <Route path='*' element={<Login handleLogin={handleLogin} />} />
          </Routes>

          <Footer />
        </div>
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddCard={handleAddPlaceSubmit} />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <InfoTooltip isOpen={isInfoTooltip} onClose={closeAllPopups} toolTipStatus={isToolTipStatus} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
