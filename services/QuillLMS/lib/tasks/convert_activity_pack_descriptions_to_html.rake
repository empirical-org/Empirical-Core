# frozen_string_literal: true

namespace :activity_pack_descriptions do
  desc 'converts all activity pack descriptions stored in the field unit_template.activity_info to HTML from markdowns'
  task :convert => :environment do
    ActiveRecord::Base.transaction do
      markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML.new(filter_html: true, hard_wrap: true))
      UnitTemplate.all.each do |unit_template|
        converted_text = markdown.render(unit_template.activity_info || "")
        unit_template.update!(activity_info: converted_text)
        puts "Converted activity info for unit template #{unit_template.id}"
      end
    end
  end
end
