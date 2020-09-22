require 'rails_helper'

describe StudentJoinedClassroomWorker, type: :worker do
  let(:worker) { described_class.new }
  let(:analyzer) { double(:analyzer, track_with_attributes: true, track: true) }
  let!(:student) { create(:student) }
  let!(:teacher) { create(:teacher) }

  before do
    allow(Analyzer).to receive(:new) { analyzer }
  end

  it 'results in the sending of 2 segment.io events' do
    expect(analyzer).to receive(:track_with_attributes).with(
      student,
      SegmentIo::BackgroundEvents::STUDENT_ACCOUNT_CREATION,
      {
        context: {:ip => student.ip_address },
        integrations: { intercom: 'false' }
      }
    )
    expect(analyzer).to receive(:track).with(teacher, SegmentIo::BackgroundEvents::TEACHERS_STUDENT_ACCOUNT_CREATION)
    worker.perform(teacher.id, student.id)
  end

  it 'in cases where no teacher is sent, it does not track teacher' do
    expect(analyzer).to receive(:track_with_attributes).with(
      student,
      SegmentIo::BackgroundEvents::STUDENT_ACCOUNT_CREATION,
      {
        context: {:ip => student.ip_address },
        integrations: { intercom: 'false' }
      }
    )
    expect(analyzer).not_to receive(:track).with(teacher, SegmentIo::BackgroundEvents::TEACHERS_STUDENT_ACCOUNT_CREATION)
    worker.perform(nil, student.id)
  end
end
