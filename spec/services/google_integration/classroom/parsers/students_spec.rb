require 'rails_helper'

describe 'GoogleIntegration::Classroom::Parsers::Students' do

  def subject(response)
    GoogleIntegration::Classroom::Parsers::Students.run(response)
  end

  let!(:body) {

    x = {
          "students":
          [
            {"courseId":"455798942",
             "userId":"107708392406225674265",
             "profile":
                {"id":"107708392406225674265",
                 "name":
                  {"givenName":"test1_s1",
                   "familyName":"s1",
                   "fullName":"test1_s1 s1"},
                  "emailAddress":"test1_s1@gedu.demo.rockerz.xyz"
                }
            }
          ]
    }

    x.to_json
  }

  let!(:response) {
    Response = Struct.new(:body)
    r = Response.new(body)
    r
  }

  let!(:expected_result) {
    [
      {name: 'test1_s1 s1', last_name: 's1', email: 'test1_s1@gedu.demo.rockerz.xyz'}
    ]
  }

  it 'works' do
    expect(subject(response)).to eq(expected_result)
  end
end