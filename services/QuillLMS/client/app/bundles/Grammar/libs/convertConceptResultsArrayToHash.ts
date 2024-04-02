import * as _ from 'underscore';

export default function convertConceptResultsArrayToHash(crArray: any) {
  const crs = _.values(crArray);
  const newHash: {[key:string]: Boolean} = {};
  _.each(crs, (val) => {
    if (val.conceptUID && val.conceptUID.length > 0) {
      newHash[val.conceptUID] = val.correct;
    }
  });
  return newHash;
}
