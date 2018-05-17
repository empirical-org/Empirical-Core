require 'rails_helper'

describe 'GoogleIntegration::Classroom::Parsers::Students' do

  def subject(response)
    GoogleIntegration::Classroom::Parsers::Students.run(response)
  end

  let!(:body) {

    x = {
             "profile":
                {"id":"107708392406225674265",
                 "name":
                  {"givenName":"test1_s1",
                   "familyName":"s1",
                   "fullName":"test1_s1 s1"},
                  "emailAddress":"test1_s1@gedu.demo.rockerz.xyz"
                }
            }


    x = JSON.parse(x.to_json)
  }

  let!(:response) {
    response = Struct.new(:body)
    response.new(body)
  }

  let!(:expected_result) {
    [
      {name: 'test1_s1 s1', last_name: 's1', first_name: "test1_s1", email: 'test1_s1@gedu.demo.rockerz.xyz'}
    ]
  }

  it 'works' do
    expect(subject(response)).to eq(expected_result)
  end
end
