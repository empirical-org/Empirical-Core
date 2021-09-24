require 'rails_helper'

describe RefreshQuestionCacheWorker, type: :worker do
  let(:worker) { described_class.new }

  describe "#perform" do
    it "should call force refresh methods" do
      expect(Question).to receive(:all_questions_json_cached).with('type', refresh: true)
      expect(Question).to receive(:question_json_cached).with('123', refresh: true)

      worker.perform('type', '123')
    end

    it "should call force refresh methods for type only" do
      expect(Question).to receive(:all_questions_json_cached).with('type', refresh: true)
      expect(Question).to_not receive(:question_json_cached)

      worker.perform('type')
    end
  end
end
