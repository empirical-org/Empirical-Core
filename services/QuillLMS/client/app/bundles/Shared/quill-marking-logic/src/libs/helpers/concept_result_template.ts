export function conceptResultTemplate(conceptUID: string, correct: boolean = false){
  return {
    conceptUID,
    correct,
  }
}