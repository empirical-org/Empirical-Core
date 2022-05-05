# frozen_string_literal: true

require 'rails_helper'

describe "user_mailer/daily_stats_email.html.erb", type: :view do

  it "displays the email" do
    allow(view).to receive(:stylesheet_link_tag)
    mock_nps = {
      'nps': 100,
      'respondents': [9, 0, 0]
    }
    assign(:current_date, Time.current)
    assign(:daily_active_teachers, 10)
    assign(:daily_active_students, 10)
    assign(:new_teacher_signups, 99)
    assign(:new_student_signups, 53)
    assign(:classrooms_created, 18)
    assign(:activities_assigned, 1)

    assign(:sentences_written, 15)
    assign(:diagnostics_completed, 17)
    assign(:teacher_conversion_rate, 98)
    assign(:support_tickets_resolved, 15)
    assign(:satismeter_nps_data, mock_nps.to_json)
    assign(:satismeter_comment_data, [])

    render

    expect(rendered).to match("nps")
  end
end
