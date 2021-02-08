class ExpireUserTokensWorker
  include Sidekiq::Worker

  def perform
    User.where.not(token: nil).each {|u| u.update!(token: nil)}
  end

end
