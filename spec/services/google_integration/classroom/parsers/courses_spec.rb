require 'rails_helper'

describe 'GoogleIntegration::Classroom::Parsers::Courses' do

  def subject(response)
    GoogleIntegration::Classroom::Parsers::Courses.run(response)
  end

  let!(:body) {
    x = {"courses":[{"id":"455798942","name":"class1","ownerId":"117520115627269298978","creationTime":"2016-02-01T21:19:54.662Z","updateTime":"2016-02-01T21:20:39.424Z","enrollmentCode":"w5o4h0v","courseState":"ACTIVE","alternateLink":"http://classroom.google.com/c/NDU1Nzk4OTQy"}]}

    x.to_json
  }

  let!(:response) {
    Response = Struct.new(:body)
    r = Response.new(body)
    r
  }

  let!(:expected_result) {
    [
      {id: 455798942, name: 'class1'}
    ]
  }

  it 'works' do
    expect(subject(response)).to eq(expected_result)
  end
end