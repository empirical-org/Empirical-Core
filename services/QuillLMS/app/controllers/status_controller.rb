class StatusController < ApplicationController

  def index
    render plain: 'OK'
  end

  def database
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

  def firebase
    classroom_unit_id = ClassroomUnit.first.id
    host = ENV['FIREBASE_DATABASE_URL']
    path = "/v2/classroom_lesson_sessions/#{classroom_unit_id}/students.json"
    res = Net::HTTP.get_response(host, path)
    raise res.body unless res.code == 200
    render plain: 'OK'
  end

end
