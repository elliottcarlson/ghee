import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Ghee, ghee } from '../src/ghee.js';
import { Mock_RtmClient } from './helpers/mock_rtmclient.js';
import slack from '@slack/client';

chai.should();
chai.use(sinonChai);

describe('Ghee class', () => {
  let token = Math.random().toString(36).substr(2, 20);
  let rtmclient = new Mock_RtmClient();
  let instance = new Ghee(token, rtmclient);

  describe('#constructor()', () => {
    it('has the token in the token property', () => {
      instance.token.should.equal(token);
    });

    it('called the start method of RtmClient', () => {
      rtmclient.start.should.be.called;
    });

    it('added two listeners to the on method of RtmClient', () => {
      rtmclient.on.should.be.calledTwice;
    });

    it('has an event listening for the authentication message', () => {
      rtmclient.on.should.have.been.calledWith(slack.CLIENT_EVENTS.RTM.AUTHENTICATED);
    });

    it('has an event listening for event messages', () => {
      rtmclient.on.should.have.been.calledWith(slack.RTM_EVENTS.MESSAGE);
    });

    it('has a name property', () => {
      instance.should.have.property('name', null);
    });

    it('has an id property', () => {
      instance.should.have.property('id', null);
    });

    it('has a prefix property', () => {
      instance.should.have.property('prefix', null);
    });
  });
});

describe('ghee decorator', () => {
  describe('#ghee()', () => {
    let listeners = [];
    let instance = new Ghee();

    it('it can register a new listener', () => {
      ghee(Object, 'testkey');

      instance._is_registered('.testkey').should.be.true;
    });
  });
});
