import * as R from 'ramda';

export function keyArrayToRemovalHash(keys:string[]):any {
  return keysArrayAndValueToNestedValue(keys, true)
}

export function keysArrayAndValueToNestedValue(keys:string[], value: any):any {
  return R.reduceRight((k, v) => { return {[k]: v}}, value, keys)
} 