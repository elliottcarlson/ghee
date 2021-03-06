/* eslint-disable no-undef */
export class MockRtmClient {
  constructor(token, autoReconnect, autoMark) {
    this.autoReconnect = autoReconnect;
    this.autoMark = autoMark;

    this.token = token;

    this.start = sandbox.spy();
    this.login = sandbox.spy();
    this.on = sandbox.spy();

    this.sendMessage = sandbox.spy();

    this.self = {
      id: "ghee-id",
      name: "Ghee"
    };

    this.team = {
      name: "Ghee"
    };

    this.channels = {};
    this.groups = {};
  }
}
