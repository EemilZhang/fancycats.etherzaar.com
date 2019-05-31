const optimalKittiesForTrait = require('./optimalKittiesForTrait');

const allOptimalKittiesForTrait = (kittyArray, desiredTraits) => {
    var bestBreedingPairs = optimalKittiesForTrait(kittyArray, desiredTraits);
    
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

module.exports = allOptimalKittiesForTrait;