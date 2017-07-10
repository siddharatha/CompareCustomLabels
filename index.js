var oldfilename = "customlabels.screwedup";
var newfilename = "customlabels.new";

var fs = require("fs"),
  xml2js = require("xml2js");

var parser = new xml2js.Parser();
var newLabels = {};
var changedLabels = {};
function readFile(objectmap, filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/" + filename, function(err, data) {
      parser.parseString(data, function(err, result) {
        result.CustomLabels.labels.forEach(eachLabel => {
          objectmap[eachLabel.fullName] = eachLabel.value[0];
        });
      });
      resolve(objectmap);
    });
  });
}
var oldmap = {};
var newmap = {};
readFile({}, oldfilename)
  .then(objectmap => {
    oldmap = objectmap;
    return readFile({}, newfilename);
  })
  .then(objectmap => {
    newmap = objectmap;
    Object.keys(newmap).forEach(eachLabel => {
      if (oldmap.hasOwnProperty(eachLabel)) {
        if (oldmap[eachLabel] !== newmap[eachLabel])
          changedLabels[eachLabel] = {
            oldValue: oldmap[eachLabel],
            newValue: newmap[eachLabel]
          };
      } else newLabels[eachLabel] = newmap[eachLabel];
    });
    console.log("Changed Labels", Object.keys(changedLabels).length);
    fs.writeFile(
      "changes.json",
      JSON.stringify(changedLabels, null, 2),
      function(err) {}
    );
    fs.writeFile(
      "newentries.json",
      JSON.stringify(newLabels, null, 2),
      function(err) {}
    );
  });
