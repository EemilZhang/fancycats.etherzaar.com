import React from 'react';
import Web3 from 'web3';
import * as moment from 'moment';

import { Button, Header, Container, Icon, Responsive } from 'semantic-ui-react'

import Loading from './Layout/Loading';

import getKittyMetadata from './utilities/getKittyMetadata.js';
import getKittiesByAddress from './utilities/getKittiesByAddress';
import getKittyBreedingPairs from './utilities/getKittyBreedingPairs';

import KittyRecipes from './DataComponents/KittyRecipes/KittyRecipes';
import KittyPairs from './DataComponents/KittyPairs/KittyPairs';

import './App.css';

const FancyTraits = {
  Curdlin: {
    traits: { mouth: '10', colorprimary: '7', pattern: '18', colortertiary: '13' },
    names: { mouth: 'saycheese', colorprimary: 'nachocheez', pattern: 'dippedcone', colortertiary: 'missmuffett' }
  },
  Glitter: {
    traits: { wild: '27', pattern: '6', environment: '18', colorprimary: '26' },
    names: { wild: 'glitter', pattern: 'rorschach', environment: 'juju', colorprimary: 'hyacinth' }
  },
  Al: {
    traits: {body: '12', mouth: '13', colortertiary: '5', colorprimary: '12'},
    names: {body: 'munchkin', mouth: 'moue', colortertiary: 'cashewmilk', colorprimary: 'brownies'}
  },
  Pizzazz: {
    traits: {eyes: '1', colorsecondary: '10', pattern: '7', body: '17'},
    names: {eyes: 'wonky', colorsecondary: 'scarlet', pattern: 'spangled', body: 'mekong'}
  },
  Pawrula: {
    traits: {body: '24', pattern: '5', colorsecondary: '15'},
    names: {body: 'fox', pattern: 'camo', colorsecondary: 'butterscotch'}
  },
  Page: {
    traits: {pattern: '2', colortertiary: '2', mouth: '1'},
    names: {pattern: 'rascal', colortertiary: 'peach', mouth: 'wasntme'}
  }
}

