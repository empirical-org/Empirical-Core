namespace :responses do
  desc 'merge duplicate responses'
  task :merge_duplicates => :environment do
    def roll_up_counts(response)
      question_uid = response.question_uid
      text = response.text
      total_count = Response.where(question_uid: question_uid, text: text).sum(:count)
      total_child_count = Response.where(question_uid: question_uid, text: text).sum(:child_count)
      total_first_attempt_count = Response.where(question_uid: question_uid, text: text).sum(:first_attempt_count)
      response.count = total_count
      response.child_count = total_child_count
      response.first_attempt_count = total_first_attempt_count
      response.save!
    end

    Response.select(:question_uid, :text).having('COUNT(*) > 1').group(:question_uid, :text).each do |unique_pair|
      merge_targets = Response.where(question_uid: unique_pair.question_uid, text: unique_pair.text).order(:created_at).all.to_a
      keep_me = merge_targets.shift
      roll_up_counts(keep_me)
      merge_targets.each { |delete_me| delete_me.destroy! }
    end
  end
end
