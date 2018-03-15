import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { Ghee, ghee } from "../src/ghee.js";
import { MockRtmClient } from "./helpers/mock_rtmclient.js";
import { MockWebClient } from "./helpers/mock_webclient.js";
import slack from "@slack/client";

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

global.sandbox = sinon.sandbox.create();

describe("Ghee class", () => {
  let token = Math.random().toString(36).substr(2, 20);
  let rtmclient = new MockRtmClient();
  let webclient = new MockWebClient();

  let Bot = class extends Ghee {
    constructor(token, rtmclient, webclient) {
      super(token, rtmclient, webclient);
    }

    testRegisteredMethod() {
      return "testRegisteredMethod";
    }

    testResolvedPromiseRegisteredMethod() {
      return Promise.resolve("testResolvedPromiseRegisteredMethod");
    }

    testRejectedPromiseRegisteredMethod() {
      return Promise.reject("testResolvedPromiseRegisteredMethod");
    }

    testNoReturnRegisteredMethod() { }

    @ghee
    testDecoratedMethod() {
      return "testDecoratedMethod";
    }

    @ghee("testNamedDecoratedMethod")
    testAnAlternativeNamedDecoratedMethod() {
      return "testNamedDecoratedMethod";
    }

    @ghee("*")
    testStarDecoratedMethod() {
      return "testStarDecoratedMethod";
    }
  };

  ghee(Bot, "testRegisteredMethod");
  ghee(Bot, "testResolvedPromiseRegisteredMethod");
  ghee(Bot, "testRejectedPromiseRegisteredMethod");
  ghee(Bot, "testNoReturnRegistedMethod");

  let instance = new Bot(token, rtmclient, webclient);

  describe("#constructor()", () => {
    it("is an instance of Bot", () => {
      instance.should.be.an.instanceof(Bot);
    });

    it("is an instance of Ghee", () => {
      instance.should.be.an.instanceof(Ghee);
    });

    it("has the token in the token property", () => {
      instance.token.should.equal(token);
    });

    it("called the start method of RtmClient", () => {
      rtmclient.start.should.be.called;
    });

    it("added two listeners to the on method of RtmClient", () => {
      rtmclient.on.should.be.calledTwice;
    });

    it("has an event listening for the authentication message", () => {
      rtmclient.on.should.have.been.calledWith(slack.CLIENT_EVENTS.RTM.AUTHENTICATED);
    });

    it("has an event listening for event messages", () => {
      rtmclient.on.should.have.been.calledWith(slack.RTM_EVENTS.MESSAGE);
    });

    it("has a name property", () => {
      instance.should.have.property("name", null);
    });

    it("has an id property", () => {
      instance.should.have.property("id", null);
    });

    it("has a prefix property", () => {
      instance.should.have.property("prefix", null);
    });
  });

  describe("#_loggedin()", () => {
    let testName = Math.random().toString(36).substr(2, 20);
    let testId = Math.random().toString(36).substr(2, 20);
    let loggedin = instance._loggedin();

    it("returns a function", () => {
      loggedin.should.be.instanceOf(Function);
    });

    it("can be called with a message", () => {
      let fn = function() {
        let msg = {
          self: {
            id: testId,
            name: testName
          }
        };

        loggedin(msg);
      };

      fn.should.change(instance, "name");
    });

    it("set the instances name property", () => {
      instance.name.should.equal(testName);
    });

    it("set the instance id property", () => {
      instance.id.should.equal(testId);
    });

    it("set the default prefix to '.'", () => {
      instance.prefix.should.equal(".");
    });

    it("does not set the prefix if one is already set", () => {
      let fn = function() {
        let msg = {
          self: {
            id: `${testId}__2`,
            name: `${testName}__2`
          }
        };

        loggedin(msg);
      };

      fn.should.change(instance, "name");
      fn.should.not.change(instance, "prefix");

      instance.prefix.should.equal(".");
    });
  });

  describe("#_parser()", () => {
    let parser = instance._parser();
    let _sendMessage = null;
    let starBackup = null;

    beforeEach(() => {
      _sendMessage = sinon.spy(instance, "_sendMessage");

      if ("*" in global._gheeListeners) {
        starBackup = global._gheeListeners["*"];
        delete global._gheeListeners["*"];
      }
    });

    afterEach(() => {
      instance._sendMessage.restore();

      if (starBackup) {
        global._gheeListeners["*"] = starBackup;
      }
    });

    it("returns a function", () => {
      parser.should.be.instanceOf(Function);
    });

    it("can be called with a non-triggering message", () => {
      let msg = {
        text: "test"
      };

      parser(msg);

      _sendMessage.should.not.be.called;
    });

    it("can be called with a malformed message", () => {
      let msg = {};

      parser(msg);

      _sendMessage.should.not.be.called;
    });

    it("can be called with no message", () => {
      parser();

      _sendMessage.should.not.be.called;
    });

    it("can be called with message starting with `<@id>` format", () => {
      let method = "testRegisteredMethod";
      let params = [ "test", "params" ];
      let paramsS = params.join(" ");
      let msg = {
        text: `<@${instance.id}> ${method} ${paramsS}`
      };

      parser(msg);

      _sendMessage.should.be.calledWithExactly(msg, method, params);
    });

    it("can be called with message starting with `@name` format", () => {
      let method = "testRegisteredMethod";
      let params = [ "test", "params" ];
      let paramsS = params.join(" ");
      let msg = {
        text: `@${instance.name} ${method} ${paramsS}`
      };

      parser(msg);

      _sendMessage.should.be.calledWithExactly(msg, method, params);
    });

    it("can be called with message starting with `name` format", () => {
      let method = "testRegisteredMethod";
      let params = [ "test", "params" ];
      let paramsS = params.join(" ");
      let msg = {
        text: `${instance.name} ${method} ${paramsS}`
      };

      parser(msg);

      _sendMessage.should.be.calledWithExactly(msg, method, params);
    });

    it("can be called with message starting with `prefix` format", () => {
      let method = "testRegisteredMethod";
      let params = [ "test", "params" ];
      let paramsS = params.join(" ");
      let msg = {
        text: `${instance.prefix} ${method} ${paramsS}`
      };

      parser(msg);

      _sendMessage.should.be.calledWithExactly(msg, method, params);
    });

    it("will not run on non-registered methods", () => {
      let method = "testNonRegisteredMethod";
      let params = [ "test", "params" ];
      let paramsS = params.join(" ");
      let msg = {
        text: `<@${instance.id}> ${method} ${paramsS}`
      };

      parser(msg);

      _sendMessage.should.not.be.called;
    });

    it("will send to a star decorated method if it is registered", () => {
      if (starBackup) {
        global._gheeListeners["*"] = starBackup;
      }

      let msg = {
        text: "test"
      };

      parser(msg);

      _sendMessage.should.be.calledWithExactly(msg, "*", msg.text);
    });
  });

  describe("#_sendAttachment()", () => {
    it("sends an attachment via the WebClient", () => {
      let channel = Math.random().toString(36).substr(2, 20);
      let text = Math.random().toString(36).substr(2, 20);

      let attachment = {
        text,
        attachments: [ ]
      };

      let payload = {
        "type": "message",
        channel,
        "as_user": true,
        "link_names": 1,
        "parse": "full",
        "text": (attachment.text) ? attachment.text : null,
        "attachments": attachment.attachments
      };

      instance._sendAttachment(attachment, channel);

      webclient.chat.postMessage.should.be.calledWithExactly(channel, null, payload);
    });
  });

  describe("#_sendMessage()", () => {
    let testRegisteredMethod = sinon.spy(instance, "testRegisteredMethod");
    let testResolvedPromiseRegisteredMethod = sinon.spy(instance, "testResolvedPromiseRegisteredMethod");
    let testRejectedPromiseRegisteredMethod = sinon.spy(instance, "testRejectedPromiseRegisteredMethod");
    let testDecoratedMethod = sinon.spy(instance, "testDecoratedMethod");
    let testAnAlternativeNamedDecoratedMethod = sinon.spy(instance, "testAnAlternativeNamedDecoratedMethod");
    let testStarDecoratedMethod = sinon.spy(instance, "testStarDecoratedMethod");
    //let testNoReturnRegsiteredMethod = sinon.spy(instance, "testNoReturnRegisteredMethod");

    let msg = {
      user: 12345,
      channel: 54321
    };
    let params = [ "test", "params" ];

    beforeEach(() => {
      instance.slack.sendMessage.reset();
    });

    it("calls a registered method with string as return value", () => {
      let method = "testRegisteredMethod";

      instance._sendMessage(msg, method, params).then(() => {
        testRegisteredMethod.should.be.called;
        testRegisteredMethod.should.have.returned(method);

        instance.slack.sendMessage.should.be.calledWithExactly(method, msg.channel);
      });

    });

    it("calls a registered method with a resolved promise", () => {
      let method = "testResolvedPromiseRegisteredMethod";

      instance._sendMessage(msg, method, params).then(() => {
        testResolvedPromiseRegisteredMethod.should.be.called;
        testResolvedPromiseRegisteredMethod.should.have.returned(sinon.match.instanceOf(Promise));
      });
    });

    it("calls a registered method with a rejected promise", () => {
      let method = "testRejectedPromiseRegisteredMethod";

      instance._sendMessage(msg, method, params).then(() => {
        testRejectedPromiseRegisteredMethod.should.be.called;
        testRejectedPromiseRegisteredMethod.should.have.returned(sinon.match.instanceOf(Promise));
      });
    });

    it("calls a decorated method", () => {
      let method = "testDecoratedMethod";

      instance._sendMessage(msg, method, params).then(() => {
        testDecoratedMethod.should.be.called;
        testDecoratedMethod.should.have.returned(method);

        instance.slack.sendMessage.should.be.calledWithExactly(method, msg.channel);
      });
    });

    it("calls a named decorated method", () => {
      let method = "testNamedDecoratedMethod";

      instance._sendMessage(msg, method, params).then(() => {
        testAnAlternativeNamedDecoratedMethod.should.be.called;
        testAnAlternativeNamedDecoratedMethod.should.have.returned(method);

        instance.slack.sendMessage.should.be.calledWithExactly(method, msg.channel);
      });
    });

    it("calls a * decorated catch all method", () => {
      let method = "testStarDecoratedMethod";

      instance._sendMessage(msg, "*", params).then(() => {
        testStarDecoratedMethod.should.be.called;
        testStarDecoratedMethod.should.have.returned(method);

        instance.slack.sendMessage.should.be.calledWithExactly(method, msg.channel);
      });
    });
  });
});

describe("ghee decorator", () => {
  describe("#ghee()", () => {
    let token = Math.random().toString(36).substr(2, 20);
    let rtmclient = new MockRtmClient();
    let webclient = new MockWebClient();

    let Bot = class extends Ghee {
      constructor(token, rtmclient, webclient) {
        super(token, rtmclient, webclient);
      }

      testRegisteredMethod() { }
    };
    let instance = new Bot(token, rtmclient, webclient);

    it("can register a new listener", () => {
      ghee(Object, "testRegisteredMethod");

      global._gheeListeners.should.be.an("object").that.has.a.property("testRegisteredMethod");
    });
  });
});
