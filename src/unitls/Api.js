class Api {
    constructor({baseUrl, headers}) {
        this._baseUrl = baseUrl;
        this._headers = headers;
    }
    
    getInitialCards() {
        return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
            headers: {
                authorization: "78229750-07b7-4137-b187-46f0022d2a0c"
            }
        })
        .then(res => res.json())
        .then(cards => console.log(cards))
        .catch(err => console.error(err));
    }
}

export default Api;