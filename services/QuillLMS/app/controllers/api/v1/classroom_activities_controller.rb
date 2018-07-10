class Api::V1::ClassroomActivitiesController < Api::ApiController
  include QuillAuthentication
  before_filter :authorize!

  def student_names
    render json: get_assigned_student_hash
  end

  def teacher_and_classroom_name
    # this method belongs to the classroom unit now
    render json: @classroom_activity.teacher_and_classroom_name
  end

  def finish_lesson
    json = JSON.parse(params['json'])
    data = json['edition_id'] ? {edition_id: json['edition_id']} : {}
    # these methods belong to activity sessions now, and need to be passed a classroom unit id and an activity id
    @classroom_activity.mark_all_activity_sessions_complete(data)
    @classroom_activity.update(locked: true, pinned: false, completed: true)
    @classroom_activity.save_concept_results(json['concept_results'])
    @classroom_activity.delete_activity_sessions_with_no_concept_results
    if json['edition_id']
      milestone = Milestone.find_by_name('Complete Customized Lesson')
      if !UserMilestone.find_by(user_id: current_user.id, milestone_id: milestone.id)
        UserMilestone.create(user_id: current_user.id, milestone_id: milestone.id)
      end
    end
    follow_up = json['follow_up'] ? @classroom_activity.assign_follow_up_lesson(false) : false
    url = follow_up ? follow_up.generate_activity_url : "#{ENV['DEFAULT_URL']}"
    render json: {follow_up_url: url}
  end

  def pin_activity
    @classroom_activity.update(pinned: true)
    render json: @classroom_activity.pinned
  end

  def unpin_and_lock_activity
    @classroom_activity.update(pinned: false, locked: true)
    render json: @classroom_activity.pinned
  end

  def classroom_teacher_and_coteacher_ids
    teacher_ids = @classroom_activity.try(&:classroom).try(&:teacher_ids)
    if teacher_ids
      teacher_ids_h = Hash[teacher_ids.collect { |item| [item, true] } ]
    end
    render json: {teacher_ids: teacher_ids_h ? teacher_ids_h : {}}
  end

  private

  def authorize!
    @classroom_activity = ClassroomActivity.find params[:id]
    classroom_id = @classroom_activity.classroom.id
    classroom_teacher!(classroom_id)
  end

  def get_assigned_student_hash
    activity_sessions = @classroom_activity.activity_sessions.includes(:user)
    assigned_student_hash = {}
    assigned_student_ids_hash = {}
    activity_sessions.each do |act_sesh|
      if act_sesh.uid
        assigned_student_hash[act_sesh.uid] = act_sesh.user.name
      end
      if act_sesh.user_id
        assigned_student_ids_hash[act_sesh.user_id] = true
      end
    end
    {activity_sessions_and_names: assigned_student_hash, student_ids: assigned_student_ids_hash}
  end


end
