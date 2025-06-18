import axios from 'axios';
import c from "ansi-colors";

function testApiConnection() {
    return new Promise((resolve, reject) => {
        axios.get(`${process.env.VUE_APP_API_URL}/load/version`)
        .then(response => {
            console.log(c.bgGreen("API connection successful:", response.data));
            resolve(true);
        })
        .catch(error => {
            console.error(c.bgRed("API connection failed: at URL "+ VUE_APP_API_URL));
            reject(false);
        });
    });
}

export default testApiConnection;