# frozen_string_literal: true

# == Schema Information
#
# Table name: standard_categories
#
#  id         :integer          not null, primary key
#  name       :string
#  uid        :string
#  visible    :boolean          default(TRUE)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class StandardCategory < ApplicationRecord
  include Uid
  include ArchiveAssociatedStandards

  has_many :standards
  has_many :activities, through: :standards
  has_many :change_logs, as: :changed_record

  validates :name, presence: true, uniqueness: true

  accepts_nested_attributes_for :change_logs

  after_commit { Activity.clear_activity_search_cache }
end
