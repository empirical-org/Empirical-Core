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
require 'rails_helper'

describe Topic, type: :model do
  it { should have_many(:activity_topics) }
  it { should have_many(:activities).through(:activity_topics) }
  it { should have_many(:change_logs) }

  it { should validate_presence_of(:name) }
  it { should validate_inclusion_of(:visible).in?([true, false]) }
  it { should validate_inclusion_of(:level).in?(0..3) }

  let!(:level_three_topic) { create(:topic, level: 3) }

  it "should send callback after commit" do
    expect(Activity).to receive(:clear_activity_search_cache)
    level_three_topic.run_callbacks(:commit)
  end

  describe 'saving a topic with parent id' do
    it 'should raise error if level is 1 and parent is not level 2' do
      level_three_topic = Topic.create(name: 'test', level: 3, visible: true)
      level_one_topic = Topic.new(name: 'test', level: 1, visible: true, parent_id: level_three_topic.id)
      expect { level_one_topic.save! }.to raise_error(ActiveRecord::RecordNotSaved)
    end

    it 'should raise error if level is 2 and parent is not level 3' do
      level_one_topic = Topic.create(name: 'test', level: 1, visible: true)
      level_two_topic = Topic.new(name: 'test', level: 2, visible: true, parent_id: level_one_topic.id)
      expect { level_two_topic.save! }.to raise_error(ActiveRecord::RecordNotSaved)
    end

    it 'should not raise error if level is 2 and parent is 3' do
      level_two_topic = Topic.new(name: 'test', level: 2, visible: true, parent_id: level_three_topic.id)
      expect { level_two_topic.save! }.not_to raise_error
    end
  end

  describe 'saving a topic without parent id' do
    it 'should raise error if level is 2' do
      level_two_topic = Topic.new(name: 'test', level: 2, visible: true)
      expect { level_two_topic.save! }.to raise_error(ActiveRecord::RecordNotSaved)
    end

    it 'should raise error if level is 1' do
      level_one_topic = Topic.new(name: 'test', level: 1, visible: true)
      expect { level_one_topic.save! }.to raise_error(ActiveRecord::RecordNotSaved)
    end

    it 'should not raise error if level is 3' do
      level_three_topic = Topic.new(name: 'test', level: 3, visible: true)
      expect { level_three_topic.save! }.not_to raise_error
    end
  end

end
