export function getExtensions(fileName) {
  return fileName.split('.').pop().toLowerCase();
}


export function fileToBuffer (file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader()
    const readFile = function(event) {
      const buffer = reader.result
      resolve(buffer)
    }

    reader.addEventListener('load', readFile)
    reader.readAsArrayBuffer(file)
  })
}