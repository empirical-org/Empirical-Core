class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :role, :active, :classcode, :username, :ip_address

  has_many :schools

  def ip_address
    object.ip_address.to_s
  end
end
