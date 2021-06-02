class DropUnusedLargeIndexes < ActiveRecord::Migration
  def change
    remove_index_if_exists :concept_results, :index_concept_results_on_question_type
    remove_index_if_exists :concept_results, :index_concept_results_on_activity_classification_id
    remove_index_if_exists :activity_sessions, :new_activity_sessions_state_idx
    remove_index_if_exists :activity_sessions, :new_activity_sessions_started_at_idx
    remove_index_if_exists :auth_credentials, :index_auth_credentials_on_access_token
    remove_index_if_exists :users, :index_users_on_flags
  end

  def remove_index_if_exists(table_name, index_name)
    # Some of the indexes being removed here only seem to exist in prod, so we need this check to prevent the migration from crashing in local dev environments
    index_exists = ActiveRecord::Base.connection.indexes(table_name).any? { |index| index.name == index_name.to_s }
    return unless index_exists

    remove_index table_name, name: index_name
  end
end
