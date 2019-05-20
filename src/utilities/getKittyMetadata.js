import * as moment from 'moment';
import parseKittyMetadata from './parseKittyMetadata';

const getKittyMetadata = (kitties_array, web3) => {
    return new Promise(async (resolve,reject) => {
        if (kitties_array.length > 0 && web3) {
            var kitty_id_array = [];
            kitties_array.forEach(
            (value) => { kitty_id_array.push(value.id) }
            );
    
            var kitties_metadata_array = [];
            var kitties_metadata_object = {};

            var responseQueue = [];
            var counter = 0;
            var metaCounter = 0;
            for (var i = 0; i < kitty_id_array.length; i++) {
                var kitty_id = kitty_id_array[i];
                var id_hex = ("000000" + parseInt(kitty_id).toString(16)).substr(-6);
                var response = web3.eth.call({
                    to: "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d", // contract address
                    data: "0xe98b7f4d0000000000000000000000000000000000000000000000000000000000" + id_hex
                });
                responseQueue.push(response);
                counter += 1;
                
                if (counter % 30 === 0 || ((i === kitty_id_array.length - 1) && (responseQueue.length > 0))) {
                    var responseResults = await Promise.all(responseQueue);
                    for (var k = 0; k < responseResults.length; k++) {
                        var kitty_metadata = parseKittyMetadata(responseResults[k]);
                        var id = kitty_id_array[metaCounter + k];
                        kitty_metadata['id'] = id;
                        kitties_metadata_array.push(kitty_metadata);
                        kitties_metadata_object[id] = kitty_metadata;
                    }
                    responseQueue = [];
                    counter = 0;
                    metaCounter += 30;
                }
            }

            resolve({array: kitties_metadata_array, object: kitties_metadata_object, timeStamp: moment()});
        } else {
            reject();
        }
    })
}

export default getKittyMetadata;