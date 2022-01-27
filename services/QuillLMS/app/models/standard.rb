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
class Standard < ApplicationRecord
  include Uid

  belongs_to :standard_level
  belongs_to :standard_category

  has_many :activities, dependent: :nullify
  has_many :change_logs, as: :changed_record

  default_scope -> { order(:name) }

  validates :standard_level, presence: true
  validates :name, presence: true, uniqueness: true

  accepts_nested_attributes_for :change_logs

  after_commit { Activity.clear_activity_search_cache }

  def name_prefix
    name.split.first
  end
end
