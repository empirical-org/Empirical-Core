// Expected use:
// node delete_unused_data.js <ENV> <COMMIT?>
// Examples of valid calls:
// `node delete_unused_data.js staging commit` will execute the script on the Staging environment and delete data
// `node delete_unused_data.js prod` will execute the script on the Prod environment, but only print out which keys it intends to delete rather than actually deleting them

const request = require('request-promise');

const stagingString = 'staging';
const prodString = 'prod';
const validEnvs = [stagingString, prodString];
const ENV = process.argv[2];
if (!validEnvs.includes(ENV)) {
  process.stdout.write(
    `This script must be run with a command line flag of either '${prodString}' or '${stagingString}'.
In order to actually execute the script against the database include a command line arg of "commit".\n`);
  process.exit();
}
const prod = (ENV === prodString);

const stagingUrl = 'https://quillconnectstaging.firebaseio.com';
const prodUrl = 'https://quillconnect.firebaseio.com';
const baseUrl = prod ? prodUrl : stagingUrl;

const commitArg = 'commit';
const dryRun = (!process.argv.includes(commitArg))

const productionKeysInUse = [
  'v2',
  'v3'
];

async function asyncForEach(targetArray, callback) {
  for (let index = 0; index < targetArray.length; index++) {
    await callback(targetArray[index], index, targetArray);
  }
}

function fetchSubKeys(ref, excludeKeys) {
  excludeKeys = excludeKeys || [];
  const options = {
    method: 'GET',
    uri: `${baseUrl}/${ref || ''}.json`,
    qs: {shallow: 'true'},
    json: true
  }
  return new Promise((resolve, reject) => {
    request(options).
      then((keyObj) => {
        const keys = Object.keys(keyObj);
        resolve(keys.filter((key) => !excludeKeys.includes(key)))
      }).
      catch((err) => reject(err));
  })
}

function deleteKey(key) {
  const options = {
    method: 'DELETE',
    uri: `${baseUrl}${key}.json`
  }
  process.stdout.write(`Deleting key ${key}... `);
  return request(options).
    then((resp) => process.stdout.write(`done\n`)).
    catch((err) => {
      const errObj = JSON.parse(err.error);
      // Conditional checking on raw error message because the status code 400 can be used for multiple issues,
      // but we only have error handling conditions for one of them.
      if (errObj.error === "Data to write exceeds the maximum size that can be modified with a single request.") {
        process.stdout.write(`Key holds too much data.  Recursively deleting sub-keys...\n`);
        deleteKeys(key)
      } else {
        process.stdout.write(`${errObj.error}\n`);
      }
    });
}

function deleteKeys(rootKey, excludeKeys) {
  fetchSubKeys(rootKey, excludeKeys).
    then((keys) => {
      asyncForEach(keys, async function(key) {
        if (dryRun) {
          process.stdout.write(`Will delete: ${key}\n`);
        } else {
          // We want to make deletions synchronous so that we don't get flagged as spamming Firebase
          // Wait for each deletion to complete before triggering the next
          await deleteKey(`${rootKey}/${key}`);
        }
      })
    }).
    catch((err) => process.stdout.write(`${err}\n`));
}

function deleteRootLevelKeys(excludeKeys) {
  deleteKeys('', excludeKeys);
}

deleteRootLevelKeys(productionKeysInUse);
