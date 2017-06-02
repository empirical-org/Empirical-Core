require 'elasticsearch/model'

class Response < ApplicationRecord
  include Elasticsearch::Model

  settings index: { number_of_shards: 1 } do
    mappings dynamic: 'false' do
      indexes :text, fielddata: true
      indexes :id, type: 'integer'
      indexes :uid, type: 'string'
      indexes :question_uid, type: 'string'
      indexes :parent_id, type: 'integer'
      indexes :parent_uid, type: 'string'
      indexes :feedback, type: 'text'
      indexes :count, type: 'integer'
      indexes :child_count, type: 'integer'
      indexes :first_attempt_count, type: 'integer'
      indexes :author, type: 'string'
      indexes :status, type: 'integer'
      indexes :created_at, type: 'integer'
    end
  end

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
      created_at: created_at.to_i
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
