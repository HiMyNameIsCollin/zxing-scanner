document.addEventListener('DOMContentLoaded', (event) => {
  const codeReader = new ZXing.BrowserMultiFormatReader();
  console.log('Init success');
  codeReader
    .getVideoInputDevices()
    .then((videoInputDevices) => {
      const firstDeviceId = videoInputDevices[0]?.deviceId;
      console.log(firstDeviceId);
      if (!firstDeviceId) return;
      const previewElem = document.querySelector('#video');
      codeReader.decodeFromVideoDevice(
        firstDeviceId,
        previewElem,
        (result, err) => {
          if (result) {
            console.log(result);
            console.log(result.text);
            alert('Barcode detected: ' + result.text);
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
