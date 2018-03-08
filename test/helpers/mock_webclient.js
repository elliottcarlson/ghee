export class MockWebClient {
  constructor(token) {
    this.token = token;

    this.chat = {
      postMessage: sandbox.spy()
    }

    this.users = {
      info: () => {
        return Promise.resolve({
          user: { }
        })
      }
    }

    this.conversations = {
      info: () => {
        return Promise.resolve({
          channel: { }
        })
      }
    }
  }
}
