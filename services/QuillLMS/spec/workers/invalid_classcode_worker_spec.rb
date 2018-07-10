require 'rails_helper'

describe InvalidClasscodeWorker do
  let(:subject) { described_class.new }
  let(:analyzer) { double(:analyzer, track_with_attributes: true) }
  let!(:student) { create(:student) }

  before do
    allow(Analyzer).to receive(:new) { analyzer }
  end

  describe "#perform" do
    it 'should track the invalid classcode event' do
      expect(analyzer).to receive(:track_with_attributes).with(
        student,
        SegmentIo::Events::STUDENT_ENTERED_INVALID_CLASSCODE,
        {
          properties: {
            user_inputted_classcode: "some_input",
            formatted_classcode: "formatted_classcode"
          },
          integrations: { intercom: 'false' }
        }
      )
      subject.perform(student.id, "some_input", "formatted_classcode")
    end
  end
end