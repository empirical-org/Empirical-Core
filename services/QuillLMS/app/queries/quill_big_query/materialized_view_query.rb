# frozen_string_literal: true

module QuillBigQuery
  class MaterializedViewQuery < Query
    def run_query
      super
    rescue ::Google::Cloud::NotFoundError, ::Google::Cloud::InvalidArgumentError => e
      raise unless materialized_views.any? { |view| e.message.include?(view.name) }

      post_query_transform(runner.execute(query_without_materialized_views))
    end

    def query_without_materialized_views
      materialized_views_used.reduce(query) do |accumulator, view_name|
        view = MaterializedView.new(view_name)

        # If there is already an AS clause for this view, keep it
        return accumulator.gsub(view.name, "(#{view.sql})") if accumulator =~ /#{view.name}\s+as\s+[^\s]+/i

        name_without_namespace = view.name.split(",", 2).second

        accumulator.gsub(view.name, "(#{view.sql}) AS #{name_without_namespace}")
      end
    end

    def materialized_views_used = []
    def materialized_views = @materialized_views ||= materialized_views_used.map { |view| MaterializedView.new(view) }
  end
end
