'use strict';

describe('EC.modules.setter', function () {
  beforeEach(function () {
    this.module = new EC.modules.setter();
    this.object = {
      key1: 'value1',
      key2: {
        key21: 'value21',
        key22: 'value22'
      }
    };
    this.path = '';
    this.value = 'newValue';
    this.subject = function () {
      return this.module.setOrExtend(this.object, this.path, this.value)
    }
  });

  it('exists', function () {
    expect(this.module).to.be.ok()
  });

  it('works for 1st-level non-objects being replaced by non-objects', function () {
    var actual, expected;
    this.path = 'key1'
    actual = this.subject()
    expected = {
      key1: 'newValue',
      key2: {
        key21: 'value21',
        key22: 'value22'
      }
    }
    expect(actual).to.eql(expected);
  });

  it('works for 1st-level non-objects being replaced by objects', function () {
    var actual, expected;
    this.path = 'key1';
    this.value = {newKey: 'newValue'}
    actual = this.subject();
    expected = {
      key1: {newKey: 'newValue'},
      key2: {
        key21: 'value21',
        key22: 'value22'
      }
    }
    expect(actual).to.eql(expected)
  })

  it('works for 1st-level objects being replaced by non-objects', function () {
    var actual, expected;
    this.path = 'key2'
    this.value = 'newValue'
    actual = this.subject()
    expected = {
      key1: 'value1',
      key2: 'newValue'
    }
    expect(actual).to.eql(expected)
  })

  it('works for 1st-level objects being replaced by objects (extends them)', function () {
    var actual, expected;
    this.path = 'key2'
    this.value = {key21: 'newValue21', key23: 'value23'}
    actual = this.subject();
    expected = {
      key1: 'value1',
      key2: {key21: 'newValue21', key22: 'value22', key23: 'value23'}
    }
    expect(actual).to.eql(expected)
  })

  it('', function () {
    var actual, expected;
    this.path = 'key2'
    this.value = {
      key21: 'newValue21',
      key23: {
        key231: 'newValue231',
        key233: {
          key2331: 'newValue2331'
        }
      }
    }

    this.object = {
      key1: 'value1',
      key2: {
        key21: 'value21',
        key22: 'value22',
        key23: {
          key231: 'value231',
          key232: 'value232',
          key233: {
            key2331: 'value2331',
            key2332: 'value2332'
          }
        }
      }
    };

    actual = this.subject();
    expected = {
      key1: 'value1',
      key2: {
        key21: 'newValue21',
        key22: 'value22',
        key23: {
          key231: 'newValue231',
          key232: 'value232',
          key233: {
            key2331: 'newValue2331',
            key2332: 'value2332'
          }
        }
      }
    };

    expect(actual).to.eql(expected)
  });


 })












