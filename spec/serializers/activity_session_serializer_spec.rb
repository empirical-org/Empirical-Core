require 'rails_helper'

describe ActivitySessionSerializer, type: :serializer do
  let(:concept_class)              { FactoryGirl.create(:concept_class) }
  let(:concept_tag)                { FactoryGirl.create(:concept_tag, concept_class: concept_class) }
  let(:concept_tag_metadata_key)   { 'foo' }
  let(:concept_tag_metadata_value) { 'bar' }
  let(:concept_tag_metadata)       { { concept_tag_metadata_key => concept_tag_metadata_value } }
  let(:concept_tag_result)         { FactoryGirl.create(:concept_tag_result, metadata: concept_tag_metadata, concept_tag: concept_tag) }
  let(:activity_session)           { FactoryGirl.create(:activity_session, concept_tag_results: [concept_tag_result]) }

  let(:serializer)                 { ActivitySessionSerializer.new(activity_session) }

  describe '#to_json output' do
    let(:json)   { serializer.to_json }
    let(:parsed) { JSON.parse(json) }

    activity_session_key = 'activity_session'

    it "includes '#{activity_session_key}' key" do
      expect(parsed.keys).to include(activity_session_key)
    end

    describe "'#{activity_session_key}' object" do
      let(:parsed_activity_session) { parsed[activity_session_key] }

      concept_tag_results_key = 'concept_tag_results'

      it 'has the correct keys' do
        expect(parsed_activity_session.keys)
          .to match_array %w(activity_uid
                             anonymous
                             completed_at) +
                            [concept_tag_results_key] +
                          %w(data
                             percentage
                             state
                             temporary
                             time_spent
                             uid)
      end

      describe "'#{concept_tag_results_key}' object" do
        it 'has the correct contents' do
          actual = parsed_activity_session[concept_tag_results_key]
          expect(actual).to match_array [
            { 'concept_tag'            => concept_tag.name,
              concept_tag_metadata_key => concept_tag_metadata_value
            }]
        end
      end
    end
  end
end
