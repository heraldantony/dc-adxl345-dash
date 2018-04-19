import { app, BrowserWindow, screen } from "electron";
import * as path from "path";
import * as url from "url";
var http = require("http");

var socket = require("socket.io");
var fs = require("fs");
var csv = require("csv");

var pythonShellOptions = {
  mode: "text",
  pythonOptions: ["-u"], // get print results in real-time
  scriptPath: "./adxl345"
};
var PythonShell = require("python-shell");
var port = process.env.PORT || 4200;

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === "--serve");

const server = http.createServer().listen(port);
var io = socket(server);

try {
  require("dotenv").config();
} catch {
  console.log("asar");
}

function createWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height
  });

  if (serve) {
    require("electron-reload")(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL("http://localhost:" + 4200);
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "dist/index.html"),
        protocol: "file:",
        slashes: true
      })
    );
  }

  //win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on("ready", createWindow);

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}

io.on("connection", function(client) {
  console.log("connected ", client.id);
  client.on("data-request", function(data) {
    console.log(data);
    var options = Object.assign(
      { args: [1, 50, "test.csv"] },
      pythonShellOptions
    );
    PythonShell.run("adxl345-gvalues.py", options, (err, results) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(results);
      var values=results[0].split(",");
      var numberOfSamples=50;
      var startTime=0;
      var endTime=0;
      if(values.length >= 5) {
        startTime=values[0];
        endTime=values[1];
        numberOfSamples=values[4];
      }
      var interval=(endTime-startTime)*1.00/numberOfSamples;

     var parser = csv.parse({ delimiter: "," }, function(err, data) {
     // csv.from.path(__dirname + "/test.csv").to.array(function (data) {
              var dataWithTime=[];
              data.forEach( (d,i) => {
                dataWithTime.push( [(+startTime)+i*interval].concat(data[i]));
              })
              client.emit("data-response", dataWithTime);
              fs.unlink(__dirname + "/test.csv", function(err) {
                if(!err) console.log("file removed");
                else console.log(err);
                });
      });
     fs.createReadStream(__dirname + "/test.csv").pipe(parser);
      
    });
  });
  client.on("fft-request", function(data) {
    console.log(data);
    var options = Object.assign(
      { args: [1, 50, "test-fft.csv"] },
      pythonShellOptions
    );
    PythonShell.run("adxl345-fft.py", options, (err, results) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(results);
      var values=results[0].split(",");
      var numberOfSamples=50;
      var startTime=0;
      var endTime=0;
      if(values.length >= 5) {
        startTime=values[0];
        endTime=values[1];
        numberOfSamples=values[4];
      }
      var interval=(endTime-startTime)*1.00/numberOfSamples;

     var parser = csv.parse({ delimiter: "," }, function(err, data) {
     // csv.from.path(__dirname + "/test.csv").to.array(function (data) {
 
              client.emit("fft-response", data);
              fs.unlink(__dirname + "/test-fft.csv", function(err) {
                if(!err) console.log("file removed");
                else console.log(err);
                });
      });
     fs.createReadStream(__dirname + "/test-fft.csv").pipe(parser);
      
    });
  });
  client.on("disconnect", function() {
    console.log("disconnected ", client.id);
  });
});
