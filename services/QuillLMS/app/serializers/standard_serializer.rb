# frozen_string_literal: true

# == Schema Information
#
# Table name: standards
#
#  id                   :integer          not null, primary key
#  name                 :string
#  uid                  :string
#  visible              :boolean          default(TRUE)
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  standard_category_id :integer
#  standard_level_id    :integer
#
# Foreign Keys
#
#  fk_rails_...  (standard_category_id => standard_categories.id)
#  fk_rails_...  (standard_level_id => standard_levels.id)
#
class StandardSerializer < ApplicationSerializer
  attributes :id, :name, :created_at, :updated_at

  has_one :standard_level
  has_one :standard_category
end
