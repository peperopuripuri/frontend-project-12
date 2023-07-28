import Rollbar from 'rollbar';

const createRollbar = () => new Rollbar({
  accessToken: 'e9d6cbfb11a644ec84d8b88fed16b3c8',
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default createRollbar;
