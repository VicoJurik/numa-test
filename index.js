const express = require("express");
const bodyParser = require("body-parser");

const slack = require("@slack/rtm-api");
const botToken = process.env.SLACK_TOKEN;
const rtm = new slack.RTMClient(botToken);

const generalChannelId = "CHHS1FF32";
const privateChannelId = "DHBHG49ED";

const welcomeMessageTemplate = userName => `Welcome to the team, ${userName}!!`;
const aknowledgeMessage = "Thank you for giving me your birthday.";

rtm.start();

rtm.on("connected", () => {
  console.log("Hello");
});

// A new user has joined the workspace.
rtm.on("team_join", event => {
  rtm.sendMessage(welcomeMessageTemplate(event.user.name), generalChannelId);
});

// A new message has been posted.
rtm.on("message", event => {
  // Responding only if it is private message.
  if (event.channel === privateChannelId) rtm.sendMessage(aknowledgeMessage, event.user);
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Status endpoint.
app.get("/", (req, res) => {
  res.sendStatus(200);
});

// Received "/birthday" slack slash command.
app.get("/birthday", (req, res) => {
  rtm.sendMessage("What's your birthday ?", req.body.user_id);
  res.sendStatus(200);
});

app.listen(24605);
