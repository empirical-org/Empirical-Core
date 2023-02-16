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

  describe '#activity_count' do
    context 'when a topic is level 1' do
      it 'should provide the count of activities directly atttached to the topic' do
        topic = create(:topic, level: 1)
        create_list(:activity_topic, 6, topic: topic)
        expect(topic.activity_count).to eq(6)
      end
    end

    context 'when a topic is level 2' do
      it 'should provide the count of activities attached to all the topics children' do
        topic_two = create(:topic, level: 2)
        child_topic = create(:topic, level: 1)
        child_topic.update(parent_id: topic_two.id)
        another_child_topic = create(:topic, level: 1)
        another_child_topic.update(parent_id: topic_two.id)
        create_list(:activity_topic, 6, topic: child_topic)
        create_list(:activity_topic, 5, topic: another_child_topic)
        expect(topic_two.activity_count).to eq(11)
      end
    end

    context 'when a topic is level 3' do
      it 'should provide the count of activities attached to all the topics grandchildren' do
        topic_three = create(:topic, level: 3)
        child_topic = create(:topic, level: 2)
        child_topic.update(parent_id: topic_three.id)
        another_child_topic = create(:topic, level: 2)
        another_child_topic.update(parent_id: topic_three.id)
        grandchild_topic = create(:topic, level: 1)
        another_grandchild_topic = create(:topic, level: 1)
        grandchild_topic.update(parent_id: child_topic.id)
        another_grandchild_topic.update(parent_id: another_child_topic.id)
        create_list(:activity_topic, 6, topic: grandchild_topic)
        create_list(:activity_topic, 5, topic: another_grandchild_topic)
        expect(topic_three.activity_count).to eq(11)
      end
    end
  end

  describe '#parent' do
    context 'when a topic is level 2' do
      it 'should return the parent' do
        parent = create(:topic, level: 3)
        topic = create(:topic, level: 2)
        topic.update(parent_id: parent.id)
        expect(topic.parent).to eq(parent)
      end
    end

    context 'when a topic is level 1' do
      it 'should return the parent' do
        parent = create(:topic, level: 2)
        topic = create(:topic, level: 1)
        topic.update(parent_id: parent.id)
        expect(topic.parent).to eq(parent)
      end
    end

    context 'when a topic is level 3' do
      it 'should return nil' do
        topic = create(:topic, level: 3)
        expect(topic.parent).to eq(nil)
      end
    end
  end

  describe '#genealogy' do
    context 'when topic is level 1' do
      it 'should return an array containing the names of the grandparent, parent, and topic' do
        topic = create(:topic, level: 1)
        genealogy = topic.genealogy
        expect(genealogy.size).to eq(3)
        expect(genealogy[0]).to eq(topic.parent.parent.name)
        expect(genealogy[1]).to eq(topic.parent.name)
        expect(genealogy[2]).to eq(topic.name)
      end
    end

    context 'when topic is level 2' do
      it 'should return an array containing the names of parent and topic' do
        topic = create(:topic, level: 2)
        genealogy = topic.genealogy
        expect(genealogy.size).to eq(2)
        expect(genealogy[0]).to eq(topic.parent.name)
        expect(genealogy[1]).to eq(topic.name)
      end
    end
  end
end
