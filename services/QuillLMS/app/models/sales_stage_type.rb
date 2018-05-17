class SalesStageType < ActiveRecord::Base
  validates :name, uniqueness: true
  validates :order, uniqueness: true

  enum trigger: { auto: 0, user: 1 }

  def name_param
    name.parameterize.underscore
  end
end
