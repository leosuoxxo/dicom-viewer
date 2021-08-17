import dicomParser from 'dicom-parser';

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

export function convertDiconde(bytes) {
  const dicomData = dicomParser.parseDicom(bytes);
  const modifiedBytes = new Uint8Array(bytes.length);

  // preamble and prefixing 'DICM'
  const preableLength = 128;
  const dicomPrefix = 'DICM';
  let totalPrefixLength = preableLength + dicomPrefix.length;
  modifiedBytes.set(bytes.subarray(0, totalPrefixLength), 0);

  // data elements
  let rIndex = totalPrefixLength;
  let wIndex = totalPrefixLength;
  while (rIndex < bytes.length) {
    const tag = new Uint16Array(bytes.slice(rIndex, rIndex + 4).buffer);
    const tagStr =
      'x' +
      tag[0].toString(16).padStart(4, '0') +
      tag[1].toString(16).padStart(4, '0');

    const element = dicomData.elements[tagStr];
    const dataBegin = element.dataOffset;
    const dataEnd = dataBegin + element.length;
    const infoLength = dataBegin - rIndex;

    switch (tagStr) {
      case 'x00281050':
      case 'x00281051': {
        console.log(`Ignore tag: ${tagStr}`);
        break;
      }
      case 'x00280008': {
        // write Tag and VR
        modifiedBytes.set(bytes.subarray(rIndex, rIndex + 6), wIndex);
        wIndex += 6;
        // write Value Length
        modifiedBytes.set([1, 0], wIndex);
        wIndex += 2;
        // write Value Field
        modifiedBytes.set(['1'.charCodeAt()], wIndex);
        wIndex += 1;
        break;
      }
      case 'x00280002': {
        // write Tag and VR
        modifiedBytes.set(bytes.subarray(rIndex, rIndex + 6), wIndex);
        wIndex += 6;
        // write Value Length
        modifiedBytes.set([2, 0], wIndex);
        wIndex += 2;
        // write Value Field
        modifiedBytes.set([1, 0], wIndex);
        wIndex += 2;
        break;
      }
      default: {
        // write Tag, VR, and Value Length
        modifiedBytes.set(bytes.subarray(rIndex, dataEnd), wIndex);
        wIndex += infoLength;
        // write Value Field
        modifiedBytes.set(bytes.subarray(dataBegin, dataEnd), wIndex);
        wIndex += element.length;
      }
    }

    rIndex = dataEnd;
  }

  const actualWrittenBytes = modifiedBytes.slice(0, wIndex);
  return actualWrittenBytes;
}
