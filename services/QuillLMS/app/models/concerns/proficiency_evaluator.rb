module ProficiencyEvaluator
  extend ActiveSupport::Concern

  def self.proficiency_cutoff
    cutoffs_hash['proficient']
  end

  def self.nearly_proficient_cutoff
    cutoffs_hash['nearly_proficient']
  end

  def self.proficient_and_not_sql
    "SUM(CASE WHEN user_info.average_score >= #{proficiency_cutoff} THEN 1 ELSE 0 END) as proficient_student_count,
     SUM(CASE WHEN user_info.average_score < #{proficiency_cutoff} THEN 1 ELSE 0 END) as not_proficient_student_count"
  end

  def self.evaluate(score)
    if score >= proficiency_cutoff
      "Proficient"
    else
      "Not yet proficient"
    end
  end

  def self.lump_into_center_of_proficiency_band(percentage)
    case percentage
    when proficiency_cutoff..1.0
      (proficiency_cutoff + 1) / 2
    when nearly_proficient_cutoff...proficiency_cutoff
      (proficiency_cutoff + nearly_proficient_cutoff) / 2
    when 0.0...nearly_proficient_cutoff
      nearly_proficient_cutoff / 2
    else
      0.0
    end
  end

  def self.cutoffs_hash
    JSON.parse(File.read(Rails.root.join('lib', 'proficiency_cutoffs.json')))
  end
end
