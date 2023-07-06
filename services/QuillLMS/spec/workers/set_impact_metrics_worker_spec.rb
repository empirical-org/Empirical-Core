# frozen_string_literal: true

require 'rails_helper'

describe SetImpactMetricsWorker do
  subject { described_class.new }

  context '#perform' do
    let(:activity_sessions) { create_list(:activity_session, 100)}

    let(:example_json1) {
      activity_sessions.map {|as| {"id" => as.id}}
    }

    let(:teachers) { create_list(:teacher, 150)}

    let(:example_json2) {
      teachers.map {|t| {"id" => t.id}}
    }

    let(:example_json3) {
      [
        {"id" => 333, "free_lunches" => 30},
        {"id" => 334, "free_lunches" => 0},
        {"id" => 545, "free_lunches" => 54}
      ]
    }

    before do
      allow(QuillBigQuery::ActivitiesAllTimeQuery).to receive(:run).and_return(example_json1)
      allow(QuillBigQuery::ActiveTeachersAllTimeQuery).to receive(:run).and_return(example_json2)
      allow(QuillBigQuery::SchoolsContainingXTeachersQuery).to receive(:run).with({teacher_ids: teachers.map(&:id)}).and_return(example_json3)
    end

    it 'should set the NUMBER_OF_SENTENCES redis value' do
      subject.perform
      expect($redis.get(PagesController::NUMBER_OF_SENTENCES)).to eq((example_json1.size.floor(-5) * 10).to_s)
    end

    it 'should set the NUMBER_OF_STUDENTS redis value' do
      subject.perform
      expect($redis.get(PagesController::NUMBER_OF_STUDENTS)).to eq((example_json1.count('DISTINCT(user_id)').floor(-5)).to_s)
    end

    it 'should set the NUMBER_OF_TEACHERS redis value' do
      subject.perform
      expect($redis.get(PagesController::NUMBER_OF_TEACHERS)).to eq("100")
    end

    it 'should set the NUMBER_OF_SCHOOLS redis value' do
      subject.perform
      expect($redis.get(PagesController::NUMBER_OF_SCHOOLS)).to eq("3")
    end

    it 'should set the NUMBER_OF_LOW_INCOME_SCHOOLS redis value' do
      subject.perform
      expect($redis.get(PagesController::NUMBER_OF_LOW_INCOME_SCHOOLS)).to eq("1")
    end
  end
end
