# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(ActivitiesController, :type => :controller) do
    before { @routes = Engine.routes }

    context '#increment_version' do
      it 'should increment version and persist new changelog with note' do
        changelog_note_text = 'a note'
        activity = create(:evidence_activity, version: 1)
        put :increment_version, params: {note: changelog_note_text, id: activity.id }
        expect(response.status).to eq(204)
        expect(Evidence::Activity.find(activity.id).version).to eq 2

        created_changelog = Evidence.change_log_class.where(changed_record_id: activity.id).order(created_at: :desc).first
        expect(created_changelog.explanation).to eq changelog_note_text
      end
    end

    context 'should index' do
      it 'should return successfully - no activities' do
        get(:index)
        parsed_response = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(parsed_response.class).to(eq(Array))
        expect(parsed_response.empty?).to(eq(true))
      end

      context 'should with actitivites' do
        let!(:first_activity) { create(:evidence_activity, :title => "An Activity", :notes => "Notes 1", :target_level => 8) }

        before do
          create(:evidence_activity, :title => "The Activity", :notes => "Notes 2", :target_level => 5)
        end

        it 'should return successfully' do
          get(:index)
          parsed_response = JSON.parse(response.body)
          expect(response.status).to eq(200)
          expect(parsed_response.class).to(eq(Array))
          expect(parsed_response.empty?).to(eq(false))
          expect(parsed_response.first["title"]).to(eq("An Activity"))
          expect(parsed_response.first["target_level"]).to(eq(8))
          expect(parsed_response.first["parent_activity_id"]).to(eq(first_activity.parent_activity.id))
        end
      end
    end

    context 'should create' do
      let!(:activity) { build(:evidence_activity, :parent_activity_id => 1, :title => "First Activity", :target_level => 8, :scored_level => "4th grade", :notes => "First Activity - Notes") }

      before do
        session[:user_id] = 1
        Evidence.parent_activity_classification_class.create(:key => "evidence")
      end

      it 'should create a valid record and return it as json' do
        post(:create, :params => ({ :activity => ({ :parent_activity_id => activity.parent_activity_id, :scored_level => activity.scored_level, :target_level => activity.target_level, :title => activity.title, :notes => activity.notes }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["title"]).to(eq("First Activity"))
        expect(parsed_response["notes"]).to(eq("First Activity - Notes"))
        expect(Activity.count).to(eq(1))
      end

      it "should make a change log record after creating the Activity record" do
        post :create, params: { activity: { parent_activity_id: activity.parent_activity_id, scored_level: activity.scored_level, target_level: activity.target_level, title: activity.title, notes: activity.notes }}

        new_activity = Activity.last
        change_log = Evidence.change_log_class.last
        expect(change_log.serializable_hash["full_action"]).to(eq("Evidence Activity - created"))
        expect(change_log.user_id).to(eq(1))
        expect(change_log.changed_record_type).to(eq("Evidence::Activity"))
        expect(change_log.changed_record_id).to(eq(new_activity.id))
        expect(change_log.new_value).to(eq(nil))
      end

      it 'should not create an invalid record and return errors as json' do
        post(:create, :params => ({ :activity => ({ :parent_activity_id => activity.parent_activity_id }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["title"].include?("can't be blank")).to(eq(true))
        expect(Activity.count).to(eq(0))
      end

      it 'should create a valid record with passage attributes' do
        post(:create, :params => ({ :activity => ({ :parent_activity_id => activity.parent_activity_id, :scored_level => activity.scored_level, :target_level => activity.target_level, :title => activity.title, :notes => activity.notes, :passages_attributes => ([{ :text => ("Hello " * 20) }]) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["title"]).to(eq("First Activity"))
        expect(parsed_response["notes"]).to(eq("First Activity - Notes"))
        expect(Activity.count).to(eq(1))
        expect(Activity.first.passages.count).to(eq(1))
        expect(Activity.first.passages.first.text).to(eq(("Hello " * 20)))
      end

      it 'should create a valid record with prompt attributes' do
        post(:create, :params => ({ :activity => ({ :parent_activity_id => activity.parent_activity_id, :scored_level => activity.scored_level, :target_level => activity.target_level, :title => activity.title, :notes => activity.notes, :prompts_attributes => ([{ :text => "meat is bad for you.", :conjunction => "because" }]) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["title"]).to(eq("First Activity"))
        expect(parsed_response["notes"]).to(eq("First Activity - Notes"))
        expect(Activity.count).to(eq(1))
        expect(Activity.first.prompts.count).to(eq(1))
        expect(Activity.first.prompts.first.text).to(eq("meat is bad for you."))
      end

      it 'should create a new parent activity and activity if no parent_activity_id is passed' do
        post(:create, :params => ({ :activity => ({ :parent_activity_id => nil, :scored_level => activity.scored_level, :target_level => activity.target_level, :title => activity.title, :notes => activity.notes, :prompts_attributes => ([{ :text => "meat is bad for you.", :conjunction => "because" }]) }) }))
        parent_activity = Evidence.parent_activity_class.find_by_name(activity.title)
        new_activity = Activity.find_by_title(activity.title)
        expect(parent_activity.present?).to(eq(true))
        expect(parent_activity.id).to(eq(new_activity.parent_activity_id))
        expect(new_activity.present?).to(eq(true))
      end
    end

    context 'should show' do
      let!(:activity) { create(:evidence_activity, :parent_activity_id => 1, :title => "First Activity", :target_level => 8, :scored_level => "4th grade") }
      let!(:passage) { create(:evidence_passage, :activity => (activity), :text => ("Hello" * 20)) }
      let!(:prompt) { create(:evidence_prompt, :activity => (activity), :text => "it is good.") }

      it 'should return json if found' do
        get(:show, :params => ({ :id => activity.id }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(200))
        expect(parsed_response["title"]).to(eq("First Activity"))
        expect(parsed_response["passages"].first["text"]).to(eq(("Hello" * 20)))
        expect(parsed_response["prompts"].first["text"]).to(eq("it is good."))
      end

      it 'should raise if not found (to be handled by parent app)' do
        expect { get(:show, :params => ({ :id => 99999 })) }.to(raise_error(ActiveRecord::RecordNotFound))
      end
    end

    context 'should update' do
      before do
        session[:user_id] = 1
      end

      let!(:activity) { create(:evidence_activity, :parent_activity_id => 1, :title => "First Activity", :target_level => 8, :scored_level => "4th grade") }
      let!(:passage) { create(:evidence_passage, :activity => (activity)) }
      let!(:prompt) { create(:evidence_prompt, :activity => (activity)) }

      it 'should update record if valid, return nothing' do
        put(:update, :params => ({ :id => activity.id, :activity => ({ :parent_activity_id => 2, :scored_level => "5th grade", :target_level => 9, :title => "New title" }) }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        activity.reload
        expect(activity.parent_activity_id).to(eq(2))
        expect(activity.scored_level).to(eq("5th grade"))
        expect(activity.target_level).to(eq(9))
        expect(activity.title).to(eq("New title"))
      end

      it "should make a change log record after updating Passage text" do
        old_text = passage.text
        put :update, params: {id: activity.id, activity: { passages_attributes: [{id: passage.id, text: ('Goodbye' * 20)}] }}

        change_log = Evidence.change_log_class.last
        expect(change_log.serializable_hash["full_action"]).to(eq("Evidence Passage Text - updated"))
        expect(change_log.user_id).to(eq(nil))
        expect(change_log.changed_record_type).to(eq("Evidence::Passage"))
        expect(change_log.changed_record_id).to(eq(passage.id))
        expect(change_log.previous_value).to(eq(old_text))
        expect(change_log.new_value).to(eq(('Goodbye' * 20)))
      end

      it "should make a change log record after creating Passage text" do
        new_activity = create(:evidence_activity)
        put :update, params: {id: activity.id, activity: { passages_attributes: [{text: ('Goodbye' * 20)}] }}

        change_log = Evidence.change_log_class.last
        expect(change_log.serializable_hash["full_action"]).to(eq("Evidence Passage Text - created"))
        expect(change_log.user_id).to(eq(nil))
        expect(change_log.changed_record_type).to(eq("Evidence::Passage"))
        expect(change_log.previous_value).to(eq(nil))
        expect(change_log.new_value).to(eq('Goodbye' * 20))
      end

      it 'should update passage if valid, return nothing' do
        put(:update, :params => ({ :id => activity.id, :activity => ({ :passages_attributes => ([{ :id => passage.id, :text => ("Goodbye" * 20) }]) }) }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        passage.reload
        expect(passage.text).to(eq(("Goodbye" * 20)))
      end

      it 'should update prompt if valid, return nothing' do
        put(:update, :params => ({ :id => activity.id, :activity => ({ :prompts_attributes => ([{ :id => prompt.id, :text => "this is a good thing." }]) }) }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        prompt.reload
        expect(prompt.text).to(eq("this is a good thing."))
      end

      it "should make a change log record after updating Prompt text" do
        old_text = prompt.text
        put :update, params: { id: activity.id, activity: { prompts_attributes: [{id: prompt.id, text: "this is a good thing."}] }}

        change_log = Evidence.change_log_class.last
        expect(change_log.serializable_hash["full_action"]).to(eq("Evidence Stem - updated"))
        expect(change_log.user_id).to(eq(nil))
        expect(change_log.changed_record_type).to(eq("Evidence::Prompt"))
        expect(change_log.changed_record_id).to(eq(prompt.id))
        expect(change_log.previous_value).to(eq(old_text))
        expect(change_log.new_value).to(eq("this is a good thing."))
      end

      it "should make a change log record after creating Prompt text through update call" do
        put :update, params: { id: activity.id, activity: { prompts_attributes: [{text: "this is a new prompt.", conjunction: "because"}] }}

        new_prompt = Evidence::Prompt.last
        change_log = Evidence.change_log_class.last
        expect(change_log.serializable_hash["full_action"]).to(eq("Evidence Stem - created"))
        expect(change_log.user_id).to(eq(nil))
        expect(change_log.changed_record_type).to(eq("Evidence::Prompt"))
        expect(change_log.changed_record_id).to(eq(new_prompt.id))
        expect(change_log.previous_value).to(eq(nil))
        expect(change_log.new_value).to(eq("this is a new prompt."))
      end

      it 'should not update record and return errors as json' do
        put(:update, :params => ({ :id => activity.id, :activity => ({ :parent_activity_id => 2, :scored_level => "5th grade", :target_level => 99999999, :title => "New title" }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["target_level"].include?("must be less than or equal to 12")).to(eq(true))
      end
    end

    context 'should destroy' do
      let!(:activity) { create(:evidence_activity) }
      let!(:passage) { create(:evidence_passage, :activity => (activity)) }

      it 'should destroy record at id' do
        delete(:destroy, :params => ({ :id => activity.id }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        expect(activity.id).to(be_truthy)
        expect(Activity.find_by_id(activity.id)).to(be_nil)
        expect(passage.id).to(be_truthy)
        expect(Passage.find_by_id(passage.id)).to(be_nil)
      end
    end

    context 'change_logs' do
      before do
        session[:user_id] = 1
      end

      let!(:activity) {build(:evidence_activity, parent_activity_id: 1, title: "First Activity", target_level: 8, scored_level: "4th grade", notes: "First Activity - Notes")}
      let!(:prompt) {build(:evidence_prompt)}
      let!(:passage) {build(:evidence_passage)}

      Evidence.parent_activity_classification_class.create(key: 'evidence')

      it "should return change logs for that activity" do
        post :create, params: {
          activity: {
            parent_activity_id: activity.parent_activity_id,
            scored_level: activity.scored_level,
            target_level: activity.target_level,
            title: activity.title,
            notes: activity.notes,
            passages_attributes: [{
              text: passage.text
            }],
            prompts_attributes: [{
              text: prompt.text,
              conjunction: prompt.conjunction,
              max_attempts: prompt.max_attempts,
              max_attempts_feedback: prompt.max_attempts_feedback
            }],
          }
        }

        activity = Evidence::Activity.last
        get :change_logs, params: {id: activity.id}
        parsed_response = JSON.parse(response.body)

        expect(response.code.to_i).to(eq(200))
        expect(parsed_response.select {|cl| cl["changed_record_type"] == 'Evidence::Passage'}.count).to(eq(1))
        expect(parsed_response.select {|cl| cl["changed_record_type"] == 'Evidence::Activity'}.count).to(eq(1))
        expect(parsed_response.select {|cl| cl["changed_record_type"] == 'Evidence::Prompt'}.count).to(eq(1))

      end

      it "should return empty array if no change logs exist" do
        activity = create(:evidence_activity)
        Evidence.change_log_class.destroy_all
        get :change_logs, params: { id: activity.id }
        parsed_response = JSON.parse(response.body)

        expect(response.code.to_i).to(eq(200))
        expect(parsed_response).to(eq([]))
      end
    end

    context 'should rules' do
      let!(:activity) { create(:evidence_activity) }
      let!(:prompt) { create(:evidence_prompt, :activity => (activity)) }
      let!(:rule) { create(:evidence_rule, :prompts => ([prompt])) }
      let!(:passage) { create(:evidence_passage, :activity => (activity)) }
      let!(:feedback1) { create(:evidence_feedback, rule: rule) }
      let!(:highlight1) { create(:evidence_highlight, feedback: feedback1, text: 'lorem') }

      it 'should return rules' do
        get(:rules, :params => ({ :id => activity.id }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(200))
        expect(rule.id).to(eq(parsed_response[0]["id"]))
      end

      it 'should return feedbacks and highlights associated with the rules' do
        get(:rules, :params => ({ :id => activity.id }))
        parsed_response = JSON.parse(response.body)

        expect(parsed_response.first['feedbacks'].count).to eq 1
        expect(parsed_response.first['feedbacks'].first['highlights'].first['text']).to eq 'lorem'
      end

      it 'should 404 if activity is invalid' do
        expect { get(:rules, :params => ({ :id => 99999 })) }.to(raise_error(ActiveRecord::RecordNotFound))
      end
    end
  end
end
