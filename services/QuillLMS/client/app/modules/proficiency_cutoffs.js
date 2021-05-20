import proficiency_cutoffs from '../../../app/lib/data/proficiency_cutoffs.json';

export function proficiencyCutoffsAsPercentage() {
  return (
    {
      proficient: proficiency_cutoffs.proficient * 100,
      nearlyProficient: proficiency_cutoffs.nearly_proficient * 100,
    });
}

export default proficiency_cutoffs;
