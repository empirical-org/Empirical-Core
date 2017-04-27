module ProficiencyEvaluator
  extend ActiveSupport::Concern

  def self.proficiency_cutoff
    0.8
  end

  def self.proficient_and_not_sql
    "SUM(CASE WHEN user_info.average_score >= 0.8 THEN 1 ELSE 0 END) as proficient_student_count,
     SUM(CASE WHEN user_info.average_score < 0.8 THEN 1 ELSE 0 END) as not_proficient_student_count"
  end

  def self.evaluate(score)
    if score >= proficiency_cutoff
      return "Proficient"
    else
      return "Not Yet Proficient"
    end
  end

  def lump_into_center_of_proficiency_band(percentage)
    case percentage
    when proficiency_cutoff..1.0
      1.0
    when 0.6...0.8
      0.75
    when 0.0...0.6
      0.5
    else
      0.0
    end
  end



end
