var Spritesmith = require('spritesmith');
var fs = require('fs');
var glob = require('glob');
var path = require('path');

// Create a new spritesmith and process our images
var sprites = ['fork.png', 'github.png', 'twitter.png'];
var spritesmith = new Spritesmith();

// spritesmith.createImages(sprites, function handleImages(err, images) {
//   images[0].width; // Width of image
//   images[0].height; // Height of image

//   // Create our result
//   var result = spritesmith.processImages(images);
//   result.image; // Readable stream outputting image
//   result.coordinates; // Object mapping filename to {x, y, width, height} of image
//   result.properties; // Object with metadata about spritesheet {width, height}

//   fs.writeFileSync(__dirname + "/alt-diagonal.png", images);
// });

glob('./blocks/*.png', (err, files) => {
  if (err) {
    console.log(err);
    throw err;
  }

  Spritesmith.run(
    {
      //src: path.join("./", "pork.png") //path. __dirname + "/src/*.png"
      src: files,
      destCSS: './client/css/generated/icons.css',
      // src: [
      //   __dirname + "**/*.png",
      //   //__dirname + "/github.png",
      //   //__dirname + "/twitter.png"
      // ],
      //algorithm: "alt-diagonal"
    },
    function handleResult(err, result) {
      // If there was an error, throw it
      if (err) {
        console.log(err);
        throw err;
      }

      // Output the image
      fs.writeFileSync(__dirname + '/alt-diagonal.png', result.image);
      console.log(result);
      let css = ``;
      Object.keys(result.coordinates).forEach(coordinateKey => {
        css += `
            ${coordinateKey} {
            top: ${result.coordinates[coordinateKey].x}px;
            left: ${result.coordinates[coordinateKey].y}px;
        }`;
      });

      fs.writeFileSync(__dirname + '/alt-diagonal.css', css);

      //result.coordinates, result.properties; // Coordinates and properties
    },
  );
});
