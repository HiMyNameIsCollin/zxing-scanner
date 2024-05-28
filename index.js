document.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('video');
  const hints = new Map();
  console.log(ZXingBrowser);
  hints.set(decodeHints.POSSIBLE_FORMATS, [
    barcodeFormats.UPC_A,
    barcodeFormats.UPC_E,
    barcodeFormats.QR_CODE,
    barcodeFormats.EAN_8,
    barcodeFormats.EAN_13,
    barcodeFormats.UPC_EAN_EXTENSION,
    barcodeFormats.CODE_39,
    barcodeFormats.CODE_93,
    barcodeFormats.CODE_128,
  ]);
  hints.set(decodeHints.TRY_HARDER, true);
  // Function to start the video stream
  function startVideoStream() {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'environment',
          advanced: [{ torch: true }],
        },
      })
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
    const codeReader = new ZXingBrowser.BrowserMultiFormatReader();
    codeReader.setHints(hints);
    codeReader
      .decodeFromVideoDevice(
        null,
        'video',
        (result, err) => {
          if (result) {
            console.log(result);
            window.alert(result.text);
            // // Stop the video stream after successful scan
            // const stream = video.srcObject;
            // const tracks = stream.getTracks();
            // tracks.forEach((track) => track.stop());
            // video.srcObject = null;
          }
          // if (err && !(err instanceof ZXing.NotFoundException)) {
          //   console.error(err);
          // }
        },
        hints,
      )
      .catch((err) => {
        console.error(err);
      });
    console.log(codeReader);
  }

  // Start the video stream when the page loads
  startVideoStream();
});

const decodeHints = {
  0: 'OTHER',
  1: 'PURE_BARCODE',
  2: 'POSSIBLE_FORMATS',
  3: 'TRY_HARDER',
  4: 'CHARACTER_SET',
  5: 'ALLOWED_LENGTHS',
  6: 'ASSUME_CODE_39_CHECK_DIGIT',
  7: 'ENABLE_CODE_39_EXTENDED_MODE',
  8: 'ASSUME_GS1',
  9: 'RETURN_CODABAR_START_END',
  10: 'NEED_RESULT_POINT_CALLBACK',
  11: 'ALLOWED_EAN_EXTENSIONS',
  OTHER: 0,
  PURE_BARCODE: 1,
  POSSIBLE_FORMATS: 2,
  TRY_HARDER: 3,
  CHARACTER_SET: 4,
  ALLOWED_LENGTHS: 5,
  ASSUME_CODE_39_CHECK_DIGIT: 6,
  ENABLE_CODE_39_EXTENDED_MODE: 7,
  ASSUME_GS1: 8,
  RETURN_CODABAR_START_END: 9,
  NEED_RESULT_POINT_CALLBACK: 10,
  ALLOWED_EAN_EXTENSIONS: 11,
};

const barcodeFormats = {
  0: 'AZTEC',
  1: 'CODABAR',
  2: 'CODE_39',
  3: 'CODE_93',
  4: 'CODE_128',
  5: 'DATA_MATRIX',
  6: 'EAN_8',
  7: 'EAN_13',
  8: 'ITF',
  9: 'MAXICODE',
  10: 'PDF_417',
  11: 'QR_CODE',
  12: 'RSS_14',
  13: 'RSS_EXPANDED',
  14: 'UPC_A',
  15: 'UPC_E',
  16: 'UPC_EAN_EXTENSION',
  AZTEC: 0,
  CODABAR: 1,
  CODE_39: 2,
  CODE_93: 3,
  CODE_128: 4,
  DATA_MATRIX: 5,
  EAN_8: 6,
  EAN_13: 7,
  ITF: 8,
  MAXICODE: 9,
  PDF_417: 10,
  QR_CODE: 11,
  RSS_14: 12,
  RSS_EXPANDED: 13,
  UPC_A: 14,
  UPC_E: 15,
  UPC_EAN_EXTENSION: 16,
};
