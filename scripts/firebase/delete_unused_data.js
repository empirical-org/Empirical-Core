const request = require('request-promise');


const ENV = process.argv[2];
let prod = false;
let baseUrl = '';
if (ENV == 'prod') {
  prod = true;
  baseUrl = 'https://quillconnect.firebaseio.com';
} else if (ENV == 'staging') {
  prod = false;
  baseUrl = 'https://quillconnectstaging.firebaseio.com';
} else {
  process.stdout.write(
`This script must be run with a command line flag of either 'prod' or 'staging'.
In order to actually execute the script against the database include a command line arg of "commit".\n`);
  process.exit();
}


let dryRun = true;
if (process.argv.includes('commit')) {
  dryRun = false;
} else {
  dryRun = true;
}


const productionKeysInUse = [
  'v2',
  'v3'
];


async function fetchSubKeys(ref, excludeKeys) {
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
    uri: `${baseUrl}/${key}.json`
  }
  request(options).
    then((resp) => process.stdout.write(`${resp}\n`));
}


function deleteRootLevelKeys(excludeKeys) {
  fetchSubKeys('', excludeKeys).
    then((keys) => {
      keys.forEach((key) => {
        if (dryRun) {
          process.stdout.write(`${key}\n`);
        } else {
          deleteKey(key);
        }
      })
    }).
    catch((err) => process.stdout.write(`${err}\n`));
}


deleteRootLevelKeys(productionKeysInUse);
