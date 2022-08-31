# frozen_string_literal: true

require 'rails_helper'

describe 'SegmentAnalytics' do

  # TODO : arent tests of these behaviours duplicated in the tests of the Workers?

  let(:analytics) { SegmentAnalytics.new }
  let(:track_calls) { analytics.backend.track_calls }
  let(:identify_calls) { analytics.backend.identify_calls }

  context 'tracking classroom creation' do
    let(:classroom) { create(:classroom) }
    let(:classroom_with_no_teacher) { create(:classroom, :with_no_teacher) }

    it 'sends two events' do
      analytics.track_classroom_creation(classroom)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(2)
      expect(track_calls[0][:event]).to eq("#{SegmentIo::BackgroundEvents::CLASSROOM_CREATION} | #{classroom.classroom_type_for_segment}")
      expect(track_calls[0][:user_id]).to eq(classroom.owner.id)
      expect(track_calls[1][:event]).to eq(SegmentIo::BackgroundEvents::CLASSROOM_CREATION)
      expect(track_calls[1][:user_id]).to eq(classroom.owner.id)
      expect(track_calls[1][:properties][:classroom_type]).to eq(classroom.classroom_type_for_segment)
      expect(track_calls[1][:properties][:classroom_grade]).to eq(classroom.grade_as_integer)
    end

    it 'should not send event if there is no owner' do
      analytics.track_classroom_creation(classroom_with_no_teacher)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(0)
    end
  end

  context 'tracking activity assignment' do
    let(:teacher) { create(:teacher) }

    context 'when the activity is a diagnostic activity' do
      let(:activity) { create(:diagnostic_activity) }

      it 'sends two events with information about the activity' do
        analytics.track_activity_assignment(teacher.id, activity.id)
        expect(identify_calls.size).to eq(0)
        expect(track_calls.size).to eq(2)
        expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::ACTIVITY_ASSIGNMENT)
        expect(track_calls[0][:user_id]).to eq(teacher.id)
        expect(track_calls[0][:properties][:activity_name]).to eq(activity.name)
        expect(track_calls[0][:properties][:tool_name]).to eq('Diagnostic')
        expect(track_calls[1][:event]).to eq("#{SegmentIo::BackgroundEvents::DIAGNOSTIC_ASSIGNMENT} | #{activity.name}")
        expect(track_calls[1][:user_id]).to eq(teacher.id)
      end
    end

    context 'when the activity is not a diagnostic activity' do
      let(:activity) { create(:connect_activity) }

      it 'sends one events with information about the activity' do
        analytics.track_activity_assignment(teacher.id, activity.id)
        expect(identify_calls.size).to eq(0)
        expect(track_calls.size).to eq(1)
        expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::ACTIVITY_ASSIGNMENT)
        expect(track_calls[0][:user_id]).to eq(teacher.id)
        expect(track_calls[0][:properties][:activity_name]).to eq(activity.name)
        expect(track_calls[0][:properties][:tool_name]).to eq('Connect')
      end
    end

  end

  context 'tracking activity completion' do
    let(:teacher) { create(:teacher) }
    let(:activity) { create(:diagnostic_activity) }
    let(:student) { create(:student) }
    let(:activity_session) { create(:activity_session) }

    it 'sends an event with information about the activity' do
      analytics.track_activity_completion(teacher, student.id, activity, activity_session)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::ACTIVITY_COMPLETION)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
      expect(track_calls[0][:properties][:activity_name]).to eq(activity.name)
      expect(track_calls[0][:properties][:tool_name]).to eq('Diagnostic')
      expect(track_calls[0][:properties][:student_id]).to eq(student.id)
    end
  end

  context 'tracking activity pack assignment' do
    let(:teacher) { create(:teacher) }

    it 'sends one event with information about the activity pack when it is a diagnostic activity pack' do
      diagnostic_activity = create(:diagnostic_activity)
      diagnostic_unit_template = create(:unit_template)
      diagnostic_unit = create(:unit, unit_template_id: diagnostic_unit_template.id )
      unit_activity = create(:unit_activity, unit: diagnostic_unit, activity: diagnostic_activity)
      analytics.track_activity_pack_assignment(teacher.id, diagnostic_unit.id)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::ACTIVITY_PACK_ASSIGNMENT)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
      expect(track_calls[0][:properties][:activity_pack_type]).to eq("Diagnostic")
      expect(track_calls[0][:properties][:activity_pack_name]).to eq(diagnostic_unit_template.name)
    end

    it 'sends one event with information about the activity pack when it is a custom activity pack' do
      unit = create(:unit)
      analytics.track_activity_pack_assignment(teacher.id, unit.id)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::ACTIVITY_PACK_ASSIGNMENT)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
      expect(track_calls[0][:properties][:activity_pack_type]).to eq("Custom")
      expect(track_calls[0][:properties][:activity_pack_name]).to eq(unit.name)
    end

    it 'sends one event with information about the activity pack when it is a pre made activity pack' do
      unit_template = create(:unit_template)
      unit = create(:unit, unit_template_id: unit_template.id)
      activity = create(:connect_activity)
      unit_activity = create(:unit_activity, activity: activity, unit: unit)
      analytics.track_activity_pack_assignment(teacher.id, unit.id)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::ACTIVITY_PACK_ASSIGNMENT)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
      expect(track_calls[0][:properties][:activity_pack_type]).to eq("Pre-made")
      expect(track_calls[0][:properties][:activity_pack_name]).to eq(unit_template.name)
    end

  end

  context 'track teacher subscription' do
    let(:teacher) { create(:teacher) }
    let(:subscription) { create(:subscription, account_type: 'Teacher Paid', recurring: true, expiration: Time.zone.today + 30.days)}
    let(:other_subscription) { create(:subscription, account_type: 'Teacher Paid', recurring: false, expiration: Time.zone.today + 30.days)}
    let!(:user_subscription) { create(:user_subscription, user: teacher, subscription: subscription)}
    let!(:other_user_subscription) { create(:user_subscription, user: teacher, subscription: other_subscription)}

    it 'sends an event with information about the subscription for recurring subscriptions' do
      analytics.track_teacher_subscription(subscription, SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_RENEW)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_RENEW)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
      expect(track_calls[0][:properties][:subscription_id]).to eq(subscription.id)
    end

    it 'sends an event with information about the subscription for non-recurring subscriptions' do
      analytics.track_teacher_subscription(other_subscription, SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_EXPIRE_IN_30)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::TEACHER_SUB_WILL_EXPIRE_IN_30)
      expect(track_calls[0][:user_id]).to eq(teacher.id)
      expect(track_calls[0][:properties][:subscription_id]).to eq(other_subscription.id)
    end
  end

  context 'track school subscription' do
    let(:school) { create(:school) }
    let(:subscription) { create(:subscription, account_type: 'School Paid', recurring: true, expiration: Time.zone.today + 30.days)}
    let(:other_subscription) { create(:subscription, account_type: 'School Paid', recurring: false, expiration: Time.zone.today + 30.days, purchaser_id: 'test')}
    let!(:school_subscription) { create(:school_subscription, school: school, subscription: subscription)}
    let!(:other_school_subscription) { create(:school_subscription, school: school, subscription: other_subscription)}

    it 'sends an event with information about the subscription for recurring subscriptions' do
      analytics.track_school_subscription(subscription, SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_RENEW)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_RENEW)
      expect(track_calls[0][:properties][:school_id]).to eq(school.id)
      expect(track_calls[0][:properties][:subscription_id]).to eq(subscription.id)
    end

    it 'sends an event with information about the subscription for nonrecurring subscriptions' do
      analytics.track_school_subscription(other_subscription, SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_EXPIRE_IN_30)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:event]).to eq(SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_EXPIRE_IN_30)
      expect(track_calls[0][:properties][:school_id]).to eq(school.id)
      expect(track_calls[0][:properties][:subscription_id]).to eq(other_subscription.id)
      expect(track_calls[0][:user_id]).to eq(other_subscription.purchaser_id)
    end

    it 'sends an event with anonymous ID if there is no purchaser id' do
      analytics.track_school_subscription(subscription, SegmentIo::BackgroundEvents::SCHOOL_SUB_WILL_RENEW)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:user_id]).to eq(nil)
      expect(track_calls[0][:anonymous_id]).to be
    end
  end

  context '#track' do
    let(:teacher) { create(:teacher) }
    let(:student) { create(:student) }

    it 'sends events to Intercom when the user is a teacher' do
      analytics.track({user_id: teacher.id})
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:integrations]).to eq({
        all: true,
        Intercom: true
      })
    end

    it 'does not send events to Intercom when user is not a teacher' do
      analytics.track({user_id: student.id})
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:integrations]).to eq({
        all: true,
        Intercom: false
      })
    end

    it 'does not send events to Intercom when user_id is not present and includes the default integration rules' do
      analytics.track({})
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(1)
      expect(track_calls[0][:integrations]).to eq analytics.default_integration_rules
    end
  end

  context 'track activity pack completion' do
    let(:teacher) { create(:teacher) }
    let(:student) { create(:student) }
    let(:unit) { create(:unit) }
    let(:classroom) { create(:classroom) }
    let(:students_classroom1) { create(:students_classrooms, classroom: classroom, student: student)}
    let(:classroom_unit) { create(:classroom_unit, unit: unit, classroom: classroom, assigned_student_ids: [student.id]) }
    let(:unit_activity1) { create(:unit_activity, unit: unit) }
    let(:unit_activity2) { create(:unit_activity, unit: unit) }
    let!(:activity_session1) { create(:activity_session, :finished, user: student, classroom_unit: classroom_unit, activity: unit_activity1.activity) }
    let!(:activity_session2) { create(:activity_session, :started, user: student, classroom_unit: classroom_unit, activity: unit_activity2.activity) }

    it '#activity_pack_completed? returns false if activity pack has not been completed' do
      expect(analytics.activity_pack_completed?(student.id, activity_session1)).to eq false
    end

    it '#activity_pack_completed? returns true if activity pack has been completed' do
      activity_session2.state = ActivitySession::STATE_FINISHED
      activity_session2.save!
      expect(analytics.activity_pack_completed?(student.id, activity_session2)).to eq true
    end

    it '#track_activity_pack_completion sends the expected data' do
      activity_session2.state = ActivitySession::STATE_FINISHED
      activity_session2.save!
      analytics.track_activity_completion(teacher, student.id, unit_activity2.activity, activity_session2)
      expect(identify_calls.size).to eq(0)
      expect(track_calls.size).to eq(2)
      expect(track_calls[1][:event]).to eq(SegmentIo::BackgroundEvents::ACTIVITY_PACK_COMPLETION)
      expect(track_calls[1][:user_id]).to eq(teacher.id)
      expect(track_calls[1][:properties][:activity_pack_name]).to eq(unit.name)
      expect(track_calls[1][:properties][:student_id]).to eq(student.id)
    end
  end

  context '#identify' do

    let(:district) { create(:district) }
    let(:school) { create(:school, district: district) }
    let(:school_without_district) { create(:school) }
    let(:teacher1) { create(:teacher, school: school) }
    let(:teacher2) { create(:teacher, school: school) }
    let(:teacher3) { create(:teacher, school: school_without_district) }
    let!(:schools_admins) { create(:schools_admins, school: school, user: teacher2) }

    it 'sends events to Intercom when the user is a teacher' do
      analytics.identify(teacher1)
      expect(identify_calls.size).to eq(1)
      expect(track_calls.size).to eq(0)
      expect(identify_calls[0][:traits][:is_admin]).to eq(false)
      expect(identify_calls[0][:traits][:first_name]).to eq(teacher1.first_name)
      expect(identify_calls[0][:traits][:last_name]).to eq(teacher1.last_name)
      expect(identify_calls[0][:traits][:email]).to eq(teacher1.email)
      expect(identify_calls[0][:traits][:school_name]).to eq(school.name)
      expect(identify_calls[0][:traits][:school_id]).to eq(school.id)
      expect(identify_calls[0][:traits][:district]).to eq(district.name)
      expect(identify_calls[0][:traits][:flagset]).to eq(teacher1.flagset)
      expect(identify_calls[0][:traits].length).to eq(11)
    end

    it 'sends events to Intercom when the user is an admin' do
      analytics.identify(teacher2)
      expect(identify_calls.size).to eq(1)
      expect(track_calls.size).to eq(0)
      expect(identify_calls[0][:traits][:is_admin]).to eq(true)
      expect(identify_calls[0][:traits][:first_name]).to eq(teacher2.first_name)
      expect(identify_calls[0][:traits][:last_name]).to eq(teacher2.last_name)
      expect(identify_calls[0][:traits][:email]).to eq(teacher2.email)
      expect(identify_calls[0][:traits][:school_name]).to eq(school.name)
      expect(identify_calls[0][:traits][:school_id]).to eq(school.id)
      expect(identify_calls[0][:traits][:district]).to eq(district.name)
      expect(identify_calls[0][:traits][:flagset]).to eq(teacher2.flagset)
      expect(identify_calls[0][:traits].length).to eq(11)
    end

    it 'omits trait properties that have nil values' do
      analytics.identify(teacher3)
      expect(identify_calls.size).to eq(1)
      expect(track_calls.size).to eq(0)
      expect(identify_calls[0][:traits].length).to eq(10)
    end
  end
end
