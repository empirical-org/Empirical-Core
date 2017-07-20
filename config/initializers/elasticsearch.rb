require 'elasticsearch/model'
require 'elasticsearch/transport'

if Rails.env.production?
  Elasticsearch::Model.client = Elasticsearch::Client.new url: ENV['ELASTICSEARCH_URL']
end
