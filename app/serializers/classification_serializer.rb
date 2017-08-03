class ClassificationSerializer < ActiveModel::Serializer
  attributes :uid, :id, :name, :key, :form_url, :module_url, :created_at, :updated_at, :image_class, :alias, :scorebook_icon_class


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
      'Quill Diagnostic'
  	end
  end

  def image_class
  	case object.id
  	when 1
  		'icon-flag-gray'
  	when 2
  		'icon-puzzle-gray'
    when 4
      'icon-diagnostic-gray'
    when 5
      'icon-connect-gray'
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
    else
      ''
    end
  end

end
