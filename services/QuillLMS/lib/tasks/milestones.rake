# frozen_string_literal: true

namespace :milestones do
  desc 'create milestones'
  task :create => :environment do
    MilestoneCreator::find_or_create_milestones
  end

  desc 'match milestones to existing users'
  task :match_with_existing_users => :environment do
    User.where(role:'teacher').each do |teacher|
      MilestoneMatcher::completed_diagnostic(teacher)
    end
  end


  module MilestoneCreator
    def self.data
      [
        {name: 'View Lessons Tutorial'},
        {name: 'Complete Diagnostic'}
      ]
    end

    def self.find_or_create_milestones
      data.map do |ms|
        Milestone.find_or_create_by(name: ms[:name])
      end
    end
  end

  module MilestoneMatcher
    def self.completed_diagnostic(teacher)
      milestone = Milestone.find_by(name: 'Complete Diagnostic')
      return if teacher.finished_diagnostic_unit_ids.empty?
      return if milestone.users.find_by(id: teacher.id)

      teacher.milestones.push(milestone)
    end
  end
end
