import {
  keyArrayToRemovalHash, keysArrayAndValueToNestedValue
} from './rethinkdb_helpers'

test('building objects for removal', () => {
  const keys = ["a", "b", "c"]
  const payload = keyArrayToRemovalHash(keys)
  expect(payload).toEqual({"a": {"b": {"c": true}}})
})

test('building objects for update', () => {
  const keys = ["a", "b", "c"]
  const value = "bar"
  const expected = {"a": {"b": {"c": value}}}
  const payload = keysArrayAndValueToNestedValue(keys, value)
  expect(payload).toEqual(expected)
})