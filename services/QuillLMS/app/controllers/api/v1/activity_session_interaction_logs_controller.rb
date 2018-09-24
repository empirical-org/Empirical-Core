class Api::V1::ActivitySessionInteractionLogsController < Api::ApiController
	protect_from_forgery :except => [:create]


	def create
		act_sess_uid = params[:activity_session_id]
    act_sess = ActivitySession.find_by_uid!(act_sess_uid)
		meta = params[:meta] || {}
    puts params

    if ActivitySessionInteractionLog.create(activity_session_id: act_sess.id, meta: meta, date: DateTime.now)
      teachers = act_sess.classroom_unit.classroom.teachers
      PusherActivitySessionInteractionLogPosted.run(teachers)
			render :nothing => true, :status => 204
		else
			render_error(400)
		end
	end
end
