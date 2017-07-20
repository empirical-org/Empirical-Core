class AdminQuestionChannel < ApplicationCable::Channel

  def subscribed
    stream_from "admin_question_#{params[:question_uid]}"
  end

end
