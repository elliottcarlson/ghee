import slack from '@slack/client';

const listeners = {};

class Ghee {
  constructor(token) {
    this.token = token;

    this.slack = new slack.RtmClient(token, {
      dataStore: new slack.MemoryDataStore()
    });

    this.web = new slack.WebClient(token);

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
    }
  }

  _is_registered(msg) {
    let [ prefix ] = msg.split(' ');

    if (prefix.substring(1) in listeners) {
      return true;
    }

    return false;
  }

  _parser() {
    let self = this;

    return (msg) => {
      if (!msg || !msg.text) return;

      if (msg.text.startsWith(`<@${self.id}>`) ||
          msg.text.startsWith(`@${self.name}`) ||
          msg.text.startsWith(self.name) ||
          msg.text.startsWith(self.prefix)) {

        let [ prefix, method, ...params ] = msg.text.split(' ');

        if (method in listeners) {
          self._sendMessage(msg, method, params);
        }
      } else if (msg.text.startsWith('.') && self._is_registered(msg.text)) {
        let [ prefix, ...params ] = msg.text.split(' ');
        let method = prefix.substring(1);

        self._sendMessage(msg, method, params);
      } else if ('catch_all' in listeners) {
        self._sendMessage(msg, 'catch_all', msg.text);
      }
    }
  }

  _sendAttachment(attachment, channel) {
    let payload = {
      'type': 'message',
      'channel': channel,
      'as_user': true,
      'parse': 'full',
      'attachments': [ attachment.attachment ]
    };

    this.web.chat.postMessage(channel, null, payload);
  }

  _sendMessage(msg, method, params) {
    let from = this.slack.dataStore.getUserById(msg.user);
    let channel = this.slack.dataStore.getChannelGroupOrDMById(msg.channel);

    let response = this[listeners[method]](params, from, channel, msg);

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
  }
}

function ghee(target, key) {
  listeners[key] = key;
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function isAttachment(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.attachment === 'object';
}

String.prototype.startsWith = function(needle) {
  return(this.indexOf(needle) == 0);
};

module.exports = { Ghee, ghee };
