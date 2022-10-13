# frozen_string_literal: true

# == Schema Information
#
# Table name: unit_activities
#
#  id           :integer          not null, primary key
#  due_date     :datetime
#  order_number :integer
#  visible      :boolean          default(TRUE)
#  created_at   :datetime
#  updated_at   :datetime
#  activity_id  :integer          not null
#  unit_id      :integer          not null
#
# Indexes
#
#  index_unit_activities_on_activity_id              (activity_id)
#  index_unit_activities_on_unit_id                  (unit_id)
#  index_unit_activities_on_unit_id_and_activity_id  (unit_id,activity_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (activity_id => activities.id)
#  fk_rails_...  (unit_id => units.id)
#
require 'rails_helper'

describe UnitActivity, type: :model, redis: true do

  it { should belong_to(:activity) }
  it { should belong_to(:unit) }
  it { should have_many(:classroom_unit_activity_states) }

  it { is_expected.to callback(:teacher_checkbox).after(:save) }
  it { is_expected.to callback(:hide_appropriate_activity_sessions).after(:save) }
  it { is_expected.to callback(:adjust_due_date_for_timezone).before(:save).if(:will_save_change_to_due_date?) }
  it { is_expected.to callback(:adjust_publish_date_for_timezone).before(:save).if(:will_save_change_to_publish_date?) }

  let!(:activity_classification3) { create(:activity_classification, id: 3)}
  let!(:activity_classification2) { create(:grammar)}
  let!(:activity_classification6) { create(:lesson_classification)}
  let!(:diagnostic_activity_classification ) { create(:diagnostic) }
  let!(:activity) { create(:activity, name: 'activity') }
  let!(:diagnostic_activity) { create(:diagnostic_activity, activity_classification_id: diagnostic_activity_classification.id, name: 'diagnostic activity') }
  let!(:student) { create(:user, role: 'student', username: 'great', name: 'hi hi', password: 'pwd') }
  let!(:classroom) { create(:classroom, students: [student]) }
  let!(:teacher) { classroom.owner }
  let!(:unit) { create(:unit, name: 'Tapioca', user: teacher) }
  let!(:unit_activity) { create(:unit_activity, unit: unit, activity: activity) }
  let!(:lessons_activity) { create(:activity, activity_classification_id: 6, name: 'lesson activity') }
  let!(:lessons_unit_activity) { create(:unit_activity, unit: unit, activity: lessons_activity) }
  let!(:classroom_unit ) { create(:classroom_unit , unit: unit, classroom: classroom, assigned_student_ids: [student.id]) }
  let!(:activity_session) {create(:activity_session, user_id: student.id, state: 'unstarted', classroom_unit_id: classroom_unit.id, unit: unit, activity: activity)}

  describe '#formatted_due_date' do
    context 'when due date exists' do
      let(:classroom_acitivity) { create(:classroom_acitivity) }

      it 'should return the formatted due date' do
        unit_activity.due_date = 10.days.from_now.to_date
        expect(unit_activity.formatted_due_date).to eq(unit_activity.due_date.strftime("%-m-%-e-%Y"))
      end
    end

    context 'when due date does not exist' do
      let(:classroom_acitivity) { create(:classroom_acitivity) }

      it 'should return emtpty string' do
        unit_activity.due_date = nil
        expect(unit_activity.formatted_due_date).to eq("")
      end
    end
  end

  describe '#from_valid_date_for_activity_analysis?' do
    it 'returns true if the unit_activity activity_classification id is not 1 or 2' do
      activity.classification = activity_classification3
      expect(unit_activity.from_valid_date_for_activity_analysis?).to eq(true)
    end


    it "returns true if it was created after 25-10-2016 and the classification is 1 or 2" do
      unit_activity.update(created_at: Date.parse('26-10-2016'))
      activity.classification = activity_classification2
      expect(unit_activity.from_valid_date_for_activity_analysis?).to eq(true)
    end

    it "returns false if it was created before 25-10-2016 and the classification is 1 or 2" do
      unit_activity.update(created_at: Date.parse('24-10-2016'))
      activity.classification = activity_classification2
      expect(unit_activity.from_valid_date_for_activity_analysis?).to eq(false)
    end
  end

  describe 'gives a checkbox when the teacher' do
    before do
      classroom.update(teacher_id: teacher.id)
    end

    it 'assigns a unit activity through a custom activity pack' do
      obj = Objective.create(name: 'Build Your Own Activity Pack')
      new_unit = Unit.create(name: 'There is no way a featured activity pack would have this name', user: teacher)
      unit_activity.update(unit: new_unit)
      expect(unit_activity.unit.user.checkboxes.last.objective).to eq(obj)
    end

    it 'creates a unit with a unit_template_id' do
      ut = UnitTemplate.create(name: 'Adverbs')
      obj = Objective.create(name: 'Assign Featured Activity Pack')
      new_unit = Unit.create(name: 'Adverbs', unit_template_id: ut.id, user: teacher)
      unit_activity.update!(unit: new_unit)
      expect(unit_activity.unit.user.checkboxes.last.objective).to eq(obj)
    end

    it 'assigns the entry diagnostic' do
      obj = Objective.create(name: 'Assign Entry Diagnostic')
      unit_activity.update!(activity_id: diagnostic_activity.id)
      expect(unit_activity.unit.user.checkboxes.last.objective).to eq(obj)
    end
  end

  context 'when it has a due_date_string attribute' do
    describe '#due_date_string=' do
      it 'must have a due date setter' do
        expect(unit_activity.due_date_string = '03/02/2012').to eq('03/02/2012')
      end

      it 'must throw an exception whn not valid input' do
        expect { unit_activity.due_date_string = '03-02-2012' }.to raise_error ArgumentError
      end
    end

    describe '#due_date_string' do
      before do
        unit_activity.due_date_string = '03/02/2012'
      end

      it 'must have a getter' do
        expect(unit_activity.due_date_string).to eq('03/02/2012')
      end
    end
  end

  describe 'adjust_due_date_for_timezone' do
    it 'adjusts the submitted time to the utc equivalent of that time in the timezone of the teacher' do
      tz_string = 'America/New_York'
      teacher.update(time_zone: tz_string)
      teacher_offset = TZInfo::Timezone.get(tz_string).period_for_utc(Time.new.utc).utc_total_offset
      due_date = Time.now.utc - 1.hour
      unit_activity.due_date = due_date
      unit_activity.adjust_due_date_for_timezone
      expect(unit_activity.due_date).to eq(due_date + teacher_offset)
    end

    it 'adjusts the submitted time to utc if the teacher has no time zone but the submitted time is not in utc' do
      teacher.update_columns(time_zone: nil)
      due_date = Time.now.utc - 1.hour
      due_date_in_los_angeles = due_date.in_time_zone('America/Los_Angeles')
      unit_activity.due_date = due_date_in_los_angeles
      unit_activity.adjust_due_date_for_timezone
      expect(unit_activity.due_date).to eq(due_date)
    end

    it 'does not adjust the submitted time if the teacher has no time zone and the time is in utc' do
      teacher.update_columns(time_zone: nil)
      due_date = Time.now.utc - 1.hour
      unit_activity.due_date = due_date
      unit_activity.adjust_due_date_for_timezone
      expect(unit_activity.due_date).to eq(due_date)
    end

    it 'does not adjust the submitted time if there is no due date' do
      tz_string = 'America/New_York'
      teacher.update(time_zone: tz_string)
      due_date = nil
      unit_activity.due_date = due_date
      unit_activity.adjust_due_date_for_timezone
      expect(unit_activity.due_date).to eq(due_date)
    end
  end

  describe 'adjust_publish_date_for_timezone' do
    it 'adjusts the submitted time to the utc equivalent of that time in the timezone of the teacher' do
      tz_string = 'America/New_York'
      teacher.update(time_zone: tz_string)
      teacher_offset = TZInfo::Timezone.get(tz_string).period_for_utc(Time.new.utc).utc_total_offset
      publish_date = Time.now.utc - 1.hour
      unit_activity.publish_date = publish_date
      unit_activity.adjust_publish_date_for_timezone
      expect(unit_activity.publish_date).to eq(publish_date + teacher_offset)
    end

    it 'adjusts the submitted time to utc if the teacher has no time zone but the submitted time is not in utc' do
      teacher.update_columns(time_zone: nil)
      publish_date = Time.now.utc - 1.hour
      publish_date_in_los_angeles = publish_date.in_time_zone('America/Los_Angeles')
      unit_activity.publish_date = publish_date_in_los_angeles
      unit_activity.adjust_publish_date_for_timezone
      expect(unit_activity.publish_date).to eq(publish_date)
    end

    it 'does not adjust the submitted time if the teacher has no time zone and the time is in utc' do
      teacher.update_columns(time_zone: nil)
      publish_date = Time.now.utc - 1.hour
      unit_activity.publish_date = publish_date
      unit_activity.adjust_publish_date_for_timezone
      expect(unit_activity.publish_date).to eq(publish_date)
    end

    it 'does not adjust the submitted time if there is no publish date' do
      tz_string = 'America/New_York'
      teacher.update(time_zone: tz_string)
      publish_date = nil
      unit_activity.publish_date = publish_date
      unit_activity.adjust_publish_date_for_timezone
      expect(unit_activity.publish_date).to eq(publish_date)
    end
  end

  context 'self.get_classroom_user_profile' do
    it 'get user profile data' do
      unit_activities = UnitActivity.get_classroom_user_profile(classroom.id, student.id)
      expect(unit_activities.count).to eq(2)
    end

    it 'gracefully account for nils' do
      unit_activities = UnitActivity.get_classroom_user_profile(nil, nil)
      expect(unit_activities.count).to eq(0)
    end

    it 'includes unit_activities even if their activities are archived' do
      activity.update(flags: [Activity::ARCHIVED])
      unit_activities = UnitActivity.get_classroom_user_profile(classroom.id, student.id)
      expect(unit_activities.count).to eq(2)
    end

    describe 'publish dates' do

      it 'includes unit activities that do not have a publish date' do
        unit_activity.update(publish_date: nil)
        lessons_unit_activity.update(publish_date: nil)
        unit_activities = UnitActivity.get_classroom_user_profile(classroom.id, student.id)
        expect(unit_activities.map{ |ua| ua['ua_id'] }).to include(unit_activity.id, lessons_unit_activity.id)
      end

      it 'includes unit activities that have a publish date that has already passed' do
        unit_activity.update(publish_date: Time.now.utc - 1.hour)
        lessons_unit_activity.update(publish_date: Time.now.utc - 1.minute)
        unit_activities = UnitActivity.get_classroom_user_profile(classroom.id, student.id)
        expect(unit_activities.map{ |ua| ua['ua_id'] }).to include(unit_activity.id, lessons_unit_activity.id)
      end

      it 'does not include unit activities that have a publish date that has not yet passed' do
        # have to do update_columns here because time_zone is set by a callback
        teacher.update_columns(time_zone: nil)
        unit_activity.update(publish_date: Time.now.utc + 1.hour)
        lessons_unit_activity.update(publish_date: Time.now.utc + 1.month)
        unit_activities = UnitActivity.get_classroom_user_profile(classroom.id, student.id)
        expect(unit_activities.count).to eq(0)
      end

      it 'converts the publish date to the time zone of the assigning teacher if the teacher has a time zone' do
        tz_string = 'America/New_York'
        teacher.update(time_zone: tz_string)
        publish_date = Time.now.utc - 1.hour
        # have to do update_columns here because otherwise the publish date is offset by a callback
        unit_activity.update_columns(publish_date: publish_date)
        unit_activities = UnitActivity.get_classroom_user_profile(classroom.id, student.id)
        expect(unit_activities.find{ |ua| ua['ua_id'].to_i == unit_activity.id}['publish_date'].to_time.strftime('%a %b %d %H:%M:%S %Z %Y'))
          .to eq((publish_date + teacher.utc_offset).to_time.strftime('%a %b %d %H:%M:%S %Z %Y'))
      end

      it 'leaves the publish date in utc if the teacher does not have a time zone' do
        # have to do update_columns here because time_zone is set by a callback
        teacher.update_columns(time_zone: nil)
        publish_date = Time.now.utc - 1.hour
        unit_activity.update(publish_date: publish_date)
        unit_activities = UnitActivity.get_classroom_user_profile(classroom.id, student.id)
        expect(unit_activities.find{ |ua| ua['ua_id'].to_i == unit_activity.id}['publish_date'].to_time.strftime('%a %b %d %H:%M:%S %Z %Y')).to eq(publish_date.to_time.strftime('%a %b %d %H:%M:%S %Z %Y'))
      end

    end

  end

end
