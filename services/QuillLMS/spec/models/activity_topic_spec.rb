# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_topics
#
#  id          :integer          not null, primary key
#  order       :integer          default(0), not null
#  activity_id :integer          not null
#  topic_id    :integer          not null
#
# Indexes
#
#  index_activity_topics_on_activity_id  (activity_id)
#  index_activity_topics_on_topic_id     (topic_id)
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (topic_id => topics.id)
#
require 'rails_helper'

describe ActivityTopic, type: :model do
  it { should belong_to(:activity) }
  it { should belong_to(:topic) }

  it { should validate_presence_of(:order) }
  it { should validate_numericality_of(:order).only_integer.is_greater_than_or_equal_to(0) }

  describe 'saving an activity topic' do
    it 'should raise error if topic is not level 1' do
      level_two_topic = create(:topic, level: 2)
      activity_topic = build(:activity_topic, topic: level_two_topic)
      expect { activity_topic.save! }.to raise_error(ActiveRecord::RecordNotSaved)
    end

    it 'should save if topic is level 1' do
      level_one_topic = create(:topic, level: 1)
      activity_topic = build(:activity_topic, topic: level_one_topic)
      expect { activity_topic.save! }.not_to raise_error
    end
  end
end
