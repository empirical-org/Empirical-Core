require 'rails_helper'

describe JoinClassroomWorker, type: :worker do
  let(:worker) { JoinClassroomWorker.new }
  let(:analyzer) { double(:analyzer, track: true)}
  let!(:classroom) { create(:classroom_with_one_student) }
  let(:teacher) { classroom.owner }
  let!(:student) {classroom.students.first}

  before do
    allow(Analyzer).to receive(:new) { analyzer }
  end

  it 'should track the teacher student account creation' do
    expect(analyzer).to receive(:track).with(teacher, SegmentIo::Events::TEACHERS_STUDENT_ACCOUNT_CREATION)
    worker.perform(student.id)
  end
end
