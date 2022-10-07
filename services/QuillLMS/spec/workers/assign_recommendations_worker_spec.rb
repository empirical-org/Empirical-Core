# frozen_string_literal: true

require 'rails_helper'

describe AssignRecommendationsWorker do
  subject { described_class.new.perform(args) }

  let(:unit_template) { create(:unit_template) }
  let(:classroom) { create(:classroom) }
  let(:teacher) { classroom.owner }
  let(:student) { create(:student) }
  let(:analyzer) { double(:analyzer, track: true) }
  let(:is_last_recommendation) { true }
  let(:lesson) { 'lesson' }
  let(:assigning_all_recommendations) { false }
  let(:activity_pack_id) { nil }

  let(:args) do
    {
      activity_pack_id: activity_pack_id,
      assigning_all_recommendations: assigning_all_recommendations,
      classroom_id: classroom.id,
      is_last_recommendation: is_last_recommendation,
      lesson: lesson,
      student_ids: [student.id],
      unit_template_id: unit_template.id
    }
  end

  before do
    allow(Analyzer).to receive(:new) { analyzer }
    allow(PusherRecommendationCompleted).to receive(:run)
  end

  context 'when no units is found' do
    context 'when unit was not found with the unit template name' do
      it { should_track_that_all_recommendations_are_being_assigned }
      it { should_run_the_pusher_recommendations }
      it { should_create_the_unit_and_assign_it_to_one_class }
    end

    context 'when unit was found with the unit template name' do
      let!(:unit) { create(:unit, name: unit_template.name, user: teacher, visible: false) }

      it { expect { subject }.to change { unit.reload.visible}.from(false).to(true) }
      it { should_track_that_all_recommendations_are_being_assigned }
      it { should_run_the_pusher_recommendations }
      it { should_update_the_unit_and_assign_it_to_one_class }
    end
  end

  context 'when only one unit is found' do
    let!(:unit) { create(:unit, unit_template: unit_template, user: teacher, visible: false) }

    it { expect { subject }.to change { unit.reload.visible}.from(false).to(true) }

    it { should_track_that_all_recommendations_are_being_assigned }
    it { should_run_the_pusher_recommendations }
    it { should_update_the_unit_and_assign_it_to_one_class }
  end

  context 'when more than one unit is found' do
    let!(:unit) { create(:unit, unit_template: unit_template, user: teacher, visible: false, updated_at: Date.current) }
    let!(:unit1) { create(:unit, unit_template: unit_template, user: teacher, visible: false, updated_at: 1.day.ago) }

    it { expect { subject }.to change { unit.reload.visible}.from(false).to(true) }

    it { should_track_that_all_recommendations_are_being_assigned }
    it { should_run_the_pusher_recommendations }
    it { should_update_the_unit_and_assign_it_to_one_class }
  end

  context 'when it is the last recommendation and assigning_all_recommendations is false' do
    let(:is_last_recommendation) { true }
    let(:assigning_all_recommendations) { false }
    let(:lesson) { false }

    it { should_not_track_that_all_recommendations_are_being_assigned }
  end

  context 'when it is not the last recommendation and assigning_all_recommendations is true' do
    let(:is_last_recommendation) { false }
    let(:lesson) { false }
    let(:assigning_all_recommendations) { true }

    it { should_not_track_that_all_recommendations_are_being_assigned }
  end

  context 'when it is the last recommendation and assigning_all_recommendations is true' do
    let(:is_last_recommendation) { true }
    let(:lesson) { false }
    let(:assigning_all_recommendations) { true }

    it { should_track_that_all_recommendations_are_being_assigned }
  end

  def should_track_that_all_recommendations_are_being_assigned
    expect(analyzer).to receive(:track).with(teacher, SegmentIo::BackgroundEvents::ASSIGN_RECOMMENDATIONS)
    subject
  end


  def should_not_track_that_all_recommendations_are_being_assigned
    expect(analyzer).not_to receive(:track).with(teacher, SegmentIo::BackgroundEvents::ASSIGN_ALL_RECOMMENDATIONS)
    subject
  end

  def should_run_the_pusher_recommendations
    expect(PusherRecommendationCompleted).to receive(:run).with(classroom, unit_template.id, lesson)
    subject
  end

  def should_update_the_unit_and_assign_it_to_one_class
    expect(Units::Updater)
      .to receive(:assign_unit_template_to_one_class)
      .with(
        unit.id,
        {
            id: classroom.id,
            student_ids: [student.id],
            assign_on_join: false
        },
        unit_template.id,
        teacher.id,
        concatenate_existing_student_ids: true
      )

    subject
  end

  def should_create_the_unit_and_assign_it_to_one_class
    expect(Units::Creator)
      .to receive(:assign_unit_template_to_one_class)
      .with(
        teacher.id,
        unit_template.id,
        {
            id: classroom.id,
            student_ids: [student.id],
            assign_on_join: false
        }
      )

    subject
  end
end

