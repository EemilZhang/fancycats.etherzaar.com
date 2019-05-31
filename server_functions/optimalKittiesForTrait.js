const filterBreedableKitties = require('./filterBreedableKitties');
const traitBreedingOdds = require('./traitBreedingOdds');

const optimalKittiesForTrait = (kittyArray, desiredTraits) => {
    const breedingPairs = filterBreedableKitties(kittyArray);
    var allBreedingOdds = [];

    breedingPairs.map((breedingPair) => {
        const breedingOdds = traitBreedingOdds(breedingPair.kitty_1, breedingPair.kitty_2, desiredTraits);
        return allBreedingOdds.push(breedingOdds);
    })

    allBreedingOdds.sort((a, b) => {
        if (a.total > b.total) return -1;
        if (a.total < b.total) return 1;
        return 0;
    })

    return allBreedingOdds;
};

module.exports = optimalKittiesForTrait;