class Admin::AdminSerializer < ActiveModel::Serializer
  attributes :id, :name, :email

  has_many :teachers,
            serializer: Admin::TeacherSerializer,
            through: :admin_accounts,
            source: :teachers,
            inverse_of: :my_admins
end