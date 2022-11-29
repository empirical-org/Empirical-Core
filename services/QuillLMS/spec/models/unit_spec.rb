# frozen_string_literal: true

# == Schema Information
#
# Table name: units
#
#  id               :integer          not null, primary key
#  name             :string
#  visible          :boolean          default(TRUE), not null
#  created_at       :datetime
#  updated_at       :datetime
#  unit_template_id :integer
#  user_id          :integer
#
# Indexes
#
#  index_units_on_unit_template_id  (unit_template_id)
#  index_units_on_user_id           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (unit_template_id => unit_templates.id)
#
require 'rails_helper'

describe Unit, type: :model do
  it { should belong_to(:user) }
  it { should have_many(:unit_activities).dependent(:destroy) }
  it { should have_many(:classroom_units).dependent(:destroy) }
  it { should have_many(:classrooms).through(:classroom_units) }
  it { should have_many(:activities).through(:unit_activities) }
  it { should have_many(:standards).through(:activities) }
  it { should belong_to(:unit_template) }

  it { is_expected.to callback(:hide_classroom_units_and_unit_activities).after(:save) }

  let!(:classroom) { create(:classroom) }
  let!(:teacher) { create(:teacher) }
  let!(:activity) { create(:activity) }
  let!(:unit) { create(:unit, user: teacher, visible: true) }

  describe 'user_id field' do
    it 'should not raise an error' do
      expect{ unit.user_id }.not_to raise_error
    end
  end

  describe '#create_with_incremented_name' do
    context 'collision occurs' do
      it 'should create a Unit with an incremented name' do
        Unit.create!(user_id: teacher.id, name: 'used name')
        expect do
          Unit.create_with_incremented_name(user_id: teacher.id, name: 'used name')
        end.to change { Unit.count }.by 1
        expect(Unit.find_by(user_id: teacher.id, name: 'used name 2').present?).to be true
      end
    end

    context 'normal path - no collision' do
      it 'should create a well-formed Unit' do
        expect do
          Unit.create_with_incremented_name(user_id: teacher.id, name: 'unique name')
        end.to change { Unit.count }.by 1
      end
    end
  end

  describe 'the name field' do

    context "it should be unique" do
      it "at the teacher level" do
        non_uniq_unit = Unit.create(name: unit.name, user: teacher)
        expect(non_uniq_unit.valid?).to eq(false)
      end

      context 'it should be scoped to visibility' do
        let!(:non_uniq_unit) {Unit.new(name: unit.name, user: teacher, visible: true)}

        it "when visibile == true it must be unique" do
          expect{non_uniq_unit.save!}.to raise_error(ActiveRecord::RecordInvalid)
        end

        it "unless visibility == false" do
          non_uniq_unit.visible = false
          expect{non_uniq_unit.save!}.to_not raise_error
        end

        it "unless the original unit's visibility == false" do
          unit.update(visible: false)
          expect{non_uniq_unit.save!}.to_not raise_error
        end
      end

      it "does not have to be unique by name with different teachers" do
        different_teacher = User.create(role: 'teacher')
        new_unit = Unit.create(name: unit.name, user: different_teacher)
        expect(new_unit.valid?).to eq(true)
      end
    end
  end

  describe 'default_scope' do
    it 'marks units visible by default' do
      result = Unit.new
      expect(result.visible).to eq(true)
    end

    it 'does not include units that are marked invisible' do
      result = Unit.new(name: "hidden unit", visible: false)
      expect(Unit.where(name: result.name)).to be_empty
    end
  end

  describe '#hide_if_no_visible_unit_activities' do
    it 'updates the unit to visible false if all of its unit activities are not visible' do
      create(:unit_activity, unit: unit, activity: activity, visible: false)
      unit.reload.hide_if_no_visible_unit_activities
      expect(unit.visible).to eq(false)
    end

    it 'does not update the unit to visible false if it has any visible unit activities' do
      create(:unit_activity, unit: unit, activity: activity, visible: true)
      unit.reload.hide_if_no_visible_unit_activities
      expect(unit.visible).to eq(true)
    end
  end

  describe '#hide_classroom_units_and_unit_activities' do
    it 'is called when the unit is saved' do
      expect(unit).to receive(:hide_classroom_units_and_unit_activities)
      unit.update(name: 'new name')
    end
  end

  describe '#email_lesson_plan' do
    let(:user) { create(:user, email: 'test@quill.org') }
    let(:activity) { create(:activity) }
    let(:activities) { double(:activities, where: [activity]) }
    let(:join_units) { double(:join_units, joins: activities) }
    let(:join_classroom_activities) { double(:join_classroom_activities , joins: join_units) }
    let(:unit) { create(:unit, user: user) }
    let(:unit_activity) { create(:unit_activity, unit: unit, activity: activity) }

    before do
      allow(Activity).to receive(:select).and_return(join_classroom_activities)
    end

    it 'should kick off background job for the lesson plan email' do
      expect{ unit.email_lesson_plan }.to change(LessonPlanEmailWorker.jobs, :size).by 1
    end
  end

  describe '#touch_all_classrooms_and_classroom_units' do
    let(:initial_time) { 1.day.ago}
    let!(:unit) { create(:unit) }
    let!(:classroom) { create(:classroom) }
    let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, unit: unit)}

    it "should update classrooms and classroom_units updated_at on unit save" do
      classroom.update_columns(updated_at: initial_time)
      classroom_updated_at = classroom.reload.updated_at
      classroom_unit.update_columns(updated_at: initial_time)
      classroom_unit_updated_at = classroom_unit.reload.updated_at

      unit.save

      expect(classroom.reload.updated_at.to_i).not_to equal(classroom_updated_at.to_i)
      expect(classroom_unit.reload.updated_at.to_i).not_to equal(classroom_unit_updated_at.to_i)
    end

    it "should update classrooms updated_t on classroom_unit touch" do
      classroom.update_columns(updated_at: initial_time)
      classroom_updated_at = classroom.reload.updated_at
      classroom_unit.update_columns(updated_at: initial_time)
      classroom_unit_updated_at = classroom_unit.reload.updated_at

      unit.touch

      expect(classroom.reload.updated_at.to_i).not_to equal(classroom_updated_at.to_i)
      expect(classroom_unit.reload.updated_at.to_i).not_to equal(classroom_unit_updated_at.to_i)
    end
  end

  describe 'save_user_pack_sequence_items' do
    let!(:unit) { create(:unit, user: teacher, visible: visible) }
    let!(:num_students) { 2 }
    let!(:num_jobs) { num_students }
    let!(:pack_sequence_item) { create(:pack_sequence_item, unit: unit) }

    before { create_list(:user_pack_sequence_item, num_students, pack_sequence_item: pack_sequence_item) }

    context 'after_save' do
      context 'visible has changed' do
        context 'to false' do
          let(:visible) { true }

          subject { unit.reload.update(visible: false) }

          it { expect { subject }.to change { SaveUserPackSequenceItemsWorker.jobs.size }.by(num_jobs) }
        end

        context 'to true' do
          let(:visible) { false }

          subject { unit.reload.update(visible: true) }

          it { expect { subject }.to change { SaveUserPackSequenceItemsWorker.jobs.size }.by(num_jobs) }
        end
      end
    end

    context 'after_destroy' do
      subject { unit.reload.destroy }

      let(:visible) { true }

      it { expect { subject }.to change { SaveUserPackSequenceItemsWorker.jobs.size }.by(num_jobs) }
    end
  end
end
