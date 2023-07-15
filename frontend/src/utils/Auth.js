
class Auth {
    constructor(options) {
        this.baseUrl = options.baseUrl;
    }
    _checkResponse(res) {
        if (res.ok) {
            return res.json()
        }
        return Promise.reject(`Ошибка: ${res.status}`)
    }

    register(password, email) {
        return fetch(`${this.baseUrl}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, email })
        })
            .then(res => { return this._checkResponse(res) })
    }

    authorize(password, email) {
        return fetch(`${this.baseUrl}/signin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, email })
        })
            .then(res => { return this._checkResponse(res) })
    };

    checkToken(token) {
        return fetch(`${this.baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${token}`,
            }
        })
            .then(res => { return this._checkResponse(res) })
    }
}

export const auth = new Auth({
    baseUrl: 'https://sergeyback.nomoredomains.xyz',
}); 
