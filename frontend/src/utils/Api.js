
export class Api {
    constructor(options) {
      this.baseUrl = options.baseUrl;
      this.headers = options.headers;
    }
    _checkResponse(res){
        if(res.ok){
            return res.json()
        }
        return Promise.reject(`Ошибка: ${res.status}`)
    }

    getUserInfo(){
       return fetch(`${this.baseUrl}/users/me`, {
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
            })
            .then((res) => {return this._checkResponse(res)})
        }
  
    getInitialCards() {
       return fetch(`${this.baseUrl}/cards`, {
        headers: {
          'Authorization': `${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
        })
        .then((res) => {return this._checkResponse(res)})
    }

    setUserInfo(name, about){
    return fetch(`${this.baseUrl}/users/me`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify({
              name: `${name}`,
             about: `${about}`
            })})
            .then(res => {return this._checkResponse(res)})
    }

    setAddCard(name, link){
    return fetch(`${this.baseUrl}/cards`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
              name: `${name}`,
              link: `${link}`
             })   
         })
         .then(res => {return this._checkResponse(res)})
        }

    setDeleteCard(id){ 
    return fetch(`${this.baseUrl}/cards/${id}`, {
            method: 'DELETE',
            headers: this.headers,
            })
            .then(res => {return this._checkResponse(res)})
    }  

    setAddLike(id){
        return fetch(`${this.baseUrl}/cards/${id}/likes`, {
                method: 'PUT',
                headers: this.headers,
             }) 
             .then(res => {return this._checkResponse(res)})
    }

    setRemoveLike(id){
          return fetch(`${this.baseUrl}/cards/${id}/likes`, {
                method: 'DELETE',
                headers: this.headers,
             })
             .then(res => {return this._checkResponse(res)})
    }

    setChangeAvatar(url){
      return fetch(`${this.baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({
        avatar: `${url}`
        })})
      .then(res => {return this._checkResponse(res)})
    }
  }

  export const api = new Api({
    baseUrl: 'https://sergeyback.nomoredomains.xyz',
    headers: {
      'Authorization': `${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  }); 