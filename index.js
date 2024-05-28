const video = document.getElementById('video');

document.addEventListener('DOMContentLoaded', function () {
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
  async function startVideoStream() {
    const codeReader = new BrowserMultiFormatReader();

    let selectedDeviceId;

    const vidDevices = await codeReader.listVideoInputDevices();
    selectedDeviceId = vidDevices[0].deviceId;

    scanCode(codeReader, selectedDeviceId);
  }

  // Function to scan the code
  function scanCode(codeReader, selectedDeviceId) {
    codeReader
      .decodeFromVideoDevice(
        selectedDeviceId,
        'video',
        (result, err) => {
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
video.onloadedmetadata = () => {
  console.log(123);
  stream = video.srcObject;
  track = stream.getVideoTracks()[0];
  console.log(track.getCapabilities());
  track
    .applyConstraints({
      torch: true,
    })
    .catch((err) => {
      console.error('Error applying constraints:', err);
    });
};

// Function to toggle the flashlight on/off
function toggleFlashlight() {
  if (track) {
    let constraints = track.getConstraints();
    let torchState = constraints?.torch;
    track
      .applyConstraints({
        advanced: [{ torch: !torchState }],
      })
      .catch((err) => {
        console.error('Error toggling torch:', err);
      });
  }
}
