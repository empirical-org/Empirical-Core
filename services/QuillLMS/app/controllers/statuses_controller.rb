class StatusesController < ApplicationController
  skip_before_action :stick_to_leader_db, only: [:database_follower]
  protect_from_forgery with: :null_session

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

  def sidekiq_queue_length
    render json: Sidekiq::Stats.new.queues
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
          "timestamp": Time.now.utc
        }
      }.to_json
    end
    render plain: "OK", status: resp.status
  end
end
