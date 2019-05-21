import axios from 'axios';

const getKittyBreedingPairs = (kitties_metadata, traits) => {
    return new Promise(async (resolve,reject) => {
        if (kitties_metadata) {
            var ready_kitties = [];
            kitties_metadata.forEach(value => {
              if (value.isReady) ready_kitties.push(value);
            });
      
            axios.post('https://h1u5les3u1.execute-api.us-east-1.amazonaws.com/v1/kitties/best', {
              kitties_metadata: ready_kitties,
              kitties_traits: traits
            })
              .then((response) => {
                    resolve(response.data);
                    const optimalPairs = response.data;
                    this.setState({optimalPairs})
              })
              .catch((error) => {
                    reject(error);
              })
        } else {
            reject('No kitties_metadata array.');
        }
    })
}

export default getKittyBreedingPairs;