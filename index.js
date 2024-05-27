document.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('video');
  const { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } = ZXing;
  const hints = new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
  ]);
  hints.set(DecodeHintType.TRY_HARDER, true);
  hints.set(DecodeHintType.PURE_BARCODE, true);
  hints.set(DecodeHintType.CHARACTER_SET, 'UTF-8');
  hints.set(DecodeHintType.ALLOWED_LENGTHS, [12, 13]);
  hints.set(DecodeHintType.ASSUME_GS1, true);
  // Function to start the video stream
  function startVideoStream() {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
        video.play();
        scanCode();
      })
      .catch((err) => {
        console.error('Error accessing the camera: ', err);
      });
  }

  // Function to scan the code
  function scanCode() {
    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .decodeFromVideoDevice(null, 'video', (result, err) => {
        if (result) {
          console.log(result);
          window.alert(result.text);
          // // Stop the video stream after successful scan
          // const stream = video.srcObject;
          // const tracks = stream.getTracks();
          // tracks.forEach((track) => track.stop());
          // video.srcObject = null;
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
          console.error(err);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Start the video stream when the page loads
  startVideoStream();
});

console.log(321);
