class RemoveIndicesFromResponses < ActiveRecord::Migration[5.1]
  def change
    remove_index :responses, name: :index_responses_on_text_and_question_uid
    remove_index :responses, name: :index_responses_on_author
    remove_index :responses, name: :index_responses_on_parent_uid
    remove_index :responses, name: :index_responses_on_text
  end
end
