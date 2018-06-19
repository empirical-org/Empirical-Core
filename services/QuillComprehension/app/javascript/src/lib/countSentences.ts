import nlp from 'compromise';


export function countSentences(text:string):number{
  const doc = nlp(text, null);
  return doc.sentences().length
}
