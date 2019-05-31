const kittiesCanBreed = require('./kittiesCanBreed');

const filterBreedableKitties = (kittyArray) => {
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
        const canBreed = kittiesCanBreed(breedingPair.kitty_1, breedingPair.kitty_2);
        breedingPair['canBreed'] = canBreed ? true : false;
        return breedingPair;
    });

    var possibleBreedingPairs = [];
    allBreedingPairs.forEach((breedingPair) => {
        if (breedingPair.canBreed === true) return possibleBreedingPairs.push(breedingPair);
    });

    return possibleBreedingPairs;
}

module.exports = filterBreedableKitties;