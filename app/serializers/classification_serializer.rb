class ClassificationSerializer < ActiveModel::Serializer
  attributes :uid, :id, :name, :key, :form_url, :module_url, :created_at, :updated_at, :image_class, :alias


  def alias
  	case object.id
  	when 1
  		'Quill Proofreader'
  	when 2
  		'Quill Grammar'
  	end 
  end

  def image_class
  	case object.id
  	when 1
  		'icon-flag-gray'
  	when 2
  		'icon-puzzle-gray'
  	end
  end

end
