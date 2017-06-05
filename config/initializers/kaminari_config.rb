# frozen_string_literal: true
Kaminari.configure do |config|
  config.default_per_page = 20
  # config.window = 4
  # config.outer_window = 0
  # config.left = 0
  # config.right = 0
  # config.page_method_name = :page
  # config.param_name = :page
  # config.params_on_first_page = false
end

Kaminari::Hooks.init if defined?(Kaminari::Hooks)
Elasticsearch::Model::Response::Response.__send__ :include, Elasticsearch::Model::Response::Pagination::Kaminari
