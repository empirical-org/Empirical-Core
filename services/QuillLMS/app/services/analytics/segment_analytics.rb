class SegmentAnalytics
  # The actual backend that this uses to talk with segment.io.
  # This will be a fake backend under test and a real object
  # elsewhere.
  class_attribute :backend


  # TODO : split this all out in the way that SigninAnalytics splits out

  def initialize
    # Do not clobber the backend object if we already set a fake one under test
    unless Rails.env.test?
      self.backend ||= Segment::Analytics.new({
        write_key: SegmentIo.configuration.write_key,
        on_error: proc { |status, msg| print msg }
      })
    end
  end

  def track_event_from_string(event_name, user_id)
    # make sure that event name is written as a string in the pattern of
    # those in app/services/analytics/segment_io.rb
    # i.e. "BUILD_YOUR_OWN_ACTIVITY_PACK"
    user = User.find(user_id)
    track(user, {
       user_id: user_id,
       event: "SegmentIo::BackgroundEvents::#{event_name}".constantize
      })
  end

  def track_activity_assignment(teacher_id, activity_id)
    user = User.find(teacher_id)
    activity = Activity.find(activity_id)

    # properties here get used by Heap
    track(user, {
      user_id: teacher_id,
      event: SegmentIo::BackgroundEvents::ACTIVITY_ASSIGNMENT,
      properties: activity_info_for_tracking(activity)
    })

    # this event is for Vitally, which does not show properties
    if Activity.diagnostic_activity_ids.include?(activity_id)
      track(user, {
        user_id: teacher_id,
        event: "#{SegmentIo::BackgroundEvents::DIAGNOSTIC_ASSIGNMENT} | #{activity.name}"
      })
    end
  end

  def track_activity_pack_assignment(teacher_id, unit_id)
    user = User.find(teacher_id)
    unit = Unit.find(unit_id)

    if unit.unit_template_id
      if unit.activities.all? { |a| Activity.diagnostic_activity_ids.include?(a.id) }
        activity_pack_type = 'Diagnostic'
      else
        activity_pack_type = 'Pre-made'
      end
    else
      activity_pack_type = 'Custom'
    end

    # we don't want to have a unique event for teacher-named packs because that would be a potentially infinite number of unique events
    activity_pack_name_string = activity_pack_type == 'Custom' ? '' : " | #{unit.name}"

    # first event is for Vitally, which does not show properties
    track(user, {
      user_id: teacher_id,
      event: "#{SegmentIo::BackgroundEvents::ACTIVITY_PACK_ASSIGNMENT} | #{activity_pack_type}#{activity_pack_name_string}"
    })
    # second event is for Heap, which does
    track(user, {
      user_id: teacher_id,
      event: SegmentIo::BackgroundEvents::ACTIVITY_PACK_ASSIGNMENT,
      properties: {
        activity_pack_name: unit.name,
        activity_pack_type: activity_pack_type
      }
    })
  end

  def track_activity_completion(user, activity)
    track(user, {
      user_id: user.id,
      event: SegmentIo::BackgroundEvents::ACTIVITY_COMPLETION,
      properties: activity_info_for_tracking(activity)
    })
  end

  def track_classroom_creation(classroom)
    user = User.find(classroom&.owner&.id)
    # first event is for Vitally, which does not show properties
    track(user, {
      user_id: classroom&.owner&.id,
      event: "#{SegmentIo::BackgroundEvents::CLASSROOM_CREATION} | #{classroom.classroom_type_for_segment}"
    })
    # second event is for Heap, which does
    track(user, {
      user_id: classroom&.owner&.id,
      event: SegmentIo::BackgroundEvents::CLASSROOM_CREATION,
      properties: {
        classroom_type: classroom.classroom_type_for_segment
      }
    })
  end

  def track_activity_search(user_id, search_query)
    user = User.find(user_id)
    track(user, {
      user_id: user_id,
      event: SegmentIo::BackgroundEvents::ACTIVITY_SEARCH,
      properties: {
        search_query: search_query
      }
    })
  end

  def track_student_login_pdf_download(user_id, classroom_id)
    user = User.find(user_id)
    track(user, {
      user_id: user_id,
      event: SegmentIo::BackgroundEvents::STUDENT_LOGIN_PDF_DOWNLOAD,
      properties: {
        classroom_id: classroom_id
      }
    })
  end

  def track(user, options)
    if backend.present?
      options[:integrations] = integration_rules(user)
      backend.track(options)
    end
  end


  def identify(user)
    if backend.present? && user&.teacher?
      backend.identify(identify_params(user))
    end
  end

  private

  def anonymous_uid
    SecureRandom.urlsafe_base64
  end

  def integration_rules(user)
    should_send_data = (user&.role == 'teacher')
    integrations = {
     all: true,
     Intercom: should_send_data,
     Salesmachine: false
    }
    integrations
  end


  def identify_params(user)
    params = {
      user_id: user.id,
      traits: {
        premium_state: user.premium_state,
        premium_type: user.subscription&.account_type,
        auditor: user.auditor?
      },
      integrations: integration_rules(user)
    }
  end

  def user_traits(user)
    SegmentAnalyticsUserSerializer.new(user).as_json(root: false)
  end

  def activity_info_for_tracking(activity)
    {
      activity_name: activity.name,
      tool_name: activity.classification.name.split(' ')[1]
    }
  end
end
