import React from 'react';
import { Dimmer, Loader, Segment, Container } from 'semantic-ui-react'
import './Loading.css';

export default function Loading(syncing) {

    if (syncing) {
        return (
            <Container textAlign='center' fluid style={{paddingTop: '5em'}}>
                <Segment basic>
                    <Dimmer active inverted>
                        <Loader size='large' inline='centered'>{syncing}</Loader>
                    </Dimmer>
                </Segment>
            </Container>
        );
    }
}