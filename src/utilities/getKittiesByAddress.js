import axios from 'axios';

const getKittiesByAddress = (web3) => {
    return new Promise(async (resolve,reject) => {
        if (web3) {
            web3.eth.getAccounts()
                .then(accounts => {
                    return axios.get('https://h1u5les3u1.execute-api.us-east-1.amazonaws.com/v1/kitties', {params: {owner_wallet_address: accounts[0]}})
                })
                .then(response => {
                    resolve(response.data.kitties)
                })
                .catch(error => {
                    reject(error);
                });
        } else {
            reject('No web3 detected.');
        }
    })
}

export default getKittiesByAddress