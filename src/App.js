import React from 'react';
import Web3 from 'web3';
import axios from 'axios';
import parseKittyMetadata from './utilities/parseKittyMetadata.js';

import SignIn from './Layout/SignIn';

const CurlinTraits = { mouth: '10', colorprimary: '7', pattern: '18', colorsecondary: '13' };



class App extends React.Component {
  constructor() {
    super();

    this.state = {
      web3: null,
      locked: null,
      pendingUnlock: false
    };
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      if (typeof window.web3 === 'undefined') {
        this.setState({web3: false});
      } else {
        const web3 = new Web3(window.web3.currentProvider);
        web3.eth.getAccounts()
          .then(accounts => {
            if (accounts.length === 0) { 
              this.setState({web3, locked: true});
            }
            else { 
              this.setState({web3, locked: false});
            }
          });
      };
    });
  }

  requestAccounts = () => {
    this.setState({pendingUnlock: true});
    this.state.web3.eth.requestAccounts((err, result) => {
      if (err) {
        this.setState({pendingUnlock: false});
      } else {
        this.setState({pendingUnlock: false, locked: false});
      }
    });
  }

  getFullKittiesMetadataLocal = async () => {
    const { kitties_array, web3 } = this.state;

    if (kitties_array.length > 0 && web3) {
      var kitty_id_array = [];
      kitties_array.forEach(
        (value) => { kitty_id_array.push(value.id) }
      );

      var kitties_metadata = [];
      
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
                kitties_metadata.push(kitty_metadata);
            }
            responseQueue = [];
            counter = 0;
            metaCounter += 30;
        }
      }
      console.log(kitties_metadata);
      this.setState({kitties_metadata});
    }
  }

  getKittiesByWalletAddress = async () => {
    const { web3 } = this.state;
    if (web3) {
      const allAccounts = await web3.eth.getAccounts();
      const owner_wallet_address = allAccounts[0];
      axios.get('/kitties', {params: {owner_wallet_address}})
        .then((response) => {
          const kitties_array = response.data.kitties;
          console.log(kitties_array);
          this.setState({kitties_array});
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  getOptimalBreedingPairs = async () => {
    const { kitties_metadata } = this.state;

    if (kitties_metadata) {
      var ready_kitties = [];
      kitties_metadata.forEach((value) => {
        if (value.isReady) {
          ready_kitties.push(value);
        }
      });

      axios.post('/kitties/best', {
        kitties_metadata: ready_kitties,
        kitties_traits: CurlinTraits
      })
        .then((response) => {
          const optimalPairs = response.data;
          console.log(optimalPairs);
          this.setState({optimalPairs})
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  getSales = () => {
    axios.get('/kitties/sale')
      .then(response => {
        console.log(response.data);
      })
  }

  render() {

    if (this.state.locked) {
      return(<SignIn requestAccounts={this.requestAccounts} pendingUnlock={this.state.pendingUnlock}/>)
    }
    return (
      <div>

        <header>
          <h1>Welcome to React</h1>
        </header>

        {this.state.pendingUnlock && (
          <div>Awaiting wallet unlock...</div>
        )}
        
        {this.state.locked && (
          <button onClick={this.requestAccounts}>Unlock Wallet</button>
        )}

        <button onClick={this.getKittiesByWalletAddress}>Get Kitties</button>
        <button onClick={this.getFullKittiesMetadataLocal}>Get Kitties Metadata (Local)</button>
        <button onClick={this.getOptimalBreedingPairs}>Get Optimal Breeding Pairs For Curlin</button>
        <button onClick={this.getSales}>Get sales</button>

      </div>
    );
  }
}

export default App;
