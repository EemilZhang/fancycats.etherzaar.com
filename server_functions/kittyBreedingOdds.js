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

const kittyBreedingOdds = (kitty_1, kitty_2) => {
    var dna_1 = kitty_1.dna;
    var dna_2 = kitty_2.dna;
    var geneOdds = {};

    for (const trait in dna_1) {
        if (dna_1.hasOwnProperty(trait) && dna_2.hasOwnProperty(trait)) {
            geneOdds[trait] = {};

            dna_1[trait].forEach((value,index) => geneOdds[trait][value] = (geneOdds[trait][value] + geneOddsFromIndex[index]) || geneOddsFromIndex[index]);
            dna_2[trait].forEach((value,index) => geneOdds[trait][value] = (geneOdds[trait][value] + geneOddsFromIndex[index]) || geneOddsFromIndex[index]);

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
                            
                            geneOdds[trait][gene_3] = (geneOdds[trait][gene_3] + mutation_odds) || mutation_odds;
                            geneOdds[trait][gene_2] = (geneOdds[trait][gene_2] - mutation_odds/2) || -mutation_odds/2;
                            geneOdds[trait][gene_1] = (geneOdds[trait][gene_1] - mutation_odds/2) || -mutation_odds/2;
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

module.exports = kittyBreedingOdds;