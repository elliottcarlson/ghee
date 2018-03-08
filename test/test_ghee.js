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

    test_registered_method(args, from, channel, msg) {
      return "test_registered_method";
    }

    test_resolved_promise_registered_method(args, from, channel, msg) {
      return Promise.resolve("test_resolved_promise_registered_method");
    }

    test_rejected_promise_registered_method(args, from, channel, msg) {
      return Promise.reject("test_resolved_promise_registered_method");
    }

    test_no_return_registered_method(args, from, channel, msg) { }

    @ghee
    test_decorated_method(args, from, channel, msg) {
      return "test_decorated_method";
    }

    @ghee("test_named_decorated_method")
    test_an_alternative_named_decorated_method(args, from, channel, msg) {
      return "test_named_decorated_method";
    }

    @ghee("*")
    test_star_decorated_method(args, from, channel, msg) {
      return "test_star_decorated_method";
    }
  };

  ghee(Bot, "test_registered_method");
  ghee(Bot, "test_resolved_promise_registered_method");
  ghee(Bot, "test_rejected_promise_registered_method");
  ghee(Bot, "test_no_return_registed_method");

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
    let test_name = Math.random().toString(36).substr(2, 20);
    let test_id = Math.random().toString(36).substr(2, 20);
    let loggedin = instance._loggedin();

    it("returns a function", () => {
      loggedin.should.be.instanceOf(Function);
    });

    it("can be called with a message", () => {
      let fn = function() {
        let msg = {
          self: {
            id: test_id,
            name: test_name
          }
        };

        loggedin(msg);
      };

      fn.should.change(instance, "name");
    });

    it("set the instances name property", () => {
      instance.name.should.equal(test_name);
    });

    it("set the instance id property", () => {
      instance.id.should.equal(test_id);
    });

    it("set the prefix to the name because no prefix was set before", () => {
      instance.prefix.should.equal(`.${test_name}`);
    });

    it("does not set the prefix if one is already set", () => {
      let fn = function() {
        let msg = {
          self: {
            id: `${test_id}__2`,
            name: `${test_name}__2`
          }
        }

        loggedin(msg);
      };

      fn.should.change(instance, "name");
      fn.should.not.change(instance, "prefix");

      instance.prefix.should.equal(`.${test_name}`);
    });
  });

  describe("#_isRegistered()", () => {
    let test_key = "test_registered_method";

    it("finds a registered key", () => {
      instance._isRegistered(`.${test_key}`).should.be.true;
    });

    it("does not find a non-registered key", () => {
      instance._isRegistered("not a registered key").should.be.false;
    });
  });

  describe("#_parser()", () => {
    let parser = instance._parser();
    let sendMessage = null;
    let star_backup = null;

    beforeEach(() => {
      sendMessage = sinon.spy(instance, "_sendMessage");

      if ("*" in global._ghee_listeners) {
        star_backup = global._ghee_listeners["*"];
        delete global._ghee_listeners["*"];
      }
    });

    afterEach(() => {
      instance._sendMessage.restore();

      if (star_backup) {
        global._ghee_listeners["*"] = star_backup;
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

      sendMessage.should.not.be.called;
    });

    it("can be called with a malformed message", () => {
      let msg = {};

      parser(msg);

      sendMessage.should.not.be.called;
    });

    it("can be called with no message", () => {
      parser();

      sendMessage.should.not.be.called;
    });

    it("can be called with message starting with `<@id>` format", () => {
      let method = "test_registered_method";
      let params = [ "test", "params" ];
      let params_s = params.join(" ");
      let msg = {
        text: `<@${instance.id}> ${method} ${params_s}`
      };

      parser(msg);

      sendMessage.should.be.calledWithExactly(msg, method, params);
    });

    it("can be called with message starting with `@name` format", () => {
      let method = "test_registered_method";
      let params = [ "test", "params" ];
      let params_s = params.join(" ");
      let msg = {
        text: `@${instance.name} ${method} ${params_s}`
      };

      parser(msg);

      sendMessage.should.be.calledWithExactly(msg, method, params);
    });

    it("can be called with message starting with `name` format", () => {
      let method = "test_registered_method";
      let params = [ "test", "params" ];
      let params_s = params.join(" ");
      let msg = {
        text: `${instance.name} ${method} ${params_s}`
      };

      parser(msg);

      sendMessage.should.be.calledWithExactly(msg, method, params);
    });

    it("can be called with message starting with `prefix` format", () => {
      let method = "test_registered_method";
      let params = [ "test", "params" ];
      let params_s = params.join(" ");
      let msg = {
        text: `${instance.prefix} ${method} ${params_s}`
      };

      parser(msg);

      sendMessage.should.be.calledWithExactly(msg, method, params);
    });

    it("can be called with message starting with `.method` format", () => {
      let method = "test_registered_method";
      let params = [ "test", "params" ];
      let params_s = params.join(" ");
      let msg = {
        text: `.${method} ${params_s}`
      };

      parser(msg);

      sendMessage.should.be.calledWithExactly(msg, method, params);
    });

    it("will not run on non-registered methods", () => {
      let method = "test_non_registered_method";
      let params = [ "test", "params" ];
      let params_s = params.join(" ");
      let msg = {
        text: `<@${instance.id}> ${method} ${params_s}`
      };

      parser(msg);

      sendMessage.should.not.be.called;
    });

    it("will send to a star decorated method if it is registered", () => {
      if (star_backup) {
        global._ghee_listeners["*"] = star_backup;
      }

      let msg = {
        text: "test"
      };

      parser(msg);

      sendMessage.should.be.calledWithExactly(msg, "*", msg.text);
    });
  });

  describe("#_sendAttachment()", () => {
    it("sends an attachment via the WebClient", () => {
      let channel = Math.random().toString(36).substr(2, 20);
      let text = Math.random().toString(36).substr(2, 20);

      let attachment = {
        text: text,
        attachments: [ ]
      };

      let payload = {
        "type": "message",
        "channel": channel,
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
    let test_registered_method = sinon.spy(instance, "test_registered_method");
    let test_resolved_promise_registered_method = sinon.spy(instance, "test_resolved_promise_registered_method");
    let test_rejected_promise_registered_method = sinon.spy(instance, "test_rejected_promise_registered_method");
    let test_decorated_method = sinon.spy(instance, "test_decorated_method");
    let test_an_alternative_named_decorated_method = sinon.spy(instance, "test_an_alternative_named_decorated_method");
    let test_star_decorated_method = sinon.spy(instance, "test_star_decorated_method");
    //let test_no_return_regsitered_method = sinon.spy(instance, "test_no_return_registered_method");

    let msg = {
      user: 12345,
      channel: 54321
    };
    let params = [ "test", "params" ];

    beforeEach(() => {
      instance.slack.sendMessage.reset();
    });

    it("calls a registered method with string as return value", () => {
      let method = "test_registered_method";

      instance._sendMessage(msg, method, params).then(() => {
        test_registered_method.should.be.called;
        test_registered_method.should.have.returned(method);

        instance.slack.sendMessage.should.be.calledWithExactly(method, msg.channel);
      });

    });

    it("calls a registered method with a resolved promise", () => {
      let method = "test_resolved_promise_registered_method";

      instance._sendMessage(msg, method, params).then(() => {
        test_resolved_promise_registered_method.should.be.called;
        test_resolved_promise_registered_method.should.have.returned(sinon.match.instanceOf(Promise));
      });
    });

    it("calls a registered method with a rejected promise", () => {
      let method = "test_rejected_promise_registered_method";

      instance._sendMessage(msg, method, params).then(() => {
        test_rejected_promise_registered_method.should.be.called;
        test_rejected_promise_registered_method.should.have.returned(sinon.match.instanceOf(Promise));
      });
    });

    it("calls a decorated method", () => {
      let method = "test_decorated_method";

      instance._sendMessage(msg, method, params).then(() => {
        test_decorated_method.should.be.called;
        test_decorated_method.should.have.returned(method);

        instance.slack.sendMessage.should.be.calledWithExactly(method, msg.channel);
      });
    });

    it("calls a named decorated method", () => {
      let method = "test_named_decorated_method";

      instance._sendMessage(msg, method, params).then(() => {
        test_an_alternative_named_decorated_method.should.be.called;
        test_an_alternative_named_decorated_method.should.have.returned(method);

        instance.slack.sendMessage.should.be.calledWithExactly(method, msg.channel);
      });
    });

    it("calls a * decorated catch all method", () => {
      let method = "test_star_decorated_method";

      instance._sendMessage(msg, "*", params).then(() => {
        test_star_decorated_method.should.be.called;
        test_star_decorated_method.should.have.returned(method);

        instance.slack.sendMessage.should.be.calledWithExactly(method, msg.channel);
      });
    });
  });
});

describe("ghee decorator", () => {
  describe("#ghee()", () => {
    let token = Math.random().toString(36).substr(2, 20);
    let rtmclient = new Mock_RtmClient();
    let webclient = new Mock_WebClient();

    let Bot = class extends Ghee {
      constructor(token, rtmclient, webclient) {
        super(token, rtmclient, webclient);
      }

      test_registered_method(args, from, channel, msg) { }
    };
    let instance = new Bot(token, rtmclient, webclient);

    it("can register a new listener", () => {
      ghee(Object, "test_registered_method");

      instance._isRegistered(".test_registered_method").should.be.true;
    });
  });
});
