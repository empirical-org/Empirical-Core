# frozen_string_literal: true

ActionController::Renderers.add :csv do |obj, options|
  filename = options[:filename] || 'data'
  str = obj.respond_to?(:to_csv) ? obj.to_csv : obj.to_s
  send_data str, :type => Mime::CSV,
    :disposition => "attachment; filename=#{filename}.csv"
end
