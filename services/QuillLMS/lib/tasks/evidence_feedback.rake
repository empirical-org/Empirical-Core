# frozen_string_literal: true

namespace :evidence_feedback do
  desc 'Find any feedback that is not in HTML format and update it'
  task :ensure_html => :environment do
    def htmlize(input)
      return input if input.start_with?('<p>')

      input = input.gsub(/'/, '&#x27;')
      input = input.gsub(/"/, '&quot;')
      "<p>#{input}</p>"
    end

    Evidence::Feedback.where("text NOT LIKE '<p>%'").each do |feedback|
      feedback.update(text: htmlize(feedback.text))
    end

    # FeedbackHistory is a read-only model, so if we want to make changes to it
    # we have to do so through raw SQL rather than ActiveRecord
    sql = <<-SQL
      UPDATE feedback_histories
        SET feedback_text = CONCAT('<p>', REPLACE(REPLACE(feedback_text, '''', '&x27;'), '"', '&quot;'), '</p>')
        WHERE feedback_text NOT LIKE '<p>%'
    SQL
    ActiveRecord::Base.connection.execute(sql)
  end
end
