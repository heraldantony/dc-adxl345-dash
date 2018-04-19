export const CONF_LOCAL = {
  production: false,
  environment: 'LOCAL',
  pythonShellOptions: {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: './adxl345'
  }
};
