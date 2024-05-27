document.addEventListener('DOMContentLoaded', (event) => {
  const codeReader = new ZXing.BrowserBarcodeReader();

  codeReader
    .getVideoInputDevices()
    .then((videoInputDevices) => {
      const firstDeviceId = videoInputDevices[0]?.deviceId;
      if (!firstDeviceId) return;
      codeReader.decodeFromVideoDevice(
        firstDeviceId,
        'video',
        (result, err) => {
          if (result) {
            console.log(result.text);
            alert('Barcode detected: ' + result.text);
            // Optionally stop the scanning after a successful scan
            codeReader.reset();
          }
          if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error(err);
          }
        },
      );
    })
    .catch((err) => {
      console.error(err);
    });
});
