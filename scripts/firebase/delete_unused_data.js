const prod = false;
//const prod = true;

const request = require('request-promise');


let baseUrl = '';
if (prod) {
  baseUrl = 'https://quillconnect.firebaseio.com';
} else {
  baseUrl = 'https://quillconnectstaging.firebaseio.com';
}

const excludeKeys = [
  'v2',
  'v3'
];

async function fetchSubKeys(ref) {
  const options = {
    method: 'GET',
    uri: `${baseUrl}/${ref || ''}.json?shallow=true`,
    qs: {shallow: 'true'},
    json: true
  }
  return new Promise((resolve, reject) => {
    request(options).
      then((keyObj) => {
        const keys = Object.keys(keyObj);
        resolve(keys.filter((key) => !excludeKeys.includes(key)))
      });
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

def main() {
  fetchSubKeys().
    then((keys) => {
      keys.forEach((key) => {
        process.stdout.write(`${key}\n`);
        deleteKey(key);
      })
    })
}

main();
