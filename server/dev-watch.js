const TscWatchClient = require("tsc-watch/client");
const watch = new TscWatchClient();
const exec = require("child_process").execFile;
const fs = require("fs");

watch.on("started", () => {
    console.log("Compilation started");
});

watch.on("first_success", () => {
    console.log("First success!");
    pushFiles();
});

watch.on("success", () => {
    // Your code goes here...
    pushFiles();
});

watch.on("compile_errors", () => {
    // Your code goes here...
    console.log("compile_errors!");
});

watch.start("--project", ".");


function pushFiles() {
    fs.mkdirSync("dist/tmp", { recursive: true });
    fs.writeFile("dist/tmp/restart.txt", Date().toString(), function (err) {
        if (err) {
            console.log("Erreur: " + err)
        } else {
            console.log("success!");
            exec("rsync", ["-avz", "dist/", "-e", "ssh -p 5022", "ganazpbh@ganaye.com:slego-io-dev/", "--exclude", "node_modules/"], function (err, data) {
                console.log(err)
                console.log(data.toString());
            });
        }
    });

}