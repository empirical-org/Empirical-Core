class Api::V1::ActivitySessionInteractionLogsController < Api::ApiController
	protect_from_forgery :except => [:create]


	def create
		act_sess_uid = params[:activity_session_id]
    meta = params[:meta] || {}
    act_sess_id = $redis.get("ACT_SESS_ID_FROM_UID_#{act_sess_uid}")
    if act_sess_id.nil?
      act_sess_id_cache_life = 60*60*24 # => a day, these won't change but they won't be used that often
      act_sess = ActivitySession.find_by_uid!(act_sess_uid)
      act_sess_id = act_sess.id
      $redis.set("ACT_SESS_ID_FROM_UID_#{act_sess_uid}", act_sess_id)
      $redis.expire("ACT_SESS_ID_FROM_UID_#{act_sess_uid}", act_sess_id_cache_life)
    end

    if ActivitySessionInteractionLog.create(activity_session_id: act_sess_id, meta: meta, date: DateTime.now)
      teachers = $redis.get("#{act_sess_id}_TEACHERS")
      if teachers.nil?
        teachers = act_sess.classroom_unit.classroom.teachers.map{|t| t.id}
        cache_life = 60*60 # => an hour, maybe they added a coteacher!
        $redis.set("#{act_sess_id}_TEACHERS", teachers.join(','))
        $redis.expire("#{act_sess_id}_TEACHERS", cache_life)
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
