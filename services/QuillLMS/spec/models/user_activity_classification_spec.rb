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
#  user_activity_classification_unique_index               (user_id,activity_classification_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (activity_classification_id => activity_classifications.id)
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'


RSpec.describe UserActivityClassification, type: :model do

  context 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:activity_classification) }
  end

  context 'validations' do
    it { should validate_presence_of(:user) }
    it { should validate_presence_of(:activity_classification) }
    it { should validate_presence_of(:count) }

    it { should validate_numericality_of(:count).only_integer.is_greater_than_or_equal_to(0) }
  end

  context '#new' do
    it 'should default count to 0' do
      user_activity_classification = UserActivityClassification.new
      expect(user_activity_classification.count).to be(0)
    end
  end

  context '#self.count_for' do
    let(:user) { create(:user) }
    let(:activity_classification) { create(:activity_classification) }

    it 'should create a new record if none exists' do
      expect do
        UserActivityClassification.count_for(user, activity_classification)
      end.to change { UserActivityClassification.count }.by(1)
    end

    it 'should increment an existing record if it exists' do
      existing_record = UserActivityClassification.create(user: user, activity_classification: activity_classification, count: 10)
      expect do
        UserActivityClassification.count_for(user, activity_classification)
        existing_record.reload
      end.to change { existing_record.count }.by(1)
    end

    it 'should handle race conditions gracefully' do
      begin
        call_count = 2
        wait_to_start = true
        failure_in_thread = false

        threads = call_count.times.map do |i|
          Thread.new do
            true while wait_to_start
            begin
              UserActivityClassification.count_for(user, activity_classification)
            rescue ActiveRecord::RecordNotUnique
              failure_in_thread = true
            end
          end
        end
        wait_to_start = false
        threads.each(&:join)

        expect(failure_in_thread).to be(false)
        record = UserActivityClassification.find_by(user: user, activity_classification: activity_classification)
        expect(record.count).to eq(call_count)
      ensure
        ActiveRecord::Base.connection_pool.disconnect!
      end
    end
  end

  context '#increment_count' do
    let(:start_count) { 10 }
    let(:user_activity_classification) { create(:user_activity_classification, count: start_count) }

    it 'should increment the value of count by 1' do

      user_activity_classification.increment_count
      user_activity_classification.reload
      expect(user_activity_classification.count).to eq(start_count + 1)
    end
  end
end
