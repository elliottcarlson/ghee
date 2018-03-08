import slack from "@slack/client";
import Promise from "bluebird";

global._gheeListeners = {};

function isAttachment(obj) {
  return !!obj && (typeof obj === "object" || typeof obj === "function") && "hasAttachments" in obj && obj.hasAttachments;
}

function isPromise(obj) {
  return !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}

export class Ghee {
  constructor(token, RtmClient, WebClient) {
    this.token = token;

    this.slack = RtmClient || new slack.RtmClient(token, {
      useRtmConnect: true,
      dataStore: false
    });

    this.web = WebClient || new slack.WebClient(token);

    this.slack.start();

    this.slack.on(slack.CLIENT_EVENTS.RTM.AUTHENTICATED, this._loggedin());
    this.slack.on(slack.RTM_EVENTS.MESSAGE, this._parser());

    this.name = null;
    this.id = null;
    this.prefix = null;
  }

  _loggedin() {
    let self = this;

    return (msg) => {
      self.name = msg.self.name;
      self.id = msg.self.id;

      if (!self.prefix) {
        self.prefix = `.${self.name}`;
      }
    };
  }

  _isRegistered(msg) {
    let [ prefix ] = msg.split(" ");

    if (prefix.substring(1) in global._gheeListeners) {
      return true;
    }

    return false;
  }

  _parser() {
    let self = this;

    return (msg) => {
      if (!msg || !msg.text) { return; }

      msg.text = msg.text.replace(/[\u2018\u2019]/g, "'");
      msg.text = msg.text.replace(/[\u201C\u201D]/g, "\"");
      msg.text = msg.text.replace(/\u2014/g, "--");

      if (msg.text.startsWith(`<@${self.id}>`) ||
          msg.text.startsWith(`@${self.name}`) ||
          msg.text.startsWith(self.name) ||
          msg.text.startsWith(self.prefix)) {

        let [ , method, ...params ] = msg.text.split(" ");

        if (method in global._gheeListeners) {
          self._sendMessage(msg, method, params);
        }
      } else if (msg.text.startsWith(".") && self._isRegistered(msg.text)) {
        let [ prefix, ...params ] = msg.text.split(" ");
        let method = prefix.substring(1);

        self._sendMessage(msg, method, params);
      }

      if ("*" in global._gheeListeners) {
        self._sendMessage(msg, "*", msg.text);
      }
    }
  }

  _sendAttachment(attachment, channel) {
    let payload = {
      "type": "message",
      channel,
      "as_user": true,
      "parse": "full",
      "link_names": 1,
      "text": (attachment.text) ? attachment.text : null,
      "attachments": attachment.attachments
    };

    this.web.chat.postMessage(channel, null, payload);
  }

  _sendMessage(msg, method, params) {
    return Promise.join(
      this.web.users.info(msg.user),
      this.web.conversations.info(msg.channel),
      (from, channel) => {

        let response = this[global._gheeListeners[method]](params, from.user, channel.channel, msg);

        if (response) {
          if (isPromise(response)) {
              response.then((data) => {
                if (isAttachment(data)) {
                  this._sendAttachment(data, msg.channel);
                } else {
                  this.slack.sendMessage(data, msg.channel);
                }
              }, (text) => {
                this.slack.sendMessage(`:warning: ${text}`, msg.channel);
              });
          } else if (isAttachment(response)) {
            this._sendAttachment(response, msg.channel);
          } else {
            this.slack.sendMessage(response, msg.channel);
          }
        }
      });
  }
}

export function ghee(target, key) {
  if (!key) {
    return (_target, _key) => {
      global._gheeListeners[target] = _key;
    };
  } else {
    global._gheeListeners[key] = key;
  }
}

String.prototype.startsWith = function(needle) { // eslint-disable-line no-extend-native
  return(this.indexOf(needle) === 0);
};
