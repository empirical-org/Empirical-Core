class AuthorSerializer < ActiveModel::Serializer
  attributes :id, :name, :avatar_url, :description


  def avatar_url
    object.avatar.url(:thumb)
  end

end
