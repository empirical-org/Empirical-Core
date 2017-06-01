require 'elasticsearch/model'

class Response < ApplicationRecord
  include Elasticsearch::Model

  def as_indexed_json(options={})
    {
      id: id,
      uid: uid,
      question_uid: question_uid,
      parent_id: parent_id,
      parent_uid: parent_uid,
      text: text,
      feedback: feedback,
      count: count,
      child_count: child_count,
      first_attempt_count: first_attempt_count,
      author: author,
      status: grade_status,
    }
  end

  def grade_status
    if feedback.nil?
      return 4
    elsif parent_uid || parent_id
      optimal ? 2 : 3
    else
      optimal ? 0 : 1
    end
  end

end
