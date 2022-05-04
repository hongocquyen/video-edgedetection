window.onload = function () {
  var video = document.getElementById("video");

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  var tmp = document.createElement("canvas");
  var tmpctx = tmp.getContext("2d");

  tmp.width = video.videoWidth;
  tmp.height = video.videoHeight;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  video.onplay = function () {
    var vid = this;
    var threshold = 150;

    (function loop() {
      if (!vid.paused && !vid.ended) {
        tmpctx.drawImage(vid, 0, 0);

        var imageData = tmpctx.getImageData(
          0,
          0,
          vid.videoWidth,
          vid.videoHeight
        );
        var edgeDetect = sobel(imageData, threshold);

        ctx.putImageData(edgeDetect, 0, 0);

        setTimeout(loop, 1000 / 60);
      }
    })();
  };
};

function sobel(srcImg, th) {
  var row = srcImg.height;
  var col = srcImg.width;

  var rowStep = col * 4;
  var colStep = 4;

  var data = srcImg.data;

  var dstImg = new ImageData(col, row);

  for (var i = 1; i < row - 1; i += 1)
    for (var j = 1; j < col - 1; j += 1) {
      var center = i * rowStep + j * colStep;

      var topLeft = data[center - rowStep - colStep + 1];
      var top = data[center - rowStep + 1];
      var topRight = data[center - rowStep + colStep + 1];
      var left = data[center - colStep + 1];
      var right = data[center + colStep + 1];
      var bottomLeft = data[center + rowStep - colStep + 1];
      var bottom = data[center + rowStep + 1];
      var bottomRight = data[center + rowStep + colStep + 1];

      //Calculate the gradient
      var dx =
        topRight - topLeft + 2 * (right - left) + (bottomRight - bottomLeft);
      var dy =
        bottomLeft - topLeft + 2 * (bottom - top) + (bottomRight - topRight);
      var grad = Math.sqrt(dx * dx + dy * dy);

      //Thresholding
      if (grad >= th)
        dstImg.data[center] =
          dstImg.data[center + 1] =
          dstImg.data[center + 2] =
            255;
      else
        dstImg.data[center] =
          dstImg.data[center + 1] =
          dstImg.data[center + 2] =
            0;

      dstImg.data[center + 3] = 255;
    }

  return dstImg;
}
