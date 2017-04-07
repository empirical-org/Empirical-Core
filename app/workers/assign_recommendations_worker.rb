class AssignRecommendationsWorker
  include Sidekiq::Worker

  def perform(ut_id, classroom_id, student_id_array, last=false)
    teacher = Classroom.find(classroom_id).teacher
    unit = Unit.find_by(name: UnitTemplate.find(ut_id).name, user_id: teacher.id)

    classroom_array = [{id: classroom_id, student_ids: student_id_array}]

    if unit
        Units::Updater.assign_unit_template_to_one_class(unit, classroom_array)
    else
        #  TODO: use a find or create for the unit var above.
        #  This way, we can just pass the units creator a unit argument.
        #  The reason we are not doing so at this time, is because the unit creator
        #  Is used elsewhere, and we do not want to overly optimize it for the diagnostic
        Units::Creator.assign_unit_template_to_one_class(teacher_id, value[:id], classroom_array)
    end

    analytics = AssignRecommendationsAnalytics.new
    analytics.track(teacher)

    if last
      pusher_client = Pusher::Client.new(
          app_id: '325356',
          key: 'e8e2624f034662fa347d',
          secret: '74bbba418f6faa68bf87',
          encrypted: true
      )
      pusher_client.trigger('my-channel', 'my-event', message: 'hello world')
    end
  end
end
