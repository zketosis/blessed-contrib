var blessed = require("blessed"),
  contrib = require("../index");

var screen = blessed.screen(),
  body = blessed.box({
    top: 1,
    left: 0,
    width: "100%",
    height: "99%",
  }),
  statusbar = blessed.box({
    top: 0,
    left: 0,
    width: "100%",
    height: 1,
    style: {
      fg: "white",
      bg: "blue",
    },
  });

screen.append(statusbar);
screen.append(body);

screen.title = "La pizza de Don Cangrejo si muy feliz.";
//create layout and widgets

var grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

var inputBar = blessed.textbox({
  bottom: 0,
  left: 1,
  height: 1,
  width: "100%",
  keys: true,
  mouse: true,
  inputOnFocus: true,
  style: {
    fg: "white",
    bg: "blue", // Blue background so you see this is different from body
  },
});
screen.append(inputBar);

var inputPre = blessed.box({
  bottom: 0,
  left: 0,
  height: 1,
  width: 1,
  content: ">",
  keys: true,
  mouse: true,
  inputOnFocus: true,
  style: {
    fg: "black",
    bg: "yellow", // Blue background so you see this is different from body
  },
});
screen.append(inputPre);

var box2 = grid.set(1, 5, 9, 3, contrib.log, {
  fg: "blue",
  selectedFg: "green",
  label: "Blue Log of those amazing commands",
});

var table = grid.set(4, 9, 4, 3, contrib.table, {
  keys: true,
  fg: "green",
  label: "Active Processes",
  columnSpacing: 1,
  columnWidth: [24, 10, 10],
});

var ServerLog = grid.set(1, 0, 11, 5, contrib.log, {
  fg: "green",
  selectedFg: "green",
  label: "Server Log",
});

//dummy data
var servers = [
  "4322433444324243422443US1",
  "409238704398749023874109US2",
  "438970293874298047EU1",
  "39873948274987AU1",
  "3343444343434AS1",
  "JP1",
];
var commands = [
  "grep",
  "eoijeoijer er node",
  "java",
  "timer",
  "~/ls -l",
  "netns",
  "watchdog",
  "gulp",
  "this is a very long long line tar -xvf",
  "awk",
  "npm install",
];

//set dummy data for table
function generateTable() {
  var data = [];

  for (var i = 0; i < 30; i++) {
    var row = [];
    row.push(commands[Math.round(Math.random() * (commands.length - 1))]);
    row.push(Math.round(Math.random() * 5));
    row.push(Math.round(Math.random() * 100));

    data.push(row);
  }

  table.setData({ headers: ["Process", "Cpu (%)", "Memory"], data: data });
}

generateTable();
table.focus();
setInterval(generateTable, 13000);

//set log dummy data
setInterval(function () {
  var rnd = Math.round(Math.random() * 2);
  if (rnd == 0)
    ServerLog.log(
      "starting process " +
        commands[Math.round(Math.random() * (commands.length - 1))]
    );
  else if (rnd == 1)
    ServerLog.log(
      "terminating server " +
        servers[Math.round(Math.random() * (servers.length - 1))]
    );
  else if (rnd == 2)
    ServerLog.log("avg. wait time " + Math.random().toFixed(2));
  screen.render();
}, 1500);

var errorsData = {
  title: "server 1",
  x: ["00:00", "00:05", "00:10", "00:15", "00:20", "00:25"],
  y: [30, 50, 70, 40, 50, 20],
};

var latencyData = {
  x: ["t1", "t2", "t3", "t4"],
  y: [5, 1, 7, 5],
};

var pct = 0.0;

screen.key(["escape", "q", "C-c"], function (ch, key) {
  return process.exit(0);
});

screen.key(["w"], function (ch, key) {
  box2 = grid.set(8, 4, 4, 4, contrib.log, {
    fg: "red",
    selectedFg: "green",
    label: "REEEEEEDDDD Log",
  });
  screen.render();
});

screen.key(["r"], function (ch, key) {
  screen.remove(box2);
});

// Handle submitting data
inputBar.on("submit", (text) => {
  ServerLog.log(text);
  logit("You are in command mode!!! press enter to ...Previous Text:" + text);
  inputBar.clearValue();
});

// Listen for enter key and focus input then
screen.key("enter", (ch, key) => {
  inputBar.focus();
  logit("You are in input mode!!! Text box down at the bottom...");
  text = "";
});

// fixes https://github.com/yaronn/blessed-contrib/issues/10
screen.on("resize", function () {
  table.emit("attach");
  ServerLog.emit("attach");
  box2.emit("attach");
});

function status(text) {
  statusbar.setContent(text);
  screen.render();
}
function logit(text) {
  body.insertLine(0, text);
  screen.render();
}

var c = 1;
setInterval(function () {
  status(new Date().toISOString());
  //logit("This is line #" + c++);
}, 1000);

screen.render();
