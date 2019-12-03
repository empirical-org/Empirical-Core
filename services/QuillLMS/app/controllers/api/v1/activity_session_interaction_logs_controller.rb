class Api::V1::ActivitySessionInteractionLogsController < Api::ApiController
	protect_from_forgery :except => [:create]


	def create
		act_sess_uid = params[:activity_session_id]
    meta = params[:meta] || {}
    act_sess_id = $redis.get("ACT_SESS_ID_FROM_UID_#{act_sess_uid}")
    act_sess = nil
    if act_sess_id.nil?
      act_sess_id_cache_life = 60*60*24 # => a day, these won't change but they won't be used that often
      act_sess = ActivitySession.find_by_uid!(act_sess_uid)
      act_sess_id = act_sess.id
      $redis.set("ACT_SESS_ID_FROM_UID_#{act_sess_uid}", act_sess_id)
      $redis.expire("ACT_SESS_ID_FROM_UID_#{act_sess_uid}", act_sess_id_cache_life)
    end

    # write log, notify teachers
    interaction_log_creation_time = DateTime.now
    if ActivitySessionInteractionLog.create(activity_session_id: act_sess_id, meta: meta, date: interaction_log_creation_time)
      classroom_id = $redis.get("CLASSROOM_ID_FROM_ACTIVITY_SESSION_#{act_sess_id}")
      if act_sess.nil?
        act_sess = ActivitySession.find(act_sess_id)
      end
      if classroom_id.nil?
        classroom_id = act_sess.classroom_unit.classroom_id
        cache_life = 60*60 # => an hour, maybe they added a coteacher!
        $redis.set("CLASSROOM_ID_FROM_ACTIVITY_SESSION_#{act_sess_id}", classroom_id)
        $redis.expire("CLASSROOM_ID_FROM_ACTIVITY_SESSION_#{act_sess_id}", cache_life)
      end

      teachers = $redis.get("TEACHERS_FROM_CLASSROOM_ID_#{classroom_id}")
      if teachers.nil?
        classroom = Classroom.find(classroom_id)
        teachers = classroom.teachers.map{|t| t.id}
        cache_life = 60*60 # => an hour, maybe they added a coteacher!
        $redis.set("TEACHERS_FROM_CLASSROOM_ID_#{classroom_id}", teachers.join(','))
        $redis.expire("TEACHERS_FROM_CLASSROOM_ID_#{classroom_id}", cache_life)
      else
        teachers = teachers.split(',')
      end
      PusherActivitySessionInteractionLogPosted.run(teachers)
			render :nothing => true, :status => 204
	  else
			render_error(400)
		end

	end
end
