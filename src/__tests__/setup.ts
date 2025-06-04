import nock from 'nock';

// Mock environment variables for tests
process.env.CF_API_TOKEN = 'test-token';
process.env.CF_ZONE_NAME = 'example.com';
process.env.CF_RECORD_NAME = 'test.example.com';
process.env.NODE_ENV = 'test';

// Clean up nock after each test
afterEach(() => {
  nock.cleanAll();
});
