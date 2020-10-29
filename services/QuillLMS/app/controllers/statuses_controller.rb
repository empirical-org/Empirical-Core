class StatusesController < ApplicationController
  skip_before_action :stick_to_leader_db, only: [:database_follower]

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

end
