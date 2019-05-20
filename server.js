/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
const express = require('express');
const axios = require('axios');
const CK_API_TOKEN = 'yrASwAuzKcbFDTHRU6S8CoIl_P9h12cbcaux3ksOUWM';

const ck_api = axios.create({
    baseURL: 'https://public.api.cryptokitties.co/v1',
    headers: {'x-api-token': CK_API_TOKEN}
});

var app = express();
app.use(express.json());

const geneOddsFromIndex = [0.375, 0.094, 0.023, 0.008];
const mutationGenePairs = {
    1: {id: 16, odds: 0.25, baseGeneId: 0},
    5: {id: 17, odds: 0.25, baseGeneId: 2},
    9: {id: 18, odds: 0.25, baseGeneId: 4},
    13: {id: 19, odds: 0.25, baseGeneId: 6},
    17: {id: 20, odds: 0.25, baseGeneId: 8},
    21: {id: 21, odds: 0.25, baseGeneId: 10},
    25: {id: 22, odds: 0.25, baseGeneId: 12},
    29: {id: 23, odds: 0.25, baseGeneId: 14},
    33: {id: 24, odds: 0.25, baseGeneId: 16},
    37: {id: 25, odds: 0.25, baseGeneId: 18},
    41: {id: 26, odds: 0.25, baseGeneId: 20},
    45: {id: 27, odds: 0.25, baseGeneId: 22},
    49: {id: 28, odds: 0.125, baseGeneId: 24},
    53: {id: 29, odds: 0.125, baseGeneId: 26},
    57: {id: 30, odds: 0.125, baseGeneId: 28}
};
const addValueToObjectKey = (object, key, value) => {
    if (!object.hasOwnProperty(key)) {
        object[key] = value;
    } else {
        object[key] += value;
    };
};

const getKittyOdds = (kitty_1, kitty_2) => {
    var dna_1 = kitty_1.dna;
    var dna_2 = kitty_2.dna;
    var geneOdds = {};
    for (const trait in dna_1) {
        if (dna_1.hasOwnProperty(trait) && dna_2.hasOwnProperty(trait)) {
            geneOdds[trait] = {};

            dna_1[trait].forEach((value,index) => addValueToObjectKey(geneOdds[trait], value, geneOddsFromIndex[index]));
            dna_2[trait].forEach((value,index) => addValueToObjectKey(geneOdds[trait], value, geneOddsFromIndex[index]));

            dna_1[trait].forEach((value,index) => {
                const gene_1 = value;
                const odds_1 = geneOddsFromIndex[index];

                dna_2[trait].forEach((value,index) => {
                    const gene_2 = value;
                    const odds_2 = geneOddsFromIndex[index];

                    var genePairSum = gene_1 + gene_2;
                    if (mutationGenePairs.hasOwnProperty(genePairSum)) {
                        if (mutationGenePairs[genePairSum].baseGeneId === gene_1 || mutationGenePairs[genePairSum].baseGeneId === gene_2) {
                            const gene_3 = mutationGenePairs[genePairSum].id;
                            const odds_3 = mutationGenePairs[genePairSum].odds;
                            const mutation_odds = (odds_1 * 2) * (odds_2 * 2) * odds_3;

                            addValueToObjectKey(geneOdds[trait], gene_3, mutation_odds);
                            addValueToObjectKey(geneOdds[trait], gene_1, -mutation_odds/2);
                            addValueToObjectKey(geneOdds[trait], gene_2, -mutation_odds/2);
                        }
                    }
                })
            })
        } else {
            console.log('Error', `Trait ${trait} not recognized.`);
        }
    }
    return geneOdds;
};

const canKittiesBreed = (kitty_1, kitty_2) => {
    var id_1 = parseInt(kitty_1.id);
    var id_2 = parseInt(kitty_2.id);

    var parents_1 = [kitty_1.matron, kitty_1.sire];
    var parents_2 = [kitty_2.matron, kitty_2.sire];

    if (id_1 === parents_2[0] || id_1 === parents_2[1]) return false;
    if (id_2 === parents_1[0] || id_2 === parents_1[1]) return false;

    if (parents_1[0] === parents_2[0] || parents_1[1] === parents_2[0]) return false;
    if (parents_1[0] === parents_2[1] || parents_1[1] === parents_2[1]) return false;
    if (parents_2[0] === parents_1[0] || parents_2[1] === parents_1[0]) return false;
    if (parents_2[0] === parents_1[1] || parents_2[1] === parents_1[1]) return false;

    //if (kitty_1.is_ready === true || kitty_2.is_ready === false) return false; 

    return true;
}

const getOddsOfBreedingTraits = (kitty_1, kitty_2, desiredTraits) => {
    const id_1 = kitty_1.id;
    const id_2 = kitty_2.id;
    const kittyOdds = getKittyOdds(kitty_1, kitty_2);
    var traitBreedingOdds = {};
    var totalBreedingOdds = 1;
    for (const traitName in desiredTraits) {
        const geneId = desiredTraits[traitName];
        traitBreedingOdds[traitName] = {};

        if (kittyOdds[traitName].hasOwnProperty(geneId)) {
            const traitOdds = kittyOdds[traitName][geneId];
            traitBreedingOdds[traitName][geneId] = traitOdds;
            totalBreedingOdds *= traitOdds;
        } else {
            traitBreedingOdds[traitName][geneId] = 0;
            totalBreedingOdds = 0;
        }
    }

    return({
        id_1,
        id_2,
        traits: traitBreedingOdds,
        total: totalBreedingOdds
    });
};

