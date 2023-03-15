# frozen_string_literal: true

class SegmentAnalytics
  # The actual backend that this uses to talk with segment.io.
  # This will be a fake backend under test and a real object
  # elsewhere.
  class_attribute :backend


  # TODO : split this all out in the way that SigninAnalytics splits out

  def initialize
    # Do not clobber the backend object if we already set a fake one under test
    return if Rails.env.test?

    self.backend ||= Segment::Analytics.new(
      write_key: SegmentIo.configuration.write_key,
      on_error: proc { |status, msg| print msg }
    )
  end

  def track_event_from_string(event_name, user_id)
    # make sure that event name is written as a string in the pattern of
    # those in app/services/analytics/segment_io.rb
    # i.e. "BUILD_YOUR_OWN_ACTIVITY_PACK"
    track({
       user_id: user_id,
       event: "SegmentIo::BackgroundEvents::#{event_name}".constantize
      })
  end

  def track_activity_assignment(teacher_id, activity_id)
    activity = Activity.find_by(id: activity_id) || Activity.find_by(uid: activity_id)

    # properties here get used by Heap
    track({
      user_id: teacher_id,
      event: SegmentIo::BackgroundEvents::ACTIVITY_ASSIGNMENT,
      properties: activity.segment_activity.content_params
    })

    # this event is for Vitally, which does not show properties
    return unless Activity.diagnostic_activity_ids.include?(activity_id)

    track({
      user_id: teacher_id,
      event: "#{SegmentIo::BackgroundEvents::DIAGNOSTIC_ASSIGNMENT} | #{activity.name}"
    })
  end

  def track_activity_pack_assignment(teacher_id, unit_id)
    unit = Unit.find_by_id(unit_id)

    if unit&.unit_template_id
      if unit.activities.all? { |a| Activity.diagnostic_activity_ids.include?(a.id) }
        activity_pack_type = 'Diagnostic'
      else
        activity_pack_type = 'Pre-made'
      end
    else
      activity_pack_type = 'Custom'
    end

    track({
      user_id: teacher_id,
      event: SegmentIo::BackgroundEvents::ACTIVITY_PACK_ASSIGNMENT,
      properties: {
        activity_pack_name: unit&.unit_template&.name || unit&.name,
        activity_pack_type: activity_pack_type
      }
    })
  end

  def track_activity_completion(user, student_id, activity, activity_session)
    track({
      user_id: user&.id,
      event: SegmentIo::BackgroundEvents::ACTIVITY_COMPLETION,
      properties: activity.segment_activity.content_params.merge({student_id: student_id})
    })
    track_activity_pack_completion(user, student_id, activity_session) if activity_pack_completed?(student_id, activity_session)
  end

  def activity_pack_completed?(student_id, activity_session)
    classroom_unit = ClassroomUnit.find_by(id: activity_session.classroom_unit_id)
    activity_ids = classroom_unit&.unit_activities&.pluck(:activity_id)

    activity_ids.all? do |activity_id|
      ActivitySession.exists?(
        activity_id: activity_id,
        classroom_unit: classroom_unit,
        state: ActivitySession::STATE_FINISHED,
        user_id: student_id
      )
    end
  end

  def track_activity_pack_completion(user, student_id, activity_session)
    unit = activity_session.unit
    activity_pack_name = unit&.unit_template&.name || unit&.name
    track({
      user_id: user&.id,
      event: SegmentIo::BackgroundEvents::ACTIVITY_PACK_COMPLETION,
      properties: {
        activity_pack_name: activity_pack_name,
        student_id: student_id
      }
    })
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def track_classroom_creation(classroom)
    # TODO: Remove early return once this bug is fixed
    # https://sentry.io/organizations/quillorg-5s/issues/2459924163/?project=11238&query=is%3Aunresolved
    # https://www.notion.so/quill/Clever-Classrooms-missing-Teachers-1be9032fb94e4af48a1afa3e8156804d
    return unless classroom&.owner&.id

    # first event is for Vitally, which does not show properties
    track({
      user_id: classroom&.owner&.id,
      event: "#{SegmentIo::BackgroundEvents::CLASSROOM_CREATION} | #{classroom.classroom_type_for_segment}"
    })
    # second event is for Heap, which does
    track({
      user_id: classroom&.owner&.id,
      event: SegmentIo::BackgroundEvents::CLASSROOM_CREATION,
      properties: {
        classroom_type: classroom&.classroom_type_for_segment,
        classroom_grade: classroom && classroom.grade_as_integer >= 0 ? classroom.grade_as_integer : nil
      }
    })
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def track_activity_search(user_id, search_query)
    track({
      user_id: user_id,
      event: SegmentIo::BackgroundEvents::ACTIVITY_SEARCH,
      properties: {
        search_query: search_query
      }
    })
  end

  def track_student_login_pdf_download(user_id, classroom_id)
    track({
      user_id: user_id,
      event: SegmentIo::BackgroundEvents::STUDENT_LOGIN_PDF_DOWNLOAD,
      properties: {
        classroom_id: classroom_id
      }
    })
  end

  def track_previewed_activity(user_id, activity_id)
    activity = Activity.find_by(id: activity_id) || Activity.find_by(uid: activity_id)

    track({
      user_id: user_id,
      event: SegmentIo::BackgroundEvents::PREVIEWED_ACTIVITY,
      properties: activity.segment_activity.common_params
    })

  end

  def track_teacher_subscription(subscription, event)
    teacher_id = subscription.users.first.id

    track({
      user_id: teacher_id,
      event: event,
      properties: {
        subscription_id: subscription.id
      }
    })
  end

  def track_school_subscription(subscription, event)
    school_id = subscription.schools.first.id

    if subscription.purchaser_id.present?
      track({
        user_id: subscription.purchaser_id,
        event: event,
        properties: {
          subscription_id: subscription.id,
          school_id: school_id
        }
      })
    else
      track({
        # Segment requires us to send a unique User ID or Anonymous ID for every event
        # generate a random UUID here because we don't want the School Subscription event to be associated to any real user
        anonymous_id: SecureRandom.uuid,
        event: event,
        properties: {
          subscription_id: subscription.id,
          school_id: school_id
        }
      })
    end
  end

  def track_teacher_school_not_listed(user, school_name, zipcode)
    track({
      user_id: user.id,
      event: SegmentIo::BackgroundEvents::TEACHER_SCHOOL_NOT_LISTED,
      properties: {
        email: user.email,
        school_name: school_name,
        zipcode: zipcode
      }
    })
  end

  def track_school_admin_user(user, event, school_name, referring_admin_name)
    track({
      user_id: user.id,
      event: event,
      properties: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        school_name: school_name,
        admin_name: referring_admin_name
      }
    })
  end

  def track_district_admin_user(user, event, district_name, referring_admin_name)
    track({
      user_id: user.id,
      event: event,
      properties: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        district_name: district_name,
        admin_name: referring_admin_name
      }
    })
  end

  def track_admin_received_admin_upgrade_request_from_teacher(admin, teacher, reason)
    identify(admin)
    track({
      user_id: admin.id,
      event: SegmentIo::BackgroundEvents::ADMIN_RECEIVED_ADMIN_UPGRADE_REQUEST_FROM_TEACHER,
      properties: {
        teacher_first_name: teacher.first_name,
        teacher_last_name: teacher.last_name,
        teacher_email: teacher.email,
        teacher_school: teacher.school&.name,
        reason: reason
      }
    })
  end

  def track_admin_invited_by_teacher(admin_name, admin_email, teacher, note)
    admin = User.find_by_email(admin_email)
    properties = {
      admin_name: admin_name,
      admin_email: admin_email,
      teacher_first_name: teacher.first_name,
      teacher_last_name: teacher.last_name,
      teacher_school: teacher.school&.name,
      note: note
    }
    if admin
      identify(admin)
      track({
        user_id: admin.id,
        event: SegmentIo::BackgroundEvents::ADMIN_INVITED_BY_TEACHER,
        properties: properties,
      })
    else
      identify_anonymous_user({ traits: { email: admin_email, name: admin_name }})
      track({
        # Segment requires us to send a unique User ID or Anonymous ID for every event
        # sending the admin email as the anonymous id because that's how we find people in Ortto
        anonymous_id: admin_email,
        event: SegmentIo::BackgroundEvents::ADMIN_INVITED_BY_TEACHER,
        properties: properties,
        context: context
      })
    end
  end

  def track_teacher_invited_admin(teacher, admin_name, admin_email, note)
    track({
      user_id: teacher.id,
      event: SegmentIo::BackgroundEvents::TEACHER_INVITED_ADMIN,
      properties: {
        admin_name: admin_name,
        admin_email: admin_email,
        note: note
      }
    })
  end

  def default_integration_rules
    { all: true, Intercom: false }
  end

  def track(options)
    return unless backend.present?

    user = User.find(options[:user_id]) if options[:user_id] && options[:user_id] != 0
    options[:integrations] = user&.segment_user&.integration_rules || default_integration_rules
    backend.track(options)
  end


  def identify(user)
    return unless backend.present?
    return unless user&.teacher?

    identify_params = user&.segment_user&.identify_params
    backend.identify(identify_params) if identify_params
  end

  def identify_anonymous_user(params)
    return unless backend.present?

    backend.identify(params)
  end

  private def anonymous_uid
    SecureRandom.urlsafe_base64
  end

  private def user_traits(user)
    SegmentAnalyticsUserSerializer.new(user).as_json(root: false)
  end
end
