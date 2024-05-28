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
  // hints.set(DecodeHintType.TRY_HARDER, true); // Fucks up
  // Function to start the video stream
  async function startVideoStream() {
    const codeReader = new BrowserMultiFormatReader();

    let selectedDeviceId;

    const vidDevices = await codeReader.listVideoInputDevices();
    selectedDeviceId = vidDevices[0].deviceId;

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: 'environment' },
      })
      .then((stream) => {
        video.srcObject = stream;
        const videoTrack = stream.getVideoTracks()[0];
        // if (
        //   !videoTrack?.getCapabilities ||
        //   !videoTrack.getCapabilities()?.torch
        // ) {
        //   window.alert(`${videoTrack?.label} cannot access the flashlight`);
        // }

        video.setAttribute('playsinline', true); // required to tell iOS safari we don't want fullscreen
        // video.play();
        scanCode(codeReader, selectedDeviceId);
      })
      .catch((err) => {
        console.error('Error accessing the camera: ', err);
      });
  }

  // Function to scan the code
  function scanCode(codeReader, selectedDeviceId) {
    codeReader
      .decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
        if (result) {
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
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Start the video stream when the page loads
  startVideoStream();
});
