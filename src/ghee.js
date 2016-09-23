import slack from '@slack/client';

const listeners = {};

class Ghee {
  constructor(token) {
    this.slack = new slack.RtmClient(token, {
      dataStore: new slack.MemoryDataStore()
    });

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
      }
    }
  }

  _sendMessage(msg, method, params) {
    let from = this.slack.dataStore.getUserById(msg.user);
    let channel = this.slack.dataStore.getChannelGroupOrDMById(msg.channel);

    let response = this[listeners[method]](params, from, channel, msg);

    if (response) {
      this.slack.sendMessage(response, msg.channel);
    }
  }
}

function ghee(target, key) {
  listeners[key] = key;
}

String.prototype.startsWith = function(needle) {
  return(this.indexOf(needle) == 0);
};

module.exports = { Ghee, ghee };
