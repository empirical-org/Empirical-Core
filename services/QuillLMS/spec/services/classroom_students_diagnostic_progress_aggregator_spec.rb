# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ClassroomStudentsDiagnosticProgressAggregator do
  subject { described_class.run(classroom, student_ids, units) }

  let(:classroom) { create(:classroom) }
  let(:unit1) { create(:unit) }
  let(:classroom_unit1) { create(:classroom_unit, classroom: classroom, unit: unit1) }
  let(:student1) { create(:student) }
  let(:num_completed1) { [1, 2].sample }

  before { create_list(:activity_session, num_completed1, :finished, classroom_unit: classroom_unit1, user: student1) }

  context 'no student ids' do
    let(:student_ids) { [] }
    let(:units) { Unit.where(id: unit1.id) }

    it { expect(subject).to eq({}) }
  end

  context 'no units' do
    let(:student_ids) { [student1.id] }
    let(:units) { Unit.none }

    it { expect(subject).to eq({}) }
  end

  context 'student_id and unit exists' do
    let(:student_ids) { [student1.id] }
    let(:units) { Unit.where(id: unit1.id) }

    it { expect(subject).to eq({ student1.id => num_completed1 }) }

    context 'student1 completes more activity_sessions' do
      before { create_list(:activity_session, num_completed1, :finished, classroom_unit: classroom_unit1, user: student1) }

      it { expect(subject).to eq({ student1.id => (num_completed1 + num_completed1) }) }
    end

    context 'student1 completes more activity_sessions for unrelated unit' do
      before { create_list(:activity_session, num_completed1, :finished, user: student1) }

      it { expect(subject).to eq({ student1.id => num_completed1 }) }
    end

    context 'started activity sessions exist' do
      let(:num_started) { 2 }

      before { create_list(:activity_session, num_started, :started, classroom_unit: classroom_unit1, user: student1) }

      it { expect(subject).to eq({ student1.id => num_completed1 }) }
    end

    context 'unstarted activity sessions exist' do
      let(:num_unstarted) { 2 }

      before { create_list(:activity_session, num_unstarted, :unstarted, classroom_unit: classroom_unit1, user: student1) }

      it { expect(subject).to eq({ student1.id => num_completed1 }) }
    end
  end

  context 'multiple student_ids exist' do
    let(:student2) { create(:student) }
    let(:student_ids) { [student1.id, student2.id] }
    let(:num_completed2) { [1, 2].sample }

    context 'student2 has matching classroom units' do
      let(:unit2) { create(:unit) }
      let(:classroom_unit2) { create(:classroom_unit, classroom: classroom, unit: unit2) }
      let(:units) { Unit.where(id: [unit1.id, unit2.id]) }

      context 'with no completed activity sessions' do
        it { expect(subject).to eq({ student1.id => num_completed1, student2.id => 0 }) }
      end

      context 'with completed activity sessions' do
        before { create_list(:activity_session, num_completed2, :finished, classroom_unit: classroom_unit2, user: student2) }

        it { expect(subject).to eq({ student1.id => num_completed1, student2.id => num_completed2 }) }
      end
    end

    context 'classroom unit contains both students' do
      let(:unit3) { create(:unit) }
      let(:classroom_unit3) { create(:classroom_unit, classroom: classroom, unit: unit3, assigned_student_ids: student_ids) }
      let(:units) { Unit.where(id: [unit3.id]) }

      before do
        create_list(:activity_session, num_completed1, :finished, classroom_unit: classroom_unit3, user: student1)
        create_list(:activity_session, num_completed2, :finished, classroom_unit: classroom_unit3, user: student2)
      end

      it { expect(subject).to eq({ student1.id => num_completed1, student2.id => num_completed2 }) }
    end
  end
end
