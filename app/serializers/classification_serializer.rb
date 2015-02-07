class ClassificationSerializer < ActiveModel::Serializer
  attributes :uid, :id, :name, :key, :form_url, :module_url, :created_at, :updated_at, :image_class

  def image_class
  	case object.id
  	when 1
  		'icon-puzzle-gray'
  	when 2
  		'icon-flag-gray'
  	end
  end

end