const activeCacheTemplate = {
  Curdlin: [],
  Glitter: [],
  Al: [],
  Pizzazz: [],
  Pawrula: [],
  Page: []
}

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      web3: null,
      accountLocked: null,
      pendingUnlock: false,
      address: null,
      syncing: null,
      default: false,
      analyzing: null,
      lastSync: null,
      totalKitties: 0,
      selectedRecipe: null,
      activeCache: activeCacheTemplate
    };
  }

  getInjectedWeb3 = () => {
    if (typeof window.web3 === 'undefined') this.setState({web3: false, accountLocked: null})
      else {
        const web3 = new Web3(window.web3.currentProvider);
        web3.eth.getAccounts().then(accounts => {
            if (accounts[0]) {
              if (this.state.cache) {
                if (this.state.cache.address === accounts[0]){
                    this.setState({ web3, kitties_array: this.state.cache.kitties_array, totalKitties: this.state.cache.kitties_array.length, kitties_metadata: this.state.cache.kitties_metadata, accountLocked: false, address: accounts[0], default: true }) 
                } else {
                  this.setState({ web3, accountLocked: false, address: accounts[0] });
                  getKittiesByAddress(web3).then(kitties_array => {
                      this.setState({kitties_array, totalKitties: kitties_array.length});
                      getKittyMetadata(kitties_array, this.state.web3).then(kitties_metadata => this.setState({kitties_metadata, default: true}));
                  });
                }
              }
              else {  
                this.setState({ web3, accountLocked: false, address: accounts[0] });
                getKittiesByAddress(web3).then(kitties_array => {
                    this.setState({kitties_array, totalKitties: kitties_array.length});
                    getKittyMetadata(kitties_array, this.state.web3).then(kitties_metadata => this.setState({kitties_metadata, default: true}));
                });
              }
            } else  this.setState({ web3, accountLocked: true })
          });
      };
  }

  cacheAppState = () => {
    if (this.state.web3 && this.state.accountLocked === false && this.state.kitties_array && this.state.kitties_metadata)
      this.state.web3.eth.getAccounts().then(accounts => {
        const cacheObject = { address: accounts[0], kitties_array: this.state.kitties_array, kitties_metadata: this.state.kitties_metadata, timestamp: moment() };
        localStorage.setItem('ckCache', JSON.stringify(cacheObject));
      });
  };

  componentDidMount() {
    window.addEventListener('load', this.getInjectedWeb3);
    window.addEventListener('beforeunload', this.cacheAppState);
  };

  componentWillMount() {
    const cacheString = localStorage.getItem('ckCache');
    if (cacheString) this.setState({cache: JSON.parse(cacheString)});
  };

  refresh = () => {
    if (!this.state.syncing && !this.state.analyzing && !this.state.accountLocked) {
      this.setState({pendingUnlock: false, accountLocked: false, breeding_pairs: null, selectedRecipe: null, totalKitties: null, syncing: 'Loading kitties', default: false, activeCache: {Curdlin: [], Glitter: [], Al: [], Pizzazz: [], Pawrula: [], Page: []}});
        getKittiesByAddress(this.state.web3).then(kitties_array => {
            this.setState({kitties_array, totalKitties: kitties_array.length, syncing: 'Loading metadata'});
            getKittyMetadata(kitties_array, this.state.web3).then(kitties_metadata => this.setState({kitties_metadata, syncing: null, default: true}));
        });
    }
  }

  requestAccounts = () => {
    localStorage.removeItem('ckCache');
    this.setState({pendingUnlock: true, kitties_array: null, kitties_metadata: null, address: null});

    this.state.web3.eth.requestAccounts((err, result) => {
      if (err) {
        this.setState({pendingUnlock: false})
      } else if (result.length < 1) {
        this.setState({pendingUnlock: true});
      } else {
        this.setState({pendingUnlock: false, accountLocked: false, syncing: 'Loading kitties', address: result[0]});
        getKittiesByAddress(this.state.web3).then(kitties_array => {
            this.setState({kitties_array, totalKitties: kitties_array.length, syncing: 'Loading metadata'});
            getKittyMetadata(kitties_array, this.state.web3).then(kitties_metadata => this.setState({kitties_metadata, syncing: null, default: true}));
        });
      };
    });
  }

  getFullKittiesMetadataLocal = async () => getKittyMetadata(this.state.kitties_array, this.state.web3)
    .then(kitties_metadata => 
      this.setState({kitties_metadata_array: kitties_metadata.array, kitties_metadata_object: kitties_metadata.object})
  );
  
  getKittiesByWalletAddress = async () => getKittiesByAddress(this.state.web3)
    .then(kitties_array => 
      this.setState({kitties_array})
  );

  getBreedingPairs = async (fancy_name) => {
    if (!this.state.syncing && !this.state.analyzing && !this.state.accountLocked) {
      this.setState({analyzing: 'Analyzing kitties', breeding_pairs: null, selectedRecipe: null, selectedFancy: null, default: false});

      if (this.state.activeCache[fancy_name].length > 0) {
        this.setState({breeding_pairs: this.state.activeCache[fancy_name], selectedRecipe: FancyTraits[fancy_name].names, selectedFancy: fancy_name, analyzing: null,});
      } else {
        getKittyBreedingPairs(this.state.kitties_metadata.array, FancyTraits[fancy_name].traits)
          .then(breeding_pairs => {
            if (breeding_pairs.length < 1) {
            } else {
              var cacheObject = this.state.activeCache;
              cacheObject[fancy_name] = breeding_pairs;
              this.setState({breeding_pairs, selectedRecipe: FancyTraits[fancy_name].names, selectedFancy: fancy_name, analyzing: null, activeCache: cacheObject})
            }
          })
          .catch(() => {
            this.setState({analyzing: null})
          })
      }
    }
  }

  render() {
    const MainContents = () => {
      if (this.state.syncing) {
        return Loading(this.state.syncing)
      } else if (this.state.analyzing) {
        return Loading(this.state.analyzing)
      } else if (this.state.accountLocked) {
        return (
          <Container textAlign='center'>
              <Responsive minWidth={506} style={{paddingTop: '1em'}}/>
                <Header
                    as='h2'
                    textAlign='center'
                    style={{color: 'rgba(0,0,0,.0.78)'}}
                >
                    <Header.Subheader className='strong-subheader-default-locked' style={{paddingTop: '0.5em', color: 'rgba(0,0,0,.0.98)', fontSize: '2rem', fontWeight: '600'}}>
                      Unlock your account to get started
                    </Header.Subheader>
                </Header>
                <Button
                  color='pink'
                  size='large'
                  content="Unlock"
                  loading={this.state.pendingUnlock}
                  onClick={this.requestAccounts}
                  className='SignIn-Button'
                />
            </Container>
        )
      } else if (this.state.kitties_array) {
        if (this.state.kitties_array.length < 2) {
          return (
            <Container textAlign='center'>
                <Responsive minWidth={506} style={{paddingTop: '1em'}}/>
                  <Header
                      as='h2'
                      textAlign='center'
                      style={{color: 'rgba(0,0,0,.0.78)'}}
                  >
                      <Header.Subheader className='strong-subheader-default-notenoughcats' style={{paddingTop: '0.5em', color: 'rgba(0,0,0,.0.78)', fontSize: '2rem', fontWeight: '600'}}>
                        You need to own at least two CryptoKitties to use this app
                      </Header.Subheader>
                  </Header>
                  <Button
                    color='pink'
                    size='large'
                    content="Buy A Kitty"
                    as='a'
                    href='https://cryptokitties.co'
                    className='SignIn-Button'
                  />
              </Container>
          )
        } else if (this.state.default) {
          return (
            <Container textAlign='center'>
                <Responsive minWidth={506} style={{paddingTop: '1em'}}/>
                  <Header
                      as='h2'
                      textAlign='center'
                      style={{color: 'rgba(0,0,0,.0.78)'}}
                  >
                      <Header.Subheader className='strong-subheader-default' style={{paddingTop: '0.5em'}}>
                        Select a fancy recipe to find kitty breeding pairs
                      </Header.Subheader>
                  </Header>
              </Container>
          )
        } else if (this.state.breeding_pairs) {
          return (
            <KittyPairs breeding_pairs={this.state.breeding_pairs} kitties_array={this.state.kitties_array} selectedRecipe={this.state.selectedRecipe} selectedFancy={this.state.selectedFancy} default={this.state.default}/>
          )
        }
      } 
    }
    return (
      <div className="App">
        <Responsive minWidth={767} className="main-container-desktop"/>
        <Responsive maxWidth={767} className="main-container-mobile"/>

        <Container textAlign="justified" style={{borderBottom: '1px solid #d6d6d6'}}>
          <Header as='h2' style={{fontSize: '2rem'}}>
            Fancy Recipes
            <Header.Subheader style={{fontSize: '1.4rem', paddingTop: '0.1em'}}>
              Refresh synced kitties <Icon name='refresh' size='small' link onClick={this.refresh} loading={this.state.syncing ? true : false} style={{display: 'inline-block', position: 'relative', right: '-0.06rem', top: '-0.01rem'}}/>
            </Header.Subheader>
          </Header>
          <Responsive minWidth={767} className="main-container-desktop-small"/>
          <Responsive maxWidth={767} style={{paddingTop: '0.5em'}}/>
          <KittyRecipes getBreedingPairs={this.getBreedingPairs}/>
          <Responsive minWidth={767} style={{marginBottom: '2em'}}/>
          <Responsive maxWidth={767} style={{marginBottom: '1em'}}/>

        </Container>

        
        <Container>
          <Responsive as={Container} maxWidth={506} style={{marginTop: '1em'}}/>
          {MainContents()}
        </Container>
      </div>
    );
  }
}


export default App;
