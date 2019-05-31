const kittyBreedingOdds = require('./kittyBreedingOdds');

const traitBreedingOdds = (kitty_1, kitty_2, desiredTraits) => {
    const id_1 = kitty_1.id;
    const id_2 = kitty_2.id;
    const kittyOdds = kittyBreedingOdds(kitty_1, kitty_2);

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

module.exports = traitBreedingOdds;