process.env['TF_CPP_MIN_LOG_LEVEL'] = '2'
jest.setTimeout(10 * 1000);
console.warn = jest.fn()
