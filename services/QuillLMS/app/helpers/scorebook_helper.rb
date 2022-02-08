# frozen_string_literal: true

module ScorebookHelper

  def percentage_color(score)
    proficiency_cutoff = ProficiencyEvaluator.proficiency_cutoff
    nearly_proficient_cutoff = ProficiencyEvaluator.nearly_proficient_cutoff
    return 'gray' unless score

    score = score.to_f / 100.0 if score > 1
    score = score.round(2)
    case score
    when proficiency_cutoff..1.0
      'green'
    when nearly_proficient_cutoff...proficiency_cutoff
      'orange'
    when 0.0...nearly_proficient_cutoff
      'red'
    else
      'gray'
    end
  end

  def icon_for_classification(classification)
    case classification.id
    when 1
      'flag'
    when 2
      'puzzle'
    when 4
      'diagnostic'
    when 5
      'connect'
    else
      ''
    end
  end

  def icon_for_classification_by_id(activity_classification_id)
    case activity_classification_id
    when 1
      'flag'
    when 2
      'puzzle'
    when 4
      'diagnostic'
    when 5
      'connect'
    else
      ''
    end
  end

  def scorebook_path(teacher)
    if teacher.has_classrooms?
      scorebook_teachers_classrooms_path
    else
      ''
    end
  end

  def alias_by_id id
    case id
    when 1
      'Quill Proofreader'
    when 2
      'Quill Grammar'
    when 4
      'Quill Diagnostic'
    when 5
      'Quill Connect'
    end
  end

end
