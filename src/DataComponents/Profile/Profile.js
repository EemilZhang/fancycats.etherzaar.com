import React, { useState } from 'react';
import { Label, Card, Image, Segment } from 'semantic-ui-react'

import './Profile.css';

const KittyCard = (name, imageParams, props) => {
    return(
        <Card key={name}>
            <Card.Content
            >
                <Card.Header>Address</Card.Header>
                <Card.Meta as='a'>{props.address}</Card.Meta>
            </Card.Content>
        </Card>
    )
}


const Profile = (props) => {
    return (
            <Card.Group itemsPerRow={2}>
                {KittyCard('Curdlin', {x: 180, y: -150}, props)}
                {KittyCard('Glitter', {x: 170, y: -135}, props)}
            </Card.Group>
    );
}

export default Profile