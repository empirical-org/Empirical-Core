class Cms::AdminAccountSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :admins, through: :admin_accounts_admins, serializer: Cms::AdminSerializer
  has_many :teachers, through: :admin_accounts_teachers, serializer: Cms::TeacherForAdminAccountSerializer
end
