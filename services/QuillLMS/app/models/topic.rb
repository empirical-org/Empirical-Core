# frozen_string_literal: true

# == Schema Information
#
# Table name: topics
#
#  id         :integer          not null, primary key
#  level      :integer          not null
#  name       :string           not null
#  visible    :boolean          default(TRUE), not null
#  created_at :datetime
#  updated_at :datetime
#  parent_id  :integer
#
# Foreign Keys
#
#  fk_rails_...  (parent_id => topics.id)
#
class Topic < ApplicationRecord
  validates :name, presence: true
  validates :visible, :inclusion => { :in => [true, false] } # presence: true doesn't work for booleans because false will fail
  validates_inclusion_of :level, :in => 0..3

  has_many :activity_topics, dependent: :destroy
  has_many :activities, through: :activity_topics
  has_many :change_logs, as: :changed_record

  accepts_nested_attributes_for :change_logs

  after_commit { Activity.clear_activity_search_cache }

  before_save :validate_parent_by_level

  def validate_parent_by_level
    throw(:abort) unless valid_parent_structure?
  end

  def level_zero?
    level == 0
  end

  def level_one?
    level == 1
  end

  def level_two?
    level == 2
  end

  def level_three?
    level == 3
  end

  def activity_count
    case level
    child_topics = Topic.where(visible: true, parent_id: id)
    when 3
      grandchild_topics = child_topics.map { |ct| Topic.where(parent_id: ct.id) }.flatten
      grandchild_topics.map { |gct| gct.activities.count}.reduce(:+)
    when 2
      child_topics.map { |gct| gct.activities.count}.reduce(:+)
    else
      activities.count
    end
  end

  private def level_two_parent?
    parent? && Topic.find(parent_id).level_two?
  end

  private def level_three_parent?
    parent? && Topic.find(parent_id).level_three?
  end

  private def no_parent?
    !parent?
  end

  private def parent?
    parent_id.present? && Topic.exists?(parent_id)
  end

  private def valid_parent_structure?
    return level_two_parent? if level_one?
    return level_three_parent? if level_two?
    return no_parent? if level_three?
  end
end
