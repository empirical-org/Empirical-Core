require 'elasticsearch/model'

class Response < ApplicationRecord
  include Elasticsearch::Model
  after_create_commit :create_index_in_elastic_search
  after_update_commit :update_index_in_elastic_search
  before_destroy :destroy_index_in_elastic_search

  settings index: { number_of_shards: 1 } do
    mappings dynamic: 'false' do
      indexes :text, type: 'string'
      indexes :sortable_text, type: 'keyword'
      indexes :id, type: 'integer'
      indexes :uid, type: 'string'
      indexes :question_uid, type: 'string', index: "not_analyzed"
      indexes :parent_id, type: 'integer'
      indexes :parent_uid, type: 'string'
      indexes :feedback, type: 'text'
      indexes :count, type: 'integer'
      indexes :child_count, type: 'integer'
      indexes :first_attempt_count, type: 'integer'
      indexes :author, type: 'string'
      indexes :status, type: 'integer'
      indexes :created_at, type: 'integer'
      indexes :spelling_error, type: 'boolean'
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
      sortable_text: text ? text.downcase : '',
      feedback: feedback,
      count: count,
      child_count: child_count,
      first_attempt_count: first_attempt_count,
      author: author,
      status: grade_status,
      created_at: created_at.to_i,
      spelling_error: spelling_error
    }
  end

  def grade_status
    if optimal.nil? && parent_id.nil?
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
