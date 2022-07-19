# frozen_string_literal: true

class ProgressReports::ActivitySessionSerializer  < ApplicationSerializer
  attributes :id,
             :activity_classification_name,
             :activity_classification_id,
             :activity_name,
             :completed_at,
             :percentage,
             :display_score,
             :display_completed_at,
             :classroom_id,
             :unit_id,
             :student_name,
             :student_id,
             :standard

  def activity_classification_name
    object.activity.classification.name
  end

  def activity_classification_id
    object.activity.classification.id
  end

  def activity_name
    object.activity.name
  end

  def completed_at
    object.completed_at.try(:to_i)
  end

  def percentage
    object.percentage_as_decimal
  end

  def display_score
    object.percentage_as_percent
  end

  def display_completed_at
    object.completed_at.try(:to_formatted_s, :quill_default)
  end

  # Following fields are used by the filters

  def classroom_id
    object.classroom_unit.try(:classroom_id)
  end

  def classroom_name
    object.classroom_unit.try(:classroom).try(:name)
  end

  def unit_id
    object.classroom_unit.try(:unit).try(:id)
  end

  def unit_name
    object.classroom_unit.try(:unit).try(:name)
  end

  def student_name
    object.user.name
  end

  def student_id
    object.user_id
  end

  def standard
    object.activity&.standard.try(:name_prefix)
  end
end
