const apiAdapter = require('../utils/apiAdapter');
const axios = require('axios');
// const fetch = require('node-fetch');

const baseUrllXml = "https://covid19.go.id/";
const baseUrlJson = "https://data.covid19.go.id/";


const edukasiCovid19 = async () => {
    try {
        const api = apiAdapter(baseUrllXml, {
            "Accept": 'application/xml'
        });
        let request = await api.get("/feed/masyarakat-umum");
        // let result = await request.json();

        console.log(result);
        return result.data;
    } catch (error) {
        throw error;
    }
}
async function kasusCovidHarian() {
    try {
        const api = apiAdapter(baseUrlJson, {
            "Accept": 'application/json'
        });
        let result = await api.get("/public/api/update.json");
        return result.data;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    kasusCovidHarian,
    edukasiCovid19
}
