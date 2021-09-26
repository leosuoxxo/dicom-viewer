import CryptoJS from 'crypto-js';

const salt = 'asw355dj+eudh_!ewhjw12_!665el';

export const getMachineId = async () => {
  const machineId = await window.electron.getMachineId();
  return machineId;
};

export const encryptMachineId = (machineId) => {
  return CryptoJS.AES.encrypt(machineId, salt).toString();
};

export const decryptCode = (code) => {
  const bytes = CryptoJS.AES.decrypt(code, salt);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const validateMachineId = async (code) => {
  const machineId = await window.electron.getMachineId();
  return decryptCode(code) === machineId;
};
