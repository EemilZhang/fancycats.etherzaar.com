import React from 'react';
import { Card }  from 'semantic-ui-react'

import './KittyRecipes.css';

const KittyCard = (name, imageParams, description, props) => {
    return(
        <Card key={name} link onClick={() => props.getBreedingPairs(name)} className="recipe-card">
            <Card.Content style={{
                backgroundImage: `url(./Assets/${name}_Fancy_Image.png)`,
                backgroundSize: 'cover',
                backgroundPositionX: `${imageParams.x}px`,
                backgroundPositionY: `${imageParams.y}px`,
                backgroundRepeat: 'no-repeat',
                overflow: 'hidden',}}
            >
                <Card.Header className='strong-header'>{name}</Card.Header>
                <Card.Meta className="truncate-text"></Card.Meta>
                <Card.Description style={{fontSize: '1.14285714rem'}}>
                    <div>{description}</div>
                </Card.Description>
            </Card.Content>
        </Card>
    )
}


const KittyRecipes = (props) => {
    return (
            <Card.Group itemsPerRow={3} stackable={true} doubling={true}>
                {KittyCard('Curdlin', {x: 100, y: -150}, "Active until 10/30/2019", props)}
                {KittyCard('Glitter', {x: 120, y: -135}, "Active until 10/30/2019", props)}
                {KittyCard('Page',    {x: 130, y: -155}, 'Active until 50,000 bred', props)}
                {KittyCard('Al',      {x: 120, y: -170}, "Active until 10/30/2019", props)}
                {KittyCard('Pawrula', {x: 120, y: -180}, "Active until 10/30/2019", props)}
                {KittyCard('Pizzazz', {x: 160, y: -150}, "Active until 10/30/2019", props)}
            </Card.Group>
    );
}

export default KittyRecipes