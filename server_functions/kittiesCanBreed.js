const kittiesCanBreed = (kitty_1, kitty_2) => {
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

    if (kitty_1.is_ready === false || kitty_2.is_ready === false) return false; 

    return true;
}

module.exports = kittiesCanBreed;