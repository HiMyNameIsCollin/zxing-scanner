document.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('video');
  const { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } = ZXing;
  const hints = new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_8,
    BarcodeFormat.EAN_13,
    BarcodeFormat.UPC_EAN_EXTENSION,
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93,
    BarcodeFormat.CODE_128,
  ]);
  hints.set(DecodeHintType.TRY_HARDER, true);
  // Function to start the video stream
  function startVideoStream() {
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: 'environment' },
      })
      .then((stream) => {
        video.srcObject = stream;
        const videoTrack = stream.getVideoTracks()[0];
        if (!videoTrack.getCapabilities()?.torch) {
          window.alert(`${videoTrack?.label} cannot access the flashlight`);
        }
        document
          .getElementById('turnOnFlashlight')
          .addEventListener('click', () => {
            videoTrack
              .applyConstraints({ advanced: [{ torch: true }] })
              .catch((error) =>
                console.error('Error turning on flashlight:', error),
              );
          });

        document
          .getElementById('turnOffFlashlight')
          .addEventListener('click', () => {
            videoTrack
              .applyConstraints({ advanced: [{ torch: false }] })
              .catch((error) =>
                console.error('Error turning off flashlight:', error),
              );
          });
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
      .decodeFromVideoDevice(
        null,
        'video',
        (result, err) => {
          if (result) {
            console.log(result);
            window.alert(
              `Type: ${BarcodeFormat?.[result.format]}, Code: ${result.text}`,
            );
            // // Stop the video stream after successful scan
            // const stream = video.srcObject;
            // const tracks = stream.getTracks();
            // tracks.forEach((track) => track.stop());
            // video.srcObject = null;
          }
          if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error(err);
          }
        },
        hints,
      )
      .catch((err) => {
        console.error(err);
      });
  }

  // Start the video stream when the page loads
  startVideoStream();
});
