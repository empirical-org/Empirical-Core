require 'rails_helper'

describe 'GoogleIntegration::Classroom::Parsers::Courses' do

  let!(:user) { FactoryGirl.create(:user, google_id: "117520115627269298978", role: 'teacher') }
  let!(:imported_classroom) { FactoryGirl.create(:classroom, google_classroom_id: '455798942', teacher_id: user.id)}

  let!(:body) {
    x = {"courses":[{"id":"455798942",
                      "name":"class1",
                      "ownerId":"117520115627269298978",
                      "creationTime":"2016-02-01T21:19:54.662Z",
                      "updateTime":"2016-02-01T21:20:39.424Z",
                      "enrollmentCode":"w5o4h0v",
                      "alternateLink":"http://classroom.google.com/c/NDU1Nzk4OTQy"}]}
    x.to_json
  }

  let!(:response) {
    Response = Struct.new(:body)
    r = Response.new(body)
    r
  }

  let!(:archived_body) {
    x = {"courses":[{"id":"455798942",
                      "name":"class1",
                      "ownerId":"117520115627269298978",
                      "creationTime":"2016-02-01T21:19:54.662Z",
                      "updateTime":"2016-02-01T21:20:39.424Z",
                      "enrollmentCode":"w5o4h0v",
                      "courseState":"ARCHIVED",
                      "alternateLink":"http://classroom.google.com/c/NDU1Nzk4OTQy"}]}
    x.to_json
  }

  let!(:archived_response) {
    Response = Struct.new(:body)
    # putting struct body makes the next
    # line automatically set archived body as the value attached to the
    # :body key
    r = Response.new(archived_body)
    r
  }

  let!(:expected_result) {
    course = JSON.parse(body)['courses'][0]
    [
      {id: course['id'].to_i, name: course['name'], ownerId: course['ownerId'], alreadyImported: true, creationTime: course['creationTime']}
    ]
  }

  it 'works' do
    expect(GoogleIntegration::Classroom::Parsers::Courses.run(user, response)).to eq(expected_result)
  end

  it 'only returns classes where the passed user is also the class owner' do
    user.google_id = (user.google_id.to_i + 1).to_s
    expect(GoogleIntegration::Classroom::Parsers::Courses.run(user, response)).to eq([])
  end

  describe 'classrooms that were archived on Google' do

    it "only show up if they have already been imported" do
      expect(GoogleIntegration::Classroom::Parsers::Courses.run(user, archived_response)).to eq(expected_result)
    end

    it "don't show up if they have not been imported" do
      imported_classroom.update(google_classroom_id: '2')
      imported_classroom.reload
      expect(GoogleIntegration::Classroom::Parsers::Courses.run(user, archived_response)).to eq([])
    end

  end




end
