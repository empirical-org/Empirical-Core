module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :question_uid
  end
end