const getPossibleBreedingPairs = (kittyArray) => {
    var breedingPairs = [];

    kittyArray.forEach((kitty, index) => {
        const kitty_1 = kitty;
        const index_1 = index;

        kittyArray.forEach((kitty, index) => {
            const kitty_2 = kitty;
            const index_2 = index;

            // Ensures no duplicates
            if ((index_1 !== index_2) && (index_1 > index_2)) {

                breedingPairs.push({kitty_1, kitty_2});
            }
        })
    })

    const allBreedingPairs = breedingPairs.map((breedingPair) => {
        const canBreed = canKittiesBreed(breedingPair.kitty_1, breedingPair.kitty_2);
        breedingPair['canBreed'] = canBreed ? true : false;
        return breedingPair;
    });

    var possibleBreedingPairs = [];
    allBreedingPairs.forEach((breedingPair) => {
        if (breedingPair.canBreed === true) return possibleBreedingPairs.push(breedingPair);
    });

    return possibleBreedingPairs;
}

const getBestBreedingPairs = (kittyArray, desiredTraits) => {
    const breedingPairs = getPossibleBreedingPairs(kittyArray);
    var allBreedingOdds = [];

    breedingPairs.map((breedingPair) => {
        const breedingOdds = getOddsOfBreedingTraits(breedingPair.kitty_1, breedingPair.kitty_2, desiredTraits);
        return allBreedingOdds.push(breedingOdds);
    })

    allBreedingOdds.sort((a, b) => {
        if (a.total > b.total) return -1;
        if (a.total < b.total) return 1;
        return 0;
    })

    return allBreedingOdds;
};


const getRecursiveBreedingPairs = (kittyArray, desiredTraits) => {
    var bestBreedingPairs = getBestBreedingPairs(kittyArray, desiredTraits);
    
    bestBreedingPairs.sort((a, b) => {
        if (a.total > b.total) return -1;
        if (a.total < b.total) return 1;
        return 0;
    })

    const bestBreedingPair = {
        odds: bestBreedingPairs[0].total,
        id_1: bestBreedingPairs[0].id_1,
        id_2: bestBreedingPairs[0].id_2,
        url: `https://www.cryptokitties.co/kitty/${bestBreedingPairs[0].id_1}/breed/${bestBreedingPairs[0].id_2}`
    };

    var bestpair_id_1 = bestBreedingPairs[0].id_1;
    var bestpair_id_2 = bestBreedingPairs[0].id_2;

    var newAllKittiesArray = [];
    kittyArray.forEach(kitty => {
        if (kitty.id !== bestpair_id_1 && kitty.id !== bestpair_id_2) {
            newAllKittiesArray.push(kitty)
        }
    });

    return {
        bestPair: bestBreedingPair,
        adjustedArray: newAllKittiesArray
    };
}

app.get('/kitties', async (req, res) => {
    const owner_wallet_address = req.query.owner_wallet_address;
    if (typeof owner_wallet_address === 'undefined')    return res.send('No valid query parameter.');
    if (typeof owner_wallet_address !== 'string')       return res.send('Not a valid encoding.');
    if (owner_wallet_address.length !== 42)             return res.send('Not a valid Ethereum address.');
    
    const initial_response = await ck_api.get('/kitties', { params: {owner_wallet_address} });
    const initial_data = initial_response.data;
    const initial_kitties = initial_data.kitties;

    const wallet_total = initial_data.total;

    if (initial_kitties.length < wallet_total) {
        const full_response = await ck_api.get('/kitties', { params: {owner_wallet_address, limit: wallet_total} });
        const full_data = full_response.data;
        const full_kitties = full_data.kitties;

        res.send({owner_wallet_address: owner_wallet_address, kitties: full_kitties})
    } else {
        res.send({owner_wallet_address: owner_wallet_address, kitties: initial_kitties})
    }
});

app.post('/kitties/best', async (req,res) => {
    const kitties_metadata = req.body.kitties_metadata;
    const kitties_traits = req.body.kitties_traits;

    var bestPairs = [];
    var kitties_input_array = kitties_metadata;
    for (var i = 0; i < 10; i++) {
        const analysisResults = getRecursiveBreedingPairs(kitties_input_array, kitties_traits);
        kitties_input_array = analysisResults.adjustedArray;
        bestPairs.push(analysisResults.bestPair);
    }
    
    res.send(bestPairs);
})

app.get('/kitties/sale', async(req,res) => {
    ck_api.get('/kitties', {
        params: {
            orderBy: 'current_price',
            cattributes: 'saycheese,nachocheez,dippedcone,missmuffett',

        }
    })
    .then(response => {
        res.send(response.data);
    })
})

app.get('/cattributes', async(req,res) => {
    ck_api.get('/cattributes')
    .then(response => {
        res.send(response.data);
    });
});


app.listen(8080, console.log('Server running on port 8080'));
