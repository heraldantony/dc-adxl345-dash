export const CONF_PROD = {
  production: true,
  environment: 'PROD',
  pythonShellOptions: {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: './adxl345'
  }
};
