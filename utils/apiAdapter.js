const axios = require('axios');

module.exports = (baseURL, headers) => {
    console.log(baseURL);

    return axios.create({
        baseURL: baseURL,
        timeout: 20000,
        headers: headers
    })
}