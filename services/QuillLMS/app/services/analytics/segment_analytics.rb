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
      properties: activity_info_for_tracking(activity)
    })

    # this event is for Vitally, which does not show properties
    return unless Activity.diagnostic_activity_ids.include?(activity_id)

    track({
      user_id: teacher_id,
      event: "#{SegmentIo::BackgroundEvents::DIAGNOSTIC_ASSIGNMENT} | #{activity.name}"
    })
  end

  # rubocop:disable Metrics/CyclomaticComplexity
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

    # we don't want to have a unique event for teacher-named packs because that would be a potentially infinite number of unique events
    activity_pack_name_string = unit&.unit_template&.name ? " | #{unit&.unit_template&.name}" : ''

    # first event is for Vitally, which does not show properties
    track({
      user_id: teacher_id,
      event: "#{SegmentIo::BackgroundEvents::ACTIVITY_PACK_ASSIGNMENT} | #{activity_pack_type}#{activity_pack_name_string}"
    })
    # second event is for Heap, which does
    track({
      user_id: teacher_id,
      event: SegmentIo::BackgroundEvents::ACTIVITY_PACK_ASSIGNMENT,
      properties: {
        activity_pack_name: unit&.unit_template&.name || unit&.name,
        activity_pack_type: activity_pack_type
      }
    })
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def track_activity_completion(user, student_id, activity)
    track({
      user_id: user&.id,
      event: SegmentIo::BackgroundEvents::ACTIVITY_COMPLETION,
      properties: activity_info_for_tracking(activity).merge({student_id: student_id})
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
      properties: {
        activity_name: activity&.name,
        tool_name: activity&.classification&.name
      }
    })

  end

  def track(options)
    return unless backend.present?

    options[:integrations] = integration_rules(options[:user_id])
    backend.track(options)
  end


  def identify(user)
    return unless backend.present?
    return unless user&.teacher?

    backend.identify(identify_params(user))
  end

  private def anonymous_uid
    SecureRandom.urlsafe_base64
  end

  private def integration_rules(user_id)
    user = User.find_by_id(user_id)

    {
     all: true,
     Intercom: (user&.role == 'teacher')
    }
  end


  private def identify_params(user)
    {
      user_id: user.id,
      traits: {
        premium_state: user.premium_state,
        premium_type: user.subscription&.account_type,
        auditor: user.auditor?,
        district: user.school&.district&.name
      },
      integrations: integration_rules(user.id)
    }
  end

  private def user_traits(user)
    SegmentAnalyticsUserSerializer.new(user).as_json(root: false)
  end

  private def activity_info_for_tracking(activity)
    {
      activity_name: activity.name,
      tool_name: activity.classification.name.split[1]
    }
  end
end
