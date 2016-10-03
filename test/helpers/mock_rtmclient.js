import sinon from 'sinon';

global.sandbox = sinon.sandbox.create();

export class Mock_RtmClient {
  constructor(token, autoReconnect, autoMark) {
    this.token = token;

    this.start = sandbox.spy();
    this.login = sandbox.spy();
    this.on = sandbox.spy();

    this.self = {
      id: 'ghee-id',
      name: 'Ghee'
    }

    this.team = {
      name: 'Ghee'
    }

    this.channels = {};
    this.groups = {};
  }

}
