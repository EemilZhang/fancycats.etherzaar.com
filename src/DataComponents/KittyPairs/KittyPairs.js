/* eslint-disable no-loop-func */
import React from 'react';
import { Loader, Label, Card, Container, Icon, Header, Image, Button, Segment, Responsive } from 'semantic-ui-react'

import './KittyPairs.css';

const kittyColor = {
    sizzurp: "#c1c1ea",
    mintgreen: "#cdf5d4",
    eclipse: "#e5e7ef",
    doridnudibranch: "#faeefa",
    cyan: "#c5eefa",
    coralsunrise: "#fde9e4",
    sapphire: "#d3e8ff",
    dahlia: "#e6eafd",
    forgetmenot: "#dcebfc",
    twilightsparkle: "#ede2f5",
    topaz: "#d1eeeb",
    thundergrey: "#eee9e8",
    strawberry: "#ffe0e5",
    pumpkin: "#fae1ca",
    pinefresh: "#dbf0d0",
    parakeet: "#e5f3e2",
    palejade: "#e7f1ed",
    olive: "#ecf4e0",
    oasis: "#e6faf3",
    gold: "#faf4cf",
    isotope: "#effdca",
    downbythebay: "#cde5d1",
    chestnut: "#efe1da",
    bubblegum: "#fadff4",
    bridesmaid: "#ffd5e5",
    babypuke: "#eff1e0",
    autumnmoon: "#fdf3e0"
}

const KittyCardSmall = (name, imageParams, description, props, traitIcons) => {
    if (props) {
    return(
        <Card key={name} fluid>
            <Card.Content style={{
                backgroundImage: `url(./Assets/${name}_Fancy_Image.png)`,
                backgroundSize: 'cover',
                backgroundPositionX: `${imageParams.x}px`,
                backgroundPositionY: `${imageParams.y}px`,
                backgroundRepeat: 'no-repeat',
                overflow: 'hidden',}}
            >
                <Card.Meta >
                    <div className="etched-text-main">{(props.kitty_odds * 100).toFixed(2)}</div>
                    <div className="etched-text"> = </div>

                    <Label as='a' href={'https://www.cryptokitties.co/kitty/' + props.kitty_1.id} target="_blank" image basic className='kitty-label'>
                        <div className="inline-id">{props.kitty_1.id}</div>
                    </Label>
                    <Label as='a' href={'https://www.cryptokitties.co/kitty/' + props.kitty_2.id} target="_blank" image basic className='kitty-label'>
                        <div className="inline-id">{props.kitty_2.id}</div>
                    </Label>

                    <Button as='a' href={props.kitty_url} target="_blank" basic color='pink' compact style={{position: 'absolute', right: '1em', top: '1.07em', fontWeight: 900}}>
                        <Icon  name='heart' style={{margin: '0 0'}}/>
                    </Button>
                </Card.Meta>
            </Card.Content>
        </Card>
    ) }
}


const KittyCard = (name, imageParams, description, props, traitIcons, color) => {
    if (props) {
    return(
        <Card key={name} style={{width: '500px', margin: 'auto', marginBottom: '1em'}}>
            <Card.Content style={{
                backgroundImage: `url(./Assets/${name}_Fancy_Image.png)`,
                backgroundSize: 'cover',
                backgroundPositionX: `${imageParams.x}px`,
                backgroundPositionY: `${imageParams.y}px`,
                backgroundRepeat: 'no-repeat',
                overflow: 'hidden',}}
            >
                <Card.Meta >
                    <div className="etched-text-main">{(props.kitty_odds * 100).toFixed(2)}</div>
                    <div className="etched-text"> = </div>

                    <Label as='a' href={'https://www.cryptokitties.co/kitty/' + props.kitty_1.id} target="_blank" image basic className='kitty-label'>
                        <Image src={props.kitty_1.image_url} style={{backgroundColor: kittyColor[props.kitty_1.color], marginTop: '-7.2px', marginBottom: '-8px'}}/>
                        <div className="inline-id">{props.kitty_1.id}</div>
                    </Label>
                    <div className="etched-text">+</div>

                    <Label as='a' href={'https://www.cryptokitties.co/kitty/' + props.kitty_2.id} target="_blank" image basic className='kitty-label'>
                        <Image src={props.kitty_2.image_url} style={{backgroundColor: kittyColor[props.kitty_2.color], marginTop: '-7.2px', marginBottom: '-8px'}}/>
                        <div className="inline-id">{props.kitty_2.id}</div>
                    </Label>

                    <Button as='a' href={props.kitty_url} target="_blank" basic color='pink' compact style={{position: 'absolute', right: '1em', top: '1.07em', fontWeight: 900}} className='breed-button'>
                        Breed <Icon  name='heart' style={{margin: '0 0'}}/>
                    </Button>
                </Card.Meta>
            </Card.Content>
        </Card>
    ) }
}

