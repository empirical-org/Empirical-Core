module Cleanup
  def self.wipe_time_spent
    ActivitySession.update_all time_spent: nil
  end

  def self.find_and_mark_incompleted_retries
    ClassroomActivity.find_each do |ca|
      debug_tag = "Classroom Activity ##{ca.id}: "

      # puts "#{debug_tag}: Found #{ca.activity_sessions.incomplete.size} sessions"
      num_updated = 0
      ca.activity_sessions.incomplete.each do |a|
        student = a.user
        if student.present?
          completed_sessions = ca.activity_sessions.completed.where('user_id = ? AND activity_sessions.id != ?', student.id, a.id)
          # puts "#{debug_tag}: Completed sessions: #{completed_sessions.size}"
          if completed_sessions.size > 0
            a.update_attribute :is_retry, true
            num_updated += 1
          end
        end
      end
      puts "#{debug_tag}: marked #{num_updated} sessions as retries"
    end
  end

  def self.mark_retried_activity_sessions
    ClassroomActivity.find_each do |ca|
      as = ca.activity_sessions
      puts "#{debug_tag}: Found #{as.size} activity sessions"
      x = as.group_by{|ele| ele.user_id}
      num_users = x.size
      num_sessions = as.size
      puts "#{debug_tag}: Found #{num_users} users"
      num_sessions_marked = 0
      x.each do |key, value|

        user1_activity_sessions = value

        num_user_sessions = user1_activity_sessions.size
        creation_dates = user1_activity_sessions.map(&:created_at)
        if creation_dates.length == creation_dates.compact.length
          first = user1_activity_sessions.min{|a, b| a.created_at <=> b.created_at}

          user1_activity_sessions.delete(first)

          first.update_attribute :is_retry, false

          user1_activity_sessions.each do |retry_n|
            retry_n.update_attribute :is_retry, true
          end
          num_sessions_marked += user1_activity_sessions.size

          puts "#{debug_tag}: Marked #{user1_activity_sessions.size} as retries"
        else
          # Skipped this user, so don't count any towards the numbers
          # puts "#{debug_tag}: Creation dates did not match length"
          num_sessions -= num_user_sessions
          num_users -= 1
          # exit
        end
      end
      if num_sessions_marked != (num_sessions - num_users)
        puts "#{debug_tag}: Found discrepancy"
        exit
      end
    end
  end
end