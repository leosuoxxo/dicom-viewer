const { contextBridge } = require('electron');
const { machineId } = require('node-machine-id');

contextBridge.exposeInMainWorld('electron', {
  getMachineId: async () => {
    const id = await machineId({ original: true });
    return id;
  },
});
