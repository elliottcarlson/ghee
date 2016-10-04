export class Mock_RtmClient {
  constructor(token, autoReconnect, autoMark) {
    this.token = token;

    this.start = sandbox.spy();
    this.login = sandbox.spy();
    this.on = sandbox.spy();

    this.dataStore = {
      getUserById: sandbox.spy(),
      getChannelGroupOrDMById: sandbox.spy()
    }

    this.sendMessage = sandbox.spy();

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
