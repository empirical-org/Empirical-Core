require 'rails_helper'

describe Topic, type: :model do
  it { should have_many(:activity_topics) }
  it { should have_many(:activities).through(:activity_topics)}

  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:visible) }
  it { should validate_inclusion_of(:level).in?(0..3) }

  let!(:level_three_topic) { create(:topic, level: 3) }

  it "should send callback after commit" do
    expect(Activity).to receive(:clear_activity_search_cache)
    level_three_topic.run_callbacks(:commit)
  end

  describe 'saving a topic with parent id' do
    it 'should raise error if level is not 2' do
      level_one_topic = Topic.new(name: 'test', level: 1, parent_id: level_three_topic.id,visible: true)
      expect{ level_one_topic.save! }.to raise_error
    end

    it 'should raise error if level is 2 and parent is not level 3' do
      level_one_topic = Topic.create(name: 'test', level: 1, visible: true)
      level_two_topic = Topic.new(name: 'test', level: 2, visible: true, parent_id: level_one_topic.id)
      expect{ level_two_topic.save! }.to raise_error
    end

    it 'should not raise error if level is 2 and parent is 3' do
      level_two_topic = Topic.new(name: 'test', level: 2, visible: true, parent_id: level_three_topic.id)
      expect{ level_two_topic.save! }.not_to raise_error
    end
  end

  describe 'saving a topic without parent id' do
    it 'should raise error if level is 2' do
      level_two_topic = Topic.new(name: 'test', level: 2, visible: true)
      expect{ level_two_topic.save! }.to raise_error
    end

    it 'should not raise error if level is not 2' do
      level_one_topic = Topic.new(name: 'test', level: 1, visible: true)
      expect{ level_one_topic.save! }.not_to raise_error
    end
  end

end
