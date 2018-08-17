class ActivitySessionInteractionLogsController < ApplicationController
	protect_from_forgery :except => [:create]


	def create
		act_sess = params[:activity_session_id]
		meta = params[:meta] || {}


		if ActivitySessionInteractionLog.create(activity_session_id: act_sess, meta: meta, date: DateTime.now)
			render :nothing => true, :status => 204
		else
			render_error(400)
		end
	end
end
