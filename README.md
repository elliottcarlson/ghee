# ghee [![npm version](https://badge.fury.io/js/ghee.svg)](https://badge.fury.io/js/ghee) [![Build Status](https://travis-ci.org/elliottcarlson/ghee.svg?branch=master)](https://travis-ci.org/elliottcarlson/ghee) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/5c43cf385708406f9b1f112771314b89)](https://www.codacy.com/app/trendinteractive/ghee?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=elliottcarlson/ghee&amp;utm_campaign=Badge_Grade) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/5c43cf385708406f9b1f112771314b89)](https://www.codacy.com/app/trendinteractive/ghee?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=elliottcarlson/ghee&amp;utm_campaign=Badge_Coverage)

A simple bot framework for [Slack](http://www.slack.com) written in ES2016+.

__ghee is actively in development and breaking changes may occur until release
1.0__

## Installation

Via npm

    $ npm install ghee

Via git clone

    $ npm clone git@github.com:elliottcarlson/ghee && cd ghee
    $ npm install

## Usage

ghee is a framework for writing bots, and does not run on it's own. For pre-made
bots, please see the [Samples](#samples) section.

If you want to quickly create your first ghee bot, it is recommended to use
[ghee-boilerplate](https://github.com/elliottcarlson/ghee-boilerplate/) as it
will provide you with everything you need to quickly get a bot up and running.

## ES7 + Decorators Bot

ghee comes with a helper function that is intended on being used as a decorator.
To use the `@ghee` decorator, you will need
[babel-preset-es2015](https://www.npmjs.com/package/babel-preset-es2015),
[babel-preset-es2017](https://www.npmjs.com/package/babel-preset-es2017) and
[babel-plugin-transform-decorators-legacy](https://www.npmjs.com/package/babel-preset-decorators-legacy).
The [ghee-boilerplate](https://github.com/elliottcarlson/ghee-boilerplate/)
provides all the files and references needed to quickly get setup to create
your own bot.

The ghee helper function will either register the method being decorated
directly, or can be passed a parameter to register as the string to respond to.
An special parameter of `*` will cause that method to receive all content and
acts as a catch-all method.

A straight-forward bot that will respond to `.hello` and `.goodbye` messages in
Slack would look like:

    import { Ghee, ghee } from 'ghee';

    class Bot extends Ghee {
        constructor() {
            super(YOUR_SLACK_API_TOKEN);
        }

        @ghee
        hello() {
            return 'Hello!';
        }

        @ghee('goodbye')
        other_method() {
            return 'Goodbye!';
        }
    }

## ES6 Bot

If you don't want to use decorators, and want to stick with babel-preset-es2015,
you can still use ghee.

The same sample as above, but without a decorator:

    import { Ghee, ghee } from 'ghee';

    class Bot extends Ghee {
        constructor() {
            super(YOUR_SLACK_API_TOKEN);

            ghee(this, 'hello');
            ghee(this, 'goodbye');
        }

        hello() {
            return 'Hello';
        }

        goodbye() {
            return 'Goodbye!';
        }
    }

## How it works (quick overview)

ghee abstracts the background comminucation with Slacks RTM and Web API's. By
extending the Ghee base class, your Bot will perform all of the connection and
routing of requests behind the scenes.

By registering specific methods via the `ghee` helper (either as a decorator, or
directly), ghee will register that methods name as a command that it can respond
to.

Your bot will respond to various styles of sending commands. In any room that
the bot has been invited to, or via private message, you will be able to trigger
a command call using the following syntaxes:

* @-mention _command_ _(optional parameters)_
* @bot-name _command_ _(optional parameters)_
* bot-name: _command_ _(optional parameters)_
* .prefix _command_ _(optional parameters)_
* ._command_ _(optional parameters)_

If the _command_ has been registered via the `ghee` helper, then the method will
be called with the following parameters:

* `params`: an array of individual words that were entered after the _command_
* `from`: an object containing the user that issued the _command_
* `channel`: an object containing the channel the _command_ was issued in (can indicate direct message as well)
* `msg`: an object containing the raw message that was received from Slack

Please see the [wiki](https://github.com/elliottcarlson/ghee/wiki) for a more
in-depth usage guide.

_command_'s can respond in various ways. In the above examples, we simply return
a string - this tells ghee to respond to the command by sending the returned
string back to the source - i.e. if it were in a channel, it would respond
there, if the request was via direct message, it would respond there. Besides
returning a string, ghee can also accept the following return types:

* `Attachment`: An attachment is a seperate class that is available with ghee -
  attachments allow you to include additional content with a post, and add
  styling and fields. For more information on Slack attachments, see their
  [documentation](https://api.slack.com/docs/message-attachments).
* `Promise`: When a Promise is returned, ghee will act accordingly, and wait for
  a resolve or reject message to come through. The content of the resolve/reject
  message should be a string or an attachment that it can process accordingly.

Please see the [wiki](https://github.com/elliottcarlson/ghee/wiki) for more
information on Attachments and Promises.

## Why "_ghee_"?

It started off as the basis for ghebot, a bot to assist in monitor and alerting
for GitHub Enterprise. ghee is now the underlying framework for ghebot. Also,
_it's clear to use and smooth as butter_.

## Samples

- [ghee boilerplate](https://github.com/elliottcarlson/ghee-boilerplate/)
- [Sample ghee bot](https://github.com/elliottcarlson/ghee-sample-bot/)
- [JiraBot](https://github.com/elliottcarlson/jirabot/)

