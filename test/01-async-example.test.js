'use strict';

require('chromedriver');
const { Builder, By } = require('selenium-webdriver');
const { Eyes, VisualGridRunner, Configuration, Target, BatchInfo, BrowserType, DeviceName, ScreenOrientation } = require('@applitools/eyes-selenium');

describe('AsyncVisualGridDemo', function () {
  let runner, eyes, batch, driver;

  before(() => {
    batch = new BatchInfo('Demo batch');

    // Initialize the Runner for your test.
    runner = new VisualGridRunner();
  });

  beforeEach(async () => {
    // Initialize the eyes SDK
    eyes = new Eyes(runner);

    // How, you have an ability to use new Configuration class to setup everything
    // It has all configuration methods from Eyes class and more (to setup emulation devices)
    const config = new Configuration();

    // Add your personal Applitols API key (the API key can be set via APPLITOOLS_API_KEY env variable)
    // config.setApiKey('{APPLITOOLS_API_KEY}'); // or using this method

    // Set the App name and the Test name
    config.setAppName('Demo VisualGrid app');
    config.setTestName('JS Smoke test');

    // set batch name
    config.setBatch(batch);

    // Set concurrent sessions (upto 100, depending on your license)
    config.setConcurrentSessions(4);

    // Add Chrome browser with two different viewports
    config.addBrowser(800, 600, BrowserType.CHROME);
    config.addBrowser(700, 500, BrowserType.CHROME);

    // Add Firefox browser with two different viewports
    config.addBrowser(1200, 800, BrowserType.FIREFOX);
    config.addBrowser(1600, 1200, BrowserType.FIREFOX);

    // Add iPhone 4 with Portrait mode
    config.addDeviceEmulation(DeviceName.iPhone_4, ScreenOrientation.PORTRAIT);

    // Set the config to eyes
    eyes.setConfiguration(config);

    // Use Chrome browser
    driver = await new Builder().forBrowser('chrome').build();
  });

  it('asyncTest', async () => {
    // Define links to process
    const urlsToTest = [
      'https://applitools.com/helloworld',
      'http://applitools-dom-capture-origin-1.surge.sh/testWithIframe.html',
      'http://applitools.github.io/demo/TestPages/FramesTestPage/',
    ];

    // Run test for each link
    for (const url of urlsToTest) {
      try {
        // Navigate to the URL we want to test
        await driver.get(url);

        // Call Open on eyes to initialize a test session
        await eyes.open(driver);

        // Check the page
        await eyes.check('Main Page ' + url, Target.window());

        // Close eyes asynchronously
        await eyes.closeAsync();
      } catch (e) {
        console.log('Error', e); // eslint-disable-line
      }
    }
  });

  afterEach(async () => {
    // Close the browser.
    await driver.quit();

    // If the test was aborted before eyes.close was called, ends the test as aborted.
    await eyes.abortIfNotClosed();
  });

  after(async () => {
    // This will return all results as an array
    const results = await eyes.getRunner().getAllTestResults();
    console.log(results);
  });
});
