require_relative '../../config/environment'

module QuillBigQuery
  class MaterializedViews < Thor

    # e.g. bundle exec thor quill_big_query:materialized_views:refresh reporting_sessions_view
    desc 'refresh view_key', 'Refreshes (drops and creates) a specified Materialized View'
    def refresh(view_key) = mat_view(view_key).refresh!

    # e.g. bundle exec thor quill_big_query:materialized_views:drop reporting_sessions_view
    desc 'drop view_key', 'Drops a specified Materialized View'
    def drop(view_key) = mat_view(view_key).drop!

    # e.g. bundle exec thor quill_big_query:materialized_views:create reporting_sessions_view
    desc 'create view_key', 'Creates a specified Materialized View'
    def create(view_key) = mat_view(view_key).create!

    # put helper methods in this block
    no_commands do
      private def mat_view(view_key)
        ::QuillBigQuery::MaterializedView.new(view_key)
      end
    end
  end
end
