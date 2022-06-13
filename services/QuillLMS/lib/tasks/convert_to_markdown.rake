# frozen_string_literal: true

namespace :unit_templates do
  desc 'Convert unit template problem, summary, and review into activity_info markdown'
  task :convert_to_markdown => :environment do
    UnitTemplate.all.each do |ut|
      next unless ut.activity_info.blank?

      markdown = ''
      unless ut.problem.blank?
        markdown.concat "### Problem\n\n#{ut.problem}\n\n"
      end
      unless ut.summary.blank?
        markdown.concat "### Summary\n\n#{ut.summary}\n\n"
      end
      unless ut.teacher_review.blank?
        markdown.concat "### Activity Info\n\n#{ut.teacher_review}\n\n"
      end
      unless markdown.blank?
        ut.activity_info = markdown
        ut.save
        puts "💪   Unit Template updated: #{ut.name}"
      end
    end
  end
end
