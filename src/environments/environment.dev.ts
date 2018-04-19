// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `index.ts`, but if you do
// `ng build --env=prod` then `index.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const CONF_DEV = {
  production: false,
  environment: 'DEV',
  pythonShellOptions: {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: './adxl345'
  }
};
