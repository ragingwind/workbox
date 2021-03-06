importScripts('/node_modules/mocha/mocha.js');
importScripts('/node_modules/chai/chai.js');
importScripts('/node_modules/sw-testing-helpers/build/browser/mocha-utils.js');
importScripts('/__test/bundle/workbox-precaching');

/* global workbox */

const expect = self.chai.expect;
self.chai.should();
mocha.setup({
  ui: 'bdd',
  reporter: null,
});

describe('Test Library Surface', function() {
  it('should be accessible via workbox.precaching', function() {
    expect(workbox.precaching).to.exist;
  });

  it('should have RevisionedCacheManager via workbox.precaching', function() {
    expect(workbox.precaching.RevisionedCacheManager).to.exist;
  });

  it.skip('should have UnrevisionedCacheManager via workbox.precaching', function() {
    expect(workbox.precaching.UnrevisionedCacheManager).to.exist;
  });

  it('should be able to get the revisioned cache manager via workbox.precaching', function() {
    const revisionedManager = new workbox.precaching.RevisionedCacheManager();
    expect(revisionedManager).to.exist;

    const cacheName = revisionedManager.getCacheName();
    if (!cacheName || typeof cacheName !== 'string' || cacheName.length === 0) {
      throw new Error('Unexpected cache name: ' + cacheName);
    }

    let cacheUrls = revisionedManager.getCachedUrls();
    if (!Array.isArray(cacheUrls) || cacheUrls.length !== 0) {
      throw new Error('Unexpected cacheUrls value: ' + JSON.stringify(cacheUrls));
    }

    const URL_1 = '/';
    const URL_2 = '/__echo/date/example.1234.txt';
    revisionedManager.addToCacheList({
      revisionedFiles: [{
        url: URL_1,
        revision: '1234',
      },
      URL_2,
    ],
    });

    cacheUrls = revisionedManager.getCachedUrls();
    if (!Array.isArray(cacheUrls) || cacheUrls.length !== 2) {
      throw new Error('Unexpected cacheUrls value: ' + JSON.stringify(cacheUrls));
    }

    const urlsToFind = [URL_1, URL_2];
    urlsToFind.forEach((urlToFind) => {
      if (cacheUrls.indexOf(new URL(urlToFind, location).href) === -1) {
        throw new Error(`Unable to find value '${urlToFind}' in cacheUrls: ` + JSON.stringify(cacheUrls));
      }
    });
  });

  it.skip('should be able to get the unrevisioned cache manager via workbox.precaching', function() {
    const unrevisionedManager = new workbox.precaching.UnrevisionedCacheManager();
    expect(unrevisionedManager).to.exist;

    const cacheName = unrevisionedManager.getCacheName();
    if (!cacheName || typeof cacheName !== 'string' || cacheName.length === 0) {
      throw new Error('Unexpected cache name: ' + cacheName);
    }

    let cacheUrls = unrevisionedManager.getCachedUrls();
    if (!Array.isArray(cacheUrls) || cacheUrls.length !== 0) {
      throw new Error('Unexpected cacheUrls value: ' + JSON.stringify(cacheUrls));
    }

    const URL_1 = '/';
    const URL_2 = '/__echo/date/example.1234.txt';
    unrevisionedManager.addToCacheList({
      unrevisionedFiles: [
        new Request(URL_1),
        URL_2,
      ],
    });

    cacheUrls = unrevisionedManager.getCachedUrls();
    if (!Array.isArray(cacheUrls) || cacheUrls.length !== 2) {
      throw new Error('Unexpected cacheUrls value: ' + JSON.stringify(cacheUrls));
    }

    const urlsToFind = [URL_1, URL_2];
    urlsToFind.forEach((urlToFind) => {
      if (cacheUrls.indexOf(new URL(urlToFind, location).href) === -1) {
        throw new Error(`Unable to find value '${urlToFind}' in cacheUrls: ` + JSON.stringify(cacheUrls));
      }
    });
  });
});
