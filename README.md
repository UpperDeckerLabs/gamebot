# gamebot

A [slack](https://www.slack.com) bot for card games.

## How to install
* Clone this repo
* `npm install` in the cloned directory
* Generate a bot token by going to slack configuration, Custom Integrations, Bots
* Set the `SLACK_TOKEN` environment variable (`export SLACK_TOKEN=abc123`)
* Set the `PORT` environment variable for the web server (defaults to 8080)
* Run the app with `node app.js`
* Invite the bot to the room where you want the games to be played.

## Features
* Blackjack game by saying `@gamebot 21`
* Video poker game by saying `@gamebot poker`
* Check your winnings by saying `@gamebot money`
* Web based leaderboard by visiting http://gameboturl/stats

## Issues
* Sometimes Slack will drop the connection or vice versa. You can reconnect by visiting http://gameboturl/restart

