class Cms::AdminAccountSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :admins, through: :admin_accounts_admins, serializer: Cms::AdminSerializer
end
