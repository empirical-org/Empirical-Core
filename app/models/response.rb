require 'elasticsearch/model'

class Response < ApplicationRecord
  include Elasticsearch::Model
  after_create_commit :create_index_in_elastic_search
  after_update_commit :update_index_in_elastic_search
  after_destroy_commit :destroy_index_in_elastic_search



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
      created_at: created_at
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

  def create_index_in_elastic_search
    self.__elasticsearch__.index_document
  end

  def update_index_in_elastic_search
    self.__elasticsearch__.update_document
  end

  def destroy_index_in_elastic_search
    self.__elasticsearch__.delete_document
  end

end
