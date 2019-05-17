const parseKittyMetadata = (raw_response) => {
    const traitNames = ["unknown", "secret", "mystery", "mouth", "wild", "colorsecondary", "colortertiary", "colorprimary", "eyes", "coloreyes", "pattern", "body"];
  
    var raw_hex = raw_response.substr(2);
  
    var isGestating_hex = raw_hex.substr(raw_hex.length - 640, 64);
    var isReady_hex = raw_hex.substr(raw_hex.length - 576, 64);
    var cooldownIndex_hex = raw_hex.substr(raw_hex.length - 512, 64);
    var nextActionAt_hex = raw_hex.substr(raw_hex.length - 448, 64);
    var siringWithId_hex = raw_hex.substr(raw_hex.length - 384, 64);
    var birthTime_hex = raw_hex.substr(raw_hex.length - 320, 64);
    var matronId_hex = raw_hex.substr(raw_hex.length - 256, 64);
    var sireId_hex = raw_hex.substr(raw_hex.length - 192, 64);
    var gen_hex = raw_hex.substr(raw_hex.length - 128, 64);
    var dna_hex = raw_hex.substr(raw_hex.length - 64);
    dna_hex = dna_hex.match(/.{1,2}/g);
  
    var isReady = (Number.parseInt(isReady_hex, 2) === 1 ? true : false);
    var cooldownIndex = Number.parseInt(cooldownIndex_hex, 16);
    var matron = Number.parseInt(matronId_hex, 16);
    var sire = Number.parseInt(sireId_hex, 16);
    var gen = Number.parseInt(gen_hex, 16);
  
    var dna_binary = "";
    for (var h in dna_hex) {
        let binaryChunk = ("00000000"+(Number.parseInt(dna_hex[h], 16)).toString(2)).substr(-8);
        dna_binary += binaryChunk;
    }
    dna_binary = dna_binary.substr(dna_binary.length % 5);
    dna_binary = dna_binary.match(/.{1,5}/g);
  
    var dna = {};
    for (var geneIndex in traitNames) {
        var traitName = traitNames[geneIndex];
        var indexOffset = dna_binary.length - traitNames.length * 4;
        dna[traitName] = [0, 0, 0, 0];
        for (var i = 0; i < 4; i++) {
            var geneId_binary = dna_binary[geneIndex * 4 + indexOffset + i];
            var geneId_int = parseInt((geneId_binary + '').replace(/[^01]/gi, ''), 2);
            dna[traitName][(3 - i)] = geneId_int;
        };
    };
  
    return { dna, matron, sire, gen, cooldownIndex, isReady };
}

export default parseKittyMetadata;