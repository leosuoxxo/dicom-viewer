export function getFileExtension(fileName) {
  return fileName.split('.').pop().toLowerCase();
}

export function fileToBuffer(file) {
  return new Promise(function (resolve) {
    const reader = new FileReader();
    const readFile = function () {
      resolve(reader.result);
    };

    reader.addEventListener('load', readFile);
    reader.readAsArrayBuffer(file);
  });
}
