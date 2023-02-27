# frozen_string_literal: true

class StatusesController < ApplicationController
  protect_from_forgery with: :null_session

  around_action :force_writer_db_role, only: [:database_write]

  def index
    render plain: 'OK'
  end

  def database
    User.first
    render plain: 'OK'
  end

  def database_write
    BlogPost.first.touch
    render plain: 'OK'
  end

  def database_follower
    User.first
    render plain: 'OK'
  end

  def redis_cache
    $redis.info
    render plain: 'OK'
  end

  def redis_queue
    Sidekiq::Queue.all
    render plain: 'OK'
  end

  def sidekiq_queue_latency
    queues = Sidekiq::Queue.all
    latency_hash = queues.map { |q| [q.name, q.latency] }.to_h

    render json: latency_hash
  end

  def sidekiq_queue_length
    queues_hash = Sidekiq::Stats.new.queues
    retry_hash = {
      "retry" => Sidekiq::RetrySet.new.size
    }
    render json: queues_hash.merge(retry_hash)
  end

  def deployment_notification
    resp = Faraday.post("https://api.newrelic.com/v2/applications/#{ENV['NEW_RELIC_APP_ID']}/deployments.json") do |req|
      req.headers['X-Api-Key'] = ENV['NEW_RELIC_REST_API_KEY']
      req.headers['Content-Type'] = 'application/json'
      req.body = {
        "deployment": {
          "revision": "Commit: #{params['head_long']} | Heroku release: #{params['release']}",
          "changelog": params['git_log'],
          "description": params['head_long'],
          "user": params['user'],
          "timestamp": Time.current.utc
        }
      }.to_json
    end
    render plain: "OK", status: resp.status
  end
end
