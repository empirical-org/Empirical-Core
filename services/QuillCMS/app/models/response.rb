require 'elasticsearch/model'

class Response < ApplicationRecord
  include Elasticsearch::Model
  after_create_commit :create_index_in_elastic_search
  after_update_commit :update_index_in_elastic_search
  after_commit :clear_responses_route_cache
  before_destroy :destroy_index_in_elastic_search

  validates :question_uid, uniqueness: { scope: :text }

  settings analysis: {
    analyzer: {
      custom_analyzer: {
        tokenizer: "whitespace"
      }
    }
  }, index: { number_of_shards: 1 } do
    mappings dynamic: 'false' do
      indexes :text, type: 'text', analyzer: :custom_analyzer
      indexes :sortable_text, type: 'keyword'
      indexes :id, type: 'integer'
      indexes :uid, type: 'text'
      indexes :question_uid, type: 'keyword'
      indexes :parent_id, type: 'integer'
      indexes :parent_uid, type: 'text'
      indexes :feedback, type: 'text'
      indexes :count, type: 'integer'
      indexes :child_count, type: 'integer'
      indexes :first_attempt_count, type: 'integer'
      indexes :author, type: 'text'
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
      4
    elsif parent_uid || parent_id
      optimal ? 2 : 3
    else
      optimal ? 0 : 1
    end
  end

  def create_index_in_elastic_search
    __elasticsearch__.index_document
  end

  def update_index_in_elastic_search
    __elasticsearch__.update_document
  end

  def destroy_index_in_elastic_search
    __elasticsearch__.delete_document
  end

  def clear_responses_route_cache
    Rails.cache.delete("questions/#{question_uid}/responses")
  end

  def self.find_by_id_or_uid(string)
    find_by_id(string) || find_by_uid(string)
  end
end
