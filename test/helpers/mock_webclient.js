export class Mock_WebClient {
  constructor(token) {
    this.token = token;

    this.chat = {
      postMessage: sandbox.spy()
    }
  }
}