const KittyPairs = (props) => {
    
    if (!props.breeding_pairs) {return (<Loader active inline='centered' />)}
    if (props.breeding_pairs < 1) {return(<Segment/>)}

    var validPairs = [];
    var noValidPairs = true;
    for (let p = 0; p < 3; p++) {
        if(props.breeding_pairs[p].odds !== 0) {
            const kitty_odds = props.breeding_pairs[p].odds;
            const kitty_url = props.breeding_pairs[p].url;

            var kitty_1 = {};
            var kitty_2 = {};
            props.kitties_array.forEach((kitty) => {
                if          (kitty.id === props.breeding_pairs[p].id_1) kitty_1 = kitty;
                else if     (kitty.id === props.breeding_pairs[p].id_2) kitty_2 = kitty;
            });

            validPairs.push({kitty_1, kitty_2, kitty_odds, kitty_url});
            noValidPairs = false;
        };
    };
    var traits = [];
    for (const traitName in props.selectedRecipe) {
        if (props.selectedRecipe.hasOwnProperty(traitName)) {
            const trait = props.selectedRecipe[traitName];
            traits.push(trait);
        }
    }
    const traitIcons = traits.map(name => {
        return (
            <Label as='a' href={`https://www.cryptokitties.co/search?include=sale,sire&search=${name}`} target="_blank" >
                <Icon name='dna' /> {name}
            </Label>
        )
    })

    if (noValidPairs) {
        
        return(
            <Container textAlign='center'>
                <Responsive minWidth={506} style={{paddingTop: '1em'}}/>
                <Header
                    as='h2'
                    content=''
                    textAlign='center'
                    style={{color: 'rgba(0,0,0,.0.78)'}}
                >
                    No Breeding Pairs Found
                    <Header.Subheader className='strong-subheader' style={{paddingTop: '0.5em'}}>
                        {`None of your kitties have the combined traits to breed a ${props.selectedFancy}.`}
                    </Header.Subheader>
                </Header>
                <Label.Group>
                        {traitIcons}
                     </Label.Group>
            </Container>
        )
    } else {
        return (
            <div>
                <Responsive minWidth={506} style={{paddingTop: '1em'}}>
                    {KittyCard('Pair 1', {x: 100, y: -100}, 'Test', validPairs[0], "etched-text")}
                    {KittyCard('Pair 2', {x: 100, y: -100}, 'Test', validPairs[1], "etched-text-2")}
                    {KittyCard('Pair 3', {x: 100, y: -100}, 'Test', validPairs[2], "etched-text-3")}
                </Responsive>

                <Responsive maxWidth={505}>
                    {KittyCardSmall('Pair 1', {x: 100, y: -100}, 'Test', validPairs[0], "etched-text")}
                    {KittyCardSmall('Pair 2', {x: 100, y: -100}, 'Test', validPairs[1], "etched-text")}
                    {KittyCardSmall('Pair 3', {x: 100, y: -100}, 'Test', validPairs[2], "etched-text")}
                </Responsive>
                
                <Container textAlign='center' style={{paddingTop: '1em'}}>
                    <Header
                        as='h2'
                        content=''
                        textAlign='center'
                        className='parent-subheader'
                    >
                    <Header.Subheader className='strong-subheader'>
                        {`Get more kitties with the right traits to breed a ${props.selectedFancy}.`}
                    </Header.Subheader>
                    </Header>
                     <Label.Group>
                        {traitIcons}
                     </Label.Group>
                </Container>   
            </div>
        )
    }
}

export default KittyPairs