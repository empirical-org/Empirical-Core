require 'rails_helper'

describe GoogleIntegration::Announcements do
  it 'makes request to google classroom with the announcement for an assigned activity' do
    unit = create(:unit)
    unit_activity = create(:unit_activity)
    classroom

    client = double('client')
    allow(client).to receive_message_chain(
      :discovered_api,
      :courses,
      :announcements,
      :create
    ) { 'api_method' }

    expect(client).to receive(:execute).with({
      api_method: 'api_method',
      parameters: {
        courseId: google_course_id,
      },
      body: {
        text: "New Activity: #{activity_name} #{activity_url}"
        assigneeMode: "INDIVIDUAL_STUDENTS",
        individualStudentsOptions: {
          studentIds: assigned_student_ids_as_google_ids
        }
      },
      headers: {"Content-Type": 'application/json'}
    })

    GoogleIntegration::Announcements.new()
  end
end
