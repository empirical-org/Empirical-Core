# frozen_string_literal: true

# == Schema Information
#
# Table name: user_activity_classifications
#
#  id                         :bigint           not null, primary key
#  count                      :integer          default(0)
#  activity_classification_id :bigint
#  user_id                    :bigint
#
# Indexes
#
#  index_user_activity_classifications_on_classifications  (activity_classification_id)
#  index_user_activity_classifications_on_user_id          (user_id)
#  user_activity_classification_unique_index               (user_id,activity_classification_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_classification_id => activity_classifications.id)
#  fk_rails_...  (user_id => users.id)
#
class UserActivityClassification < ApplicationRecord
  belongs_to :user
  belongs_to :activity_classification

  attribute :count, :integer, default: 0

  validates_presence_of :user
  validates_presence_of :activity_classification
  validates :count, presence: true,
    numericality: {
      only_integer: true,
      greater_than_or_equal_to: 0
    }

  scope :completed_activities_for_user_ids, lambda {|user_ids|
    select('user_id, SUM(count) as total')
    .where(user_id: user_ids)
    .group(:user_id)
  }

  # returns {user_id: total}
  def self.completed_activities_by_student(user_ids)
    completed_activities_for_user_ids(user_ids)
    .map{|r| [r['user_id'], r['total'].to_i]}
    .to_h
  end

  def self.count_for(user, activity_classification)
    begin
      transaction(requires_new: true) do
        instance = find_or_create_by(user: user, activity_classification: activity_classification)
        instance.increment_count
      end
    rescue ActiveRecord::RecordNotUnique
      retry
    end
  end

  def increment_count
    # Note that this could theoretically be susceptible to race conditions
    # if two calls are made at the same time, but since we only intend to
    # count these when activity sessions complete, and don't expect that to
    # happen more than once, and not close together, we should be safe
    update(count: count + 1)
  end
end
