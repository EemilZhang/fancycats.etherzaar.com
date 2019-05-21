import React from 'react';
import { Card }  from 'semantic-ui-react'

import CurdlinImage from '../../Assets/Curdlin_Fancy_Image.png';
import GlitterImage from '../../Assets/Glitter_Fancy_Image.png';
import PageImage from '../../Assets/Page_Fancy_Image.png';
import AlImage from '../../Assets/Al_Fancy_Image.png';
import PawrulaImage from '../../Assets/Pawrula_Fancy_Image.png';
import PizzazzImage from '../../Assets/Pizzazz_Fancy_Image.png';

import './KittyRecipes.css';

const KittyCard = (name, image, imageParams, description, props) => {
    return(
        <Card key={name} link onClick={() => props.getBreedingPairs(name)} className="recipe-card">
            <Card.Content style={{
                backgroundImage: `url(${image})`,
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
                {KittyCard('Curdlin', CurdlinImage, {x: 100, y: -150}, "Active until 10/30/2019", props)}
                {KittyCard('Glitter',GlitterImage, {x: 120, y: -135}, "Active until 10/30/2019", props)}
                {KittyCard('Page',PageImage,    {x: 130, y: -155}, 'Active until 50,000 bred', props)}
                {KittyCard('Al',AlImage,      {x: 120, y: -170}, "Active until 10/30/2019", props)}
                {KittyCard('Pawrula',PawrulaImage, {x: 120, y: -180}, "Active until 10/30/2019", props)}
                {KittyCard('Pizzazz',PizzazzImage, {x: 160, y: -150}, "Active until 10/30/2019", props)}
            </Card.Group>
    );
}

export default KittyRecipes