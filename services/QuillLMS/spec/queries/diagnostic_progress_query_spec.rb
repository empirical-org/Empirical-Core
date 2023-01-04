# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DiagnosticProgressQuery  do
  subject { described_class.call(classroom, student_ids, units) }

  let(:classroom) { create(:classroom) }
  let(:unit1) { create(:unit) }
  let(:unit2) { create(:unit) }
  let(:classroom_unit1) { create(:classroom_unit, classroom: classroom, unit: unit1) }
  let(:classroom_unit2) { create(:classroom_unit, classroom: classroom, unit: unit2) }
  let(:student1) { create(:student) }
  let(:student2) { create(:student) }
  let(:num_completed) { 2 }

  before { create_list(:activity_session, num_completed, :finished, classroom_unit: classroom_unit1, user: student1) }

  context 'no student ids' do
    let(:student_ids) { [] }

    context 'no units' do
      let(:units) { Unit.none }

      it { expect(subject).to eq({}) }
    end

    context 'unit exists' do
      let(:units) { Unit.where(id: unit1.id) }

      it { expect(subject).to eq({}) }
    end
  end

  context 'student_id exists' do
    let(:student_ids) { [student1.id] }

    context 'no units' do
      let(:units) { Unit.none }

      it { expect(subject).to eq({}) }
    end

    context 'unit exists' do
      let(:units) { Unit.where(id: unit1.id) }

      it { expect(subject).to eq({ student1.id => num_completed }) }

      context 'student1 completes more activity_sessions' do
        before { create_list(:activity_session, num_completed, :finished, classroom_unit: classroom_unit1, user: student1) }

        it { expect(subject).to eq({ student1.id => (num_completed + num_completed) }) }
      end

      context 'student1 completes more activity_sessions for unrelated unit' do
        before { create_list(:activity_session, num_completed, :finished, user: student1) }

        it { expect(subject).to eq({ student1.id => num_completed }) }
      end

      context 'started activity sessions exist' do
        let(:num_started) { 2 }

        before { create_list(:activity_session, num_started, :started, classroom_unit: classroom_unit1, user: student1) }

        it { expect(subject).to eq({ student1.id => num_completed }) }
      end

      context 'unstarted activity sessions exist' do
        let(:num_unstarted) { 2 }

        before { create_list(:activity_session, num_unstarted, :unstarted, classroom_unit: classroom_unit1, user: student1) }

        it { expect(subject).to eq({ student1.id => num_completed }) }
      end
    end
  end

  context 'multiple student_ids exist' do
    let(:student_ids) { [student1.id, student2.id] }

    context 'student2 has no matching classroom units' do
      let(:units) { Unit.where(id: unit1.id) }

      before { create_list(:activity_session, num_completed, :finished, classroom_unit: classroom_unit2, user: student2) }

      it { expect(subject).to eq({ student1.id => num_completed, student2.id => 0 }) }
    end

    context 'student2 has matching classroom units' do
      let(:units) { Unit.where(id: [unit1.id, unit2.id]) }

      before { create_list(:activity_session, num_completed, :finished, classroom_unit: classroom_unit2, user: student2) }

      it { expect(subject).to eq({ student1.id => num_completed, student2.id => num_completed }) }
    end
  end
end
