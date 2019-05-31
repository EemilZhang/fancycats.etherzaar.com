const djv = require('djv');
const kittyValidator = new djv();
const jsonSchema = {
  "kitty": {
    "properties": {
        "cooldownIndex": {
            "type": "number"
        },
        "gen": {
            "type": "number"
        },
        "id": {
            "type": "number"
        },
        "matron": {
            "type": "number"
        },
        "sire": {
            "type": "number"
        },
        "isReady": {
            "type": "boolean"
        },
        "dna": {
            "type": "object",
            "properties": {
                "body": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 4,
                    "maxItems": 4
                },
                "coloreyes": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 4,
                    "maxItems": 4
                },
                "colorprimary": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 4,
                    "maxItems": 4
                },
                "colorsecondary": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 4,
                    "maxItems": 4
                },
                "colortertiary": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 4,
                    "maxItems": 4
                },
                "environment": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 4,
                    "maxItems": 4
                },
                "eyes": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 4,
                    "maxItems": 4
                },
                "mouth": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 4,
                    "maxItems": 4
                },
                "pattern": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 4,
                    "maxItems": 4
                },
                "secret": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 4,
                    "maxItems": 4
                },
                "unknown": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 4,
                    "maxItems": 4
                },
                "wild": {
                    "type": "array",
                    "items": {
                        "type": "number"
                    },
                    "minItems": 4,
                    "maxItems": 4
                },
            },
            "required": [
                "body", "coloreyes", "colorprimary", "colorsecondary", "colortertiary", "environment", "eyes", "mouth", "pattern", "secret", "unknown", "wild"
            ]
        }
    },
    "required": [
      "cooldownIndex", "dna", "gen", "id", "isReady", "matron", "sire"
    ]
  }
};

kittyValidator.addSchema('default', jsonSchema);

const kittyObjectValidator = (kitty) => {
    const error = kittyValidator.validate('default#/kitty', kitty);
    if (typeof error === "undefined") return true;
    return error;
}

//console.log(kittyObjectValidator({"dna":{"secret":[7,6,7,5],"environment":[1,14,14,1],"mouth":[11,3,3,9],"wild":[3,7,7,12],"colortertiary":[4,19,12,1],"colorsecondary":[20,13,11,12],"colorprimary":[25,4,15,4],"eyes":[22,1,7,12],"coloreyes":[17,17,5,8],"pattern":[21,21,12,10],"body":[13,15,11,1]},"matron":550660,"sire":546351,"gen":9,"cooldownIndex":5,"isReady":true,"id":553618}));

module.exports = kittyObjectValidator;