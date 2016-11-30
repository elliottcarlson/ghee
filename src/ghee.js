import slack from '@slack/client';
import http from 'http';

const listeners = {};
const webhooks = {};

export class Ghee {
  constructor(token, RtmClient, WebClient) {
    this.token = token;

    this.slack = RtmClient || new slack.RtmClient(token, {
      dataStore: new slack.MemoryDataStore()
    });

    this.web = WebClient || new slack.WebClient(token);

    this.slack.start();

    this.slack.on(slack.CLIENT_EVENTS.RTM.AUTHENTICATED, this._loggedin());
    this.slack.on(slack.RTM_EVENTS.MESSAGE, this._parser());

    if (Object.keys(webhooks).length) {
      this.webhookServer = http.createServer(this._webhookHandler());
      this.webhookServer.listen(process.env.PORT || 8080);

      console.log(`Launching webhook listener on http://localhost:${process.env.PORT || 8080}.`);
      for (webhook in webhooks) {
        console.log(` * ${webhook} will call method '${webhooks[webhook].method}' and post to ${webhooks[webhook].channel}.`);
      }
      console.log('');
    }

    this.name = null;
    this.id = null;
    this.prefix = null;
  }

  _loggedin() {
    let self = this;

    return (msg) => {
      console.log(`Logged in to Slack as '${msg.self.name}'.`);

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

      msg.text = msg.text.replace(/[\u2018\u2019]/g, '\'');
      msg.text = msg.text.replace(/[\u201C\u201D]/g, '"');
      msg.text = msg.text.replace(/\u2014/g, '--');

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

      if ('*' in listeners) {
        self._sendMessage(msg, '*', msg.text);
      }
    }
  }

  _sendAttachment(attachment, channel) {
    let payload = {
      'type': 'message',
      'channel': channel,
      'as_user': true,
      'parse': 'full',
      'link_names': 1,
      'text': (attachment.text) ? attachment.text : null,
      'attachments': attachment.attachments
    };

    this.web.chat.postMessage(channel, null, payload);
  }

  _sendMessage(msg, method, params) {
    let from = this.slack.dataStore.getUserById(msg.user);
    let channel = this.slack.dataStore.getChannelGroupOrDMById(msg.channel);

    let response = this[listeners[method]](params, from, channel, msg);

    return this._messageHandler(response, msg.channel);
  }

  _messageHandler(response, channel) {
    if (response) {
      if (isPromise(response)) {
        response.then((data) => {
          if (isAttachment(data)) {
            this._sendAttachment(data, channel);
          } else {
            this.slack.sendMessage(data, channel);
          }
        }, (text) => {
          this.slack.sendMessage(`:warning: ${text}`, channel);
        });
      } else if (isAttachment(response)) {
        this._sendAttachment(response, channel);
      } else {
        this.slack.sendMessage(response, channel);
      }
    }

    return;
  }

  _webhookHandler() {
    let self = this;

    return (request, response) => {
      if (request.url in webhooks) {
        let body = '';

        request.on('data', (chunk) => {
          body += chunk.toString();
        });

        request.on('end', () => {
          let res = self[webhooks[request.url].method](body);
          var channelName = webhooks[request.url].channel.replace(/^#/, '');
          let channel = this.slack.dataStore.getChannelByName(channelName) ||
            this.slack.dataStore.getGroupByName(channelName);

          this._messageHandler(res, channel.id);
        });
      } else {
        response.statusCode = 404;
        response.statusMessage = 'Not Found';
      }

      response.end();
    };
  }
}

export function ghee(target, key) {
  if (!key) {
    return (_target, _key) => {
      listeners[target] = _key;
    };
  } else {
    listeners[key] = key;
  }
}

export function webhook(target, key) {
  let channel = target;

  return (_target, _key) => {
    let md5 = require('md5');
    let path = `/webhook/${md5(channel + _key + _target)}`;

    webhooks[path] = {
      'channel': channel,
      'method': _key
    };
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function isAttachment(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && 'hasAttachments' in obj && obj.hasAttachments;
}

String.prototype.startsWith = function(needle) {
  return(this.indexOf(needle) === 0);
};
