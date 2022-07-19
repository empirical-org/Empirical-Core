# frozen_string_literal: true

class ClassificationSerializer < ApplicationSerializer
  attributes :uid, :id, :name, :key, :form_url, :module_url, :created_at, :updated_at, :green_image_class, :alias, :scorebook_icon_class
  type :classification

  def alias
    case object.id
    when 1
      'Quill Proofreader'
    when 2
      'Quill Grammar'
    when 4
      'Quill Diagnostic'
    when 5
      'Quill Connect'
    when 6
      'Quill Lessons'
    end
  end

  def green_image_class
    case object.id
    when 1
      'icon-flag-green'
    when 2
      'icon-puzzle-green'
    when 4
      'icon-diagnostic-green'
    when 5
      'icon-connect-green'
    when 6
      'icon-lessons-green'
    end
  end


  def scorebook_icon_class
    case object.id
    when 1
      'icon-flag'
    when 2
      'icon-puzzle'
    when 4
      'icon-diagnostic'
    when 5
      'icon-connect'
    when 6
      'icon-lessons'
    else
      ''
    end
  end

end
