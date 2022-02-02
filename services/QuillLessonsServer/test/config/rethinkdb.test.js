import {
  rethinkdbConfig,
  rethinkDBHost,
  splitStringOnLast
} from '../../src/config/rethinkdb';

describe('rethinkdbConfig', () => {

  it("should work for null configs", () => {
    const config = rethinkdbConfig('url.com:4321');

    expect(config.host).toEqual('url.com');
    expect(config.port).toEqual('4321');
    expect(config.db).toEqual('quill_lessons');
    expect(config.authKey).toBeUndefined();
    expect(config.ssl).toBeUndefined();
  });

  it("should work for base configs", () => {
    const config = rethinkdbConfig('url.com:4321', 'web.2', '1234', '5678', 'true');

    expect(config.host).toEqual('url.com');
    expect(config.port).toEqual('4321');
    expect(config.db).toEqual('quill_lessons');
    expect(config.authKey).toEqual('1234');
    expect(config.ssl).toHaveProperty('ca');
  });
});

describe('rethinkDBHost', () => {
  it("should work as expected", () => {
    // no hosts
    expect(rethinkDBHost(undefined)).toEqual(null);

    // only one host
    expect(rethinkDBHost("one")).toEqual('one');
    expect(rethinkDBHost("one", null)).toEqual('one');
    expect(rethinkDBHost("one", undefined)).toEqual('one');
    expect(rethinkDBHost("one", "web.9")).toEqual('one');

    // spread requests around
    expect(rethinkDBHost("one two three", "web.1")).toEqual('two');
    expect(rethinkDBHost("one two three", "web.2")).toEqual('three');
    expect(rethinkDBHost("one two three", "web.3")).toEqual('one');
    expect(rethinkDBHost("one two three", "web.4")).toEqual('two');

    // random server picked if no dyno
    const randomHost = rethinkDBHost("one two three four", null)
    expect(['one','two','three','four'].includes(randomHost)).toBeTruthy();

    // malform dyno, also pick random
    const malformed = rethinkDBHost("one two three", "weasfasfadsf")
    expect(['one','two','three','four'].includes(malformed)).toBeTruthy();
  });

  // this isn't completely deterministic, but highly likely to be
  it("should, by random spread, use each host at least once if there are 3 hosts and 50 servers", () => {
    const values = "one two three"
    const fiftyRandom = Array.from({length: 50}, (v,i) => rethinkDBHost(values))

    expect(fiftyRandom.includes('one')).toBeTruthy();
    expect(fiftyRandom.includes('two')).toBeTruthy();
    expect(fiftyRandom.includes('three')).toBeTruthy();
  });
});

describe('splitStringOnLast', () => {
  it("should split", () => {
    // no occurences
    expect(splitStringOnLast("http//url.com1234", ":")).toEqual(['http//url.com1234', null]);
    // one occurence
    expect(splitStringOnLast("url.com:1234", ":")).toEqual(['url.com', '1234']);
    // multiple occurrences
    expect(splitStringOnLast("http://url.com:1234", ":")).toEqual(['http://url.com', '1234']);
  });
});
