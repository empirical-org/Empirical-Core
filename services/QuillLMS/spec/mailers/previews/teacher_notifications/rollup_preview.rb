class RollupPreview < ActionMailer::Preview
  def welcome
    Rollup.welcome(User.first)
  end
end
