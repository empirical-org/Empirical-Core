namespace :activity_sessions do
  desc 'Identify which activity sessions represent the final score for each student, classroom_activity'
  task :is_final_score => :environment do


    User.find_each do |user|
      a = user.activity_sessions.where('completed_at IS NOT NULL and percentage IS NOT NULL').group_by(&:activity_id)

      a.each do |aid, ass|
        x1 = ass.max_by{|x| x.percentage}
        x1.update_columns is_final_score: true

        x2 = ass.reject{|x| x == x1}
        x2.each{|x| x.update_columns(is_final_score: false) }
      end

    end
  end

end

