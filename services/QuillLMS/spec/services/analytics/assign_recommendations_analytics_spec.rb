require 'rails_helper'

describe AssignRecommendationsAnalytics do
  let(:analyzer) { double(:analyzer) }
  let(:subject) { described_class.new(analyzer) }

  describe '#track' do
    let(:teacher) { double(:teacher, id: "some_id", ip_address: "some_ip") }

    it 'should identify the user and track the event' do
      expect(analyzer).to receive(:identify).with(teacher)
      expect(analyzer).to receive(:track).with(
        {
          user_id: teacher.id,
          event: SegmentIo::Events::ASSIGN_RECOMMENDATIONS,
          context: { ip: teacher.ip_address }
        }
      )
      subject.track(teacher)
    end
  end
end