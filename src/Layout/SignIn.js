import React from 'react';
import { Button, Header, Container, Modal } from 'semantic-ui-react'
import './SignIn.css';

export default function SignIn(props) {

  return (
    <Modal dimmer='inverted' size='mini' open={props.accountLocked}>
      <Modal.Content>
        <Header
          as='h2'
          content='Account Locked'
          subheader='Unlock your account to get started.'
          textAlign='center'
        />
        <Container textAlign='center'>
          <Button
            color='pink'
            size='medium'
            content="Unlock"
            loading={props.pendingUnlock}
            onClick={props.requestAccounts}
            className='SignIn-Button'
          />
        </Container>
      </Modal.Content>
      
    </Modal>
  );
}