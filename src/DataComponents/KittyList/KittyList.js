import React from 'react';
import { Loader, Card, Image, Segment } from 'semantic-ui-react'

import './KittyList.css';

const KittyList = (props) => {
    const kitties = props.kitties_array;
    
    if (!props.kitties_array) {return (<Loader active inline='centered' />)}
    if (props.kitties_array < 1) {return(<Segment/>)}

    return (
            <Card.Group itemsPerRow={4} stackable={true} doubling={true}>
                {kitties.map((kitty) =>
                    <Card key={kitty.id}>
                        <Card.Content>
                            <Image floated='right' size='mini' src={kitty.image_url} />
                            <Card.Header>#{kitty.id}</Card.Header>
                            <Card.Meta className="truncate-text">{kitty.name}</Card.Meta>
                            <Card.Description>
                                Kitty Dna Goes Here As Tags
                            </Card.Description>
                        </Card.Content>
                    </Card>
                )}
            </Card.Group>
    );
}

export default KittyList