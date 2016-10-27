var keypress = require("keypress");
var five = require("johnny-five");
var Sumobot = require("sumobot")(five);

keypress(process.stdin);

var board = new five.Board();

board.on("ready", function() {

  console.log("Welcome to Sumobot Jr!");

  // Initialize a new Sumobot.
  // - Left Servo is attached to pin 1
  // - Right Servo is attached to pin 2
  // - Speed set to 0.50 (half of max speed)
  //
  var bot = new Sumobot({
    left: 10,
    right: 9,
    speed: 0.50
  });

  // Maps key names to bot methods
  var actions = {
    up: "fwd",
    down: "rev",
    left: "left",
    right: "right",
    space: "stop"
  };

  // Ensure the bot is stopped
  bot.stop();

  // A bit of keypress ceremony ;)
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", function(ch, key) {
    var action;

    if (!key) {
      return;
    }

    action = actions[key.name] || key.name;
    console.log('performing action:', action)

    if (action == "q") {
      console.log("Quitting");
      bot.stop();
      setTimeout(process.exit, 500);
    }

    if (bot[action]) {
      bot[action]();
    }
  });
});