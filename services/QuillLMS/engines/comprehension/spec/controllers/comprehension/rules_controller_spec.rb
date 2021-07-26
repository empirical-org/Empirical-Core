require 'rails_helper'

module Comprehension
  RSpec.describe(RulesController, :type => :controller) do
    before { @routes = Engine.routes }

    context 'should index' do

      it 'should return successfully - no rule' do
        get(:index)
        parsed_response = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(parsed_response.class).to(eq(Array))
        expect(parsed_response.empty?).to(eq(true))
      end

      context 'should with rules' do
        let!(:rule) { create(:comprehension_rule) }

        it 'should return successfully' do
          get(:index)
          parsed_response = JSON.parse(response.body)
          expect(response.status).to eq(200)
          expect(parsed_response.class).to(eq(Array))
          expect(parsed_response.empty?).to(eq(false))
          expect(parsed_response.first["uid"]).to(eq(rule.uid))
          expect(parsed_response.first["name"]).to(eq(rule.name))
          expect(parsed_response.first["note"]).to(eq(rule.note))
          expect(parsed_response.first["universal"]).to(eq(rule.universal))
          expect(parsed_response.first["rule_type"]).to(eq(rule.rule_type))
          expect(parsed_response.first["optimal"]).to(eq(rule.optimal))
          expect(parsed_response.first["suborder"]).to(eq(rule.suborder))
          expect(parsed_response.first["concept_uid"]).to(eq(rule.concept_uid))
          expect(parsed_response.first["display_name"]).to(eq(rule.display_name))
        end
      end

      context 'should with filter params' do
        let!(:prompt1) { create(:comprehension_prompt) }
        let!(:prompt2) { create(:comprehension_prompt) }
        let!(:rule1) { create(:comprehension_rule, :prompts => ([prompt1]), :rule_type => (Rule::TYPE_AUTOML)) }
        let!(:rule2) { create(:comprehension_rule, :prompts => ([prompt1]), :rule_type => (Rule::TYPE_GRAMMAR)) }
        let!(:rule3) { create(:comprehension_rule, :prompts => ([prompt2]), :rule_type => (Rule::TYPE_AUTOML)) }
        let!(:rule4) { create(:comprehension_rule, :prompts => ([prompt2]), :rule_type => (Rule::TYPE_GRAMMAR)) }
        let!(:rule5) { create(:comprehension_rule, :prompts => ([prompt1, prompt2]), :rule_type => (Rule::TYPE_REGEX_ONE)) }

        it 'should only get Rules for specified prompt when provided' do
          get(:index, :params => ({ :prompt_id => prompt1.id }))
          parsed_response = JSON.parse(response.body)
          expect(3).to(eq(parsed_response.length))
          parsed_response.each do |r|
            expect(r["prompt_ids"].include?(prompt1.id)).to(eq(true))
          end
        end

        it 'should only get unique Rules for specified prompts when provided' do
          get(:index, :params => ({ :prompt_id => ("#{prompt1.id}, #{prompt2.id}") }))
          parsed_response = JSON.parse(response.body)
          expect(5).to(eq(parsed_response.length))
        end

        it 'should only get Rules for specified rule type when provided' do
          get(:index, :params => ({ :rule_type => (Rule::TYPE_AUTOML) }))
          parsed_response = JSON.parse(response.body)
          expect(2).to(eq(parsed_response.length))
          parsed_response.each { |r| expect(Rule::TYPE_AUTOML).to(eq(r["rule_type"])) }
        end

        it 'should only get Rules for the intersection of prompt and rule type when both are provided' do
          get(:index, :params => ({ :prompt_id => prompt1.id, :rule_type => (Rule::TYPE_AUTOML) }))
          parsed_response = JSON.parse(response.body)
          expect(1).to(eq(parsed_response.length))
          expect(parsed_response[0]["prompt_ids"].include?(prompt1.id)).to(eq(true))
          expect(Rule::TYPE_AUTOML).to(eq(parsed_response[0]["rule_type"]))
        end
      end
    end

    context 'should create' do
      let!(:prompt) { create(:comprehension_prompt) }
      let!(:rule) { build(:comprehension_rule) }
      let!(:activity) { create(:comprehension_activity) }
      let!(:prompt) { create(:comprehension_prompt, activity: activity) }
      let!(:rule) { build(:comprehension_rule) }
      let!(:universal_rule) { build(:comprehension_rule, prompts: [prompt], universal: true, rule_type: Rule::TYPE_GRAMMAR) }
      let!(:plagiarism_rule) { build(:comprehension_rule, prompts: [prompt], universal: false, rule_type: Rule::TYPE_PLAGIARISM) }
      before do
        session[:user_id] = 1
      end

      it 'should create a valid record and return it as json' do
        expect(Rule.count).to(eq(0))
        post(:create, :params => ({ :rule => ({ :concept_uid => rule.concept_uid, :note => rule.note, :name => rule.name, :optimal => rule.optimal, :state => rule.state, :suborder => rule.suborder, :rule_type => rule.rule_type, :universal => rule.universal, :prompt_ids => rule.prompt_ids }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["name"]).to(eq(rule.name))
        expect(parsed_response["note"]).to(eq(rule.note))
        expect(parsed_response["universal"]).to(eq(rule.universal))
        expect(parsed_response["rule_type"]).to(eq(rule.rule_type))
        expect(parsed_response["optimal"]).to(eq(rule.optimal))
        expect(parsed_response["state"]).to(eq(rule.state))
        expect(parsed_response["suborder"]).to(eq(rule.suborder))
        expect(parsed_response["concept_uid"]).to(eq(rule.concept_uid))
        expect(parsed_response["prompt_ids"]).to(eq(rule.prompt_ids))
        expect(Rule.count).to(eq(1))
      end

      it "make a change log record after creating a regex Rule record" do
        post :create, params: {rule: { concept_uid: rule.concept_uid, note: rule.note, name: rule.name, optimal: rule.optimal, state: rule.state, suborder: rule.suborder, rule_type: rule.rule_type, universal: rule.universal, prompt_ids: [prompt.id] }}

        change_log = Comprehension.change_log_class.last
        new_rule = Comprehension::Rule.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Regex Rule - created"
        assert_equal change_log.user_id, 1
        assert_equal change_log.changed_record_id, new_rule.id
        assert_equal change_log.changed_record_type, "Comprehension::Rule"
        assert_equal change_log.previous_value, nil
        assert_equal change_log.new_value, nil
        assert_equal change_log.serializable_hash["comprehension_url"], "comprehension/#/activities/#{activity.id}/regex-rules/#{new_rule.id}"
      end

      it "make a change log record after creating a universal Rule record" do
        post :create, params: {rule: { concept_uid: universal_rule.concept_uid, note: universal_rule.note, name: universal_rule.name, optimal: universal_rule.optimal, state: universal_rule.state, suborder: universal_rule.suborder, rule_type: universal_rule.rule_type, universal: universal_rule.universal, prompt_ids: [prompt.id] }}

        new_rule = Comprehension::Rule.last
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Universal Rule - created"
        assert_equal change_log.user_id, 1
        assert_equal change_log.changed_record_id, new_rule.id
        assert_equal change_log.changed_record_type, "Comprehension::Rule"
        assert_equal change_log.previous_value, nil
        assert_equal change_log.new_value, nil
        assert_equal change_log.serializable_hash["comprehension_url"], "comprehension/#/universal-rules/#{new_rule.id}"
      end

      it "make a change log record after creating a plagiarism Rule record" do
        plagiarism_text = "Here is some text to be checked for plagiarism."
        feedback = build(:comprehension_feedback)
        post :create, params: {
          rule: {
            concept_uid: plagiarism_rule.concept_uid,
            note: plagiarism_rule.note,
            name: plagiarism_rule.name,
            optimal: plagiarism_rule.optimal,
            state: plagiarism_rule.state,
            suborder: plagiarism_rule.suborder,
            rule_type: plagiarism_rule.rule_type,
            universal: plagiarism_rule.universal,
            prompt_ids: [prompt.id],
            plagiarism_text_attributes: {
              text: plagiarism_text
            },
            feedbacks_attributes:
            [
              {
                text: feedback.text,
                description: feedback.description,
                order: feedback.order
              }
            ]
          }
        }

        new_rule = Comprehension::Rule.last
        change_log = Comprehension.change_log_class.find_by(changed_record_id: new_rule.id)
        assert_equal change_log.serializable_hash["comprehension_action"], "Plagiarism Rule - created"
        assert_equal change_log.user_id, 1
        assert_equal change_log.changed_record_id, new_rule.id
        assert_equal change_log.changed_record_type, "Comprehension::Rule"
        assert_equal change_log.previous_value, nil
        assert_equal change_log.new_value, nil
        assert_equal change_log.serializable_hash["comprehension_url"], "comprehension/#/activities/#{activity.id}/plagiarism-rules/#{new_rule.id}"
      end

      it 'should not create an invalid record and return errors as json' do
        post(:create, :params => ({ :rule => ({ :concept_uid => rule.uid, :note => rule.note, :name => rule.name, :optimal => rule.optimal, :state => nil, :suborder => -1, :rule_type => rule.rule_type, :universal => rule.universal }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["suborder"].include?("must be greater than or equal to 0")).to(eq(true))
        expect(Rule.count).to(eq(0))
      end

      it "make a change log record when nested label is created" do
        assert_equal 0, Label.count

        rule.rule_type = 'autoML'
        rule.prompt_ids = [prompt.id]
        rule.save
        label = build(:comprehension_label)
        post :create, params: {
          rule: {
            concept_uid: rule.concept_uid,
            note: rule.note,
            name: rule.name,
            optimal: rule.optimal,
            state: rule.state,
            suborder: rule.suborder,
            rule_type: rule.rule_type,
            universal: rule.universal,
            prompt_ids: rule.prompt_ids,
            label_attributes: {
              name: label.name
            }
          }
        }

        change_log = Comprehension.change_log_class.last
        new_rule = Comprehension::Rule.last
        label = Comprehension::Label.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Semantic Label - created"
        assert_equal change_log.user_id, 1
        assert_equal change_log.changed_record_id, new_rule.id
        assert_equal change_log.changed_record_type, "Comprehension::Rule"
        assert_equal change_log.new_value, nil
        assert_equal change_log.previous_value, nil
        assert_equal change_log.serializable_hash["comprehension_url"], "comprehension/#/activities/#{activity.id}/semantic-labels/#{prompt.id}/#{new_rule.id}"
      end

      it 'should return an error if regex is invalid' do
        post(:create, :params => ({ :rule => ({ :concept_uid => rule.uid, :note => rule.note, :name => rule.name, :optimal => rule.optimal, :suborder => 1, :rule_type => rule.rule_type, :universal => rule.universal, :state => (Rule::STATE_INACTIVE), :regex_rules_attributes => ([{ :regex_text => "(invalid|", :case_sensitive => false }]) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["invalid_regex"][0].include?("end pattern with unmatched parenthesis")).to(eq(true))
      end

      it 'should create a valid record with plagiarism_text attributes' do
        plagiarism_text = "Here is some text to be checked for plagiarism."
        post(:create, :params => ({ :rule => ({ :concept_uid => rule.concept_uid, :note => rule.note, :name => rule.name, :optimal => rule.optimal, :state => rule.state, :suborder => rule.suborder, :rule_type => rule.rule_type, :universal => rule.universal, :plagiarism_text_attributes => ({ :text => plagiarism_text }) }) }))
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["name"]).to(eq(rule.name))
        expect(parsed_response["plagiarism_text"]["text"]).to(eq(plagiarism_text))
      end

      it 'should return an error if plagiarism rule already exists for prompt' do
        plagiarism_rule = create(:comprehension_rule, :prompt_ids => ([prompt.id]), :rule_type => (Rule::TYPE_PLAGIARISM))
        post(:create, :params => ({ :rule => ({ :concept_uid => rule.uid, :note => rule.note, :name => rule.name, :optimal => rule.optimal, :suborder => 1, :rule_type => (Rule::TYPE_PLAGIARISM), :universal => false, :state => (Rule::STATE_ACTIVE), :prompt_ids => ([prompt.id]) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["prompts"][0].include?("prompt #{prompt.id} already has a plagiarism rule")).to(eq(true))
      end

      it 'should create nested feedback record when present in params' do
        expect(Feedback.count).to(eq(0))
        feedback = build(:comprehension_feedback)
        post(:create, :params => ({ :rule => ({ :concept_uid => rule.concept_uid, :note => rule.note, :name => rule.name, :optimal => rule.optimal, :state => rule.state, :suborder => rule.suborder, :rule_type => rule.rule_type, :universal => rule.universal, :feedbacks_attributes => ([{ :text => feedback.text, :description => feedback.description, :order => feedback.order }]) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["feedbacks"][0]["text"]).to(eq(feedback.text))
        expect(parsed_response["feedbacks"][0]["description"]).to(eq(feedback.description))
        expect(parsed_response["feedbacks"][0]["order"]).to(eq(feedback.order))
        expect(Feedback.count).to(eq(1))
      end

      it 'should create nested highlight record when nested in feedback_attributes' do
        expect(Highlight.count).to(eq(0))
        feedback = create(:comprehension_feedback, :rule => (rule))
        highlight = build(:comprehension_highlight, :starting_index => 2)
        post(:create, :params => ({ :rule => ({ :concept_uid => rule.concept_uid, :note => rule.note, :name => rule.name, :optimal => rule.optimal, :state => rule.state, :suborder => rule.suborder, :rule_type => rule.rule_type, :universal => rule.universal, :feedbacks_attributes => ([{ :text => feedback.text, :description => feedback.description, :order => feedback.order, :highlights_attributes => ([{ :text => highlight.text, :highlight_type => highlight.highlight_type, :starting_index => highlight.starting_index }]) }]) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["feedbacks"][0]["highlights"][0]["text"]).to(eq(highlight.text))
        expect(parsed_response["feedbacks"][0]["highlights"][0]["highlight_type"]).to(eq(highlight.highlight_type))
        expect(parsed_response["feedbacks"][0]["highlights"][0]["starting_index"]).to(eq(highlight.starting_index))
        expect(Highlight.count).to(eq(1))
      end

      it 'should create nested label record when present in params' do
        expect(Label.count).to(eq(0))
        label = build(:comprehension_label)
        post(:create, :params => ({ :rule => ({ :concept_uid => rule.concept_uid, :note => rule.note, :name => rule.name, :optimal => rule.optimal, :state => rule.state, :suborder => rule.suborder, :rule_type => rule.rule_type, :universal => rule.universal, :label_attributes => ({ :name => label.name }) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["label"]["name"]).to(eq(label.name))
        expect(Label.count).to(eq(1))
      end

      it 'should create nested regex rule record when present in params' do
        expect(RegexRule.count).to(eq(0))
        regex_rule = build(:comprehension_regex_rule)
        post(:create, :params => ({ :rule => ({ :concept_uid => rule.concept_uid, :note => rule.note, :name => rule.name, :optimal => rule.optimal, :state => rule.state, :suborder => rule.suborder, :rule_type => rule.rule_type, :universal => rule.universal, :regex_rules_attributes => ([{ :regex_text => regex_rule.regex_text, :case_sensitive => regex_rule.case_sensitive }]) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["regex_rules"][0]["regex_text"]).to(eq(regex_rule.regex_text))
        expect(parsed_response["regex_rules"][0]["case_sensitive"]).to(eq(regex_rule.case_sensitive))
        expect(RegexRule.count).to(eq(1))
      end
    end

    context 'should show' do
      let!(:rule) { create(:comprehension_rule) }

      it 'should return json if found by id' do
        get(:show, :params => ({ :id => rule.id }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(200))
        expect(parsed_response["uid"]).to(eq(rule.uid))
        expect(parsed_response["name"]).to(eq(rule.name))
        expect(parsed_response["note"]).to(eq(rule.note))
        expect(parsed_response["universal"]).to(eq(rule.universal))
        expect(parsed_response["rule_type"]).to(eq(rule.rule_type))
        expect(parsed_response["optimal"]).to(eq(rule.optimal))
        expect(parsed_response["suborder"]).to(eq(rule.suborder))
        expect(parsed_response["concept_uid"]).to(eq(rule.concept_uid))
      end

      it 'should return json if found by uid' do
        get(:show, :params => ({ :id => rule.uid }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(200))
        expect(parsed_response["uid"]).to(eq(rule.uid))
        expect(parsed_response["name"]).to(eq(rule.name))
        expect(parsed_response["note"]).to(eq(rule.note))
        expect(parsed_response["universal"]).to(eq(rule.universal))
        expect(parsed_response["rule_type"]).to(eq(rule.rule_type))
        expect(parsed_response["optimal"]).to(eq(rule.optimal))
        expect(parsed_response["suborder"]).to(eq(rule.suborder))
        expect(parsed_response["concept_uid"]).to(eq(rule.concept_uid))
      end

      it 'should raise if not found (to be handled by parent app)' do
        expect { get(:show, :params => ({ :id => 99999 })) }.to(raise_error(ActiveRecord::RecordNotFound))
      end
    end

    context 'should update' do
      let!(:prompt) { create(:comprehension_prompt) }
      let!(:rule) { create(:comprehension_rule, :prompt_ids => ([prompt.id])) }
      before do
        session[:user_id] = 1
      end

      it 'should update record if valid, return nothing' do
        new_prompt = create(:comprehension_prompt)
        patch(:update, :params => ({ :id => rule.id, :rule => ({ :concept_uid => rule.concept_uid, :note => rule.note, :name => rule.name, :optimal => rule.optimal, :state => rule.state, :suborder => rule.suborder, :rule_type => rule.rule_type, :universal => rule.universal, :prompt_ids => ([new_prompt.id]) }) }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        expect([new_prompt.id]).to(eq(rule.reload.prompt_ids))
      end

      it "create a change log record after updating a universal rule" do
        universal_rule = create(:comprehension_rule, prompt_ids: [prompt.id], universal: true, rule_type: 'spelling')
        old_name = universal_rule.name
        new_name = "new rule name"
        put :update, :params => { :id=> universal_rule.id, :rule => { concept_uid: universal_rule.concept_uid, note: universal_rule.note, name: new_name }}

        universal_rule.reload
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Universal Rule - updated"
        assert_equal change_log.user_id, 1
        assert_equal change_log.changed_record_id, universal_rule.id
        assert_equal change_log.changed_record_type, "Comprehension::Rule"
        assert_equal change_log.changed_attribute, "name"
        assert_equal change_log.new_value, new_name
        assert_equal change_log.previous_value, old_name
      end

      it "create a change log record after updating a plagiarism rule" do
        plagiarism_rule = create(:comprehension_rule, prompt_ids: [prompt.id], rule_type: 'plagiarism', state: 'inactive')
        plagiarized_text = create(:comprehension_plagiarism_text, rule: plagiarism_rule)
        feedback = create(:comprehension_feedback, rule: plagiarism_rule)
        old_name = plagiarism_rule.name
        old_state = plagiarism_rule.state
        new_name = "new rule name"
        new_state = "active"
        patch :update, :params => { :id => plagiarism_rule.id, :rule => { concept_uid: plagiarism_rule.concept_uid, name: new_name, state: new_state } }

        plagiarism_rule.reload
        change_log = Comprehension.change_log_class.find_by(changed_attribute: 'state')
        assert_equal change_log.serializable_hash["comprehension_action"], "Plagiarism Rule - updated"
        assert_equal change_log.user_id, 1
        assert_equal change_log.changed_record_id, plagiarism_rule.id
        assert_equal change_log.changed_record_type, "Comprehension::Rule"
        assert_equal change_log.changed_attribute, "state"
        assert_equal change_log.new_value, new_state
        assert_equal change_log.previous_value, old_state
      end

      it "create a change log record after updating a regex rule" do
        regex_rule = create(:comprehension_rule, prompt_ids: [prompt.id], rule_type: 'rules-based-1')
        old_name = regex_rule.name
        new_name = "new rule name"
        patch :update, params: {id: regex_rule.id, rule: { concept_uid: regex_rule.concept_uid, name: new_name, state: regex_rule.state }}

        regex_rule.reload
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Regex Rule - updated"
        assert_equal change_log.user_id, 1
        assert_equal change_log.changed_record_id, regex_rule.id
        assert_equal change_log.changed_record_type, "Comprehension::Rule"
        assert_equal change_log.changed_attribute, "name"
        assert_equal change_log.new_value, new_name
        assert_equal change_log.previous_value, old_name
      end

      it 'should not update record and return errors as json' do
        patch(:update, :params => ({ :id => rule.id, :rule => ({ :concept_uid => rule.concept_uid, :note => rule.note, :name => rule.name, :optimal => rule.optimal, :state => rule.state, :suborder => -1, :rule_type => rule.rule_type, :universal => rule.universal }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["suborder"].include?("must be greater than or equal to 0")).to(eq(true))
      end

      it "make a change log record after creating new plagiarism text through update call" do
        plagiarism_text = "New plagiarism text"
        rule.update(rule_type: 'plagiarism')
        patch :update, params: {id: rule.id, rule: { plagiarism_text_attributes: {text: plagiarism_text}}}

        rule.reload
        plagiarism_text_obj = Comprehension::PlagiarismText.last
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Plagiarism Rule Text - created"
        assert_equal change_log.user_id, nil
        assert_equal change_log.changed_record_id, plagiarism_text_obj.id
        assert_equal change_log.changed_record_type, "Comprehension::PlagiarismText"
        assert_equal change_log.new_value, plagiarism_text
        assert_equal change_log.previous_value, nil
      end

      it "make a change log record after updating nested plagiarism rule feedback" do
        rule.update(rule_type: 'plagiarism')
        feedback = create(:comprehension_feedback, rule: rule)
        new_text = "new feedback"
        old_text = feedback.text

        post :update, params: {id: rule.id, rule: { feedbacks_attributes: [{id: feedback.id, text: new_text}]}}

        feedback = Comprehension::Feedback.last
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Plagiarism Rule Feedback - updated"
        assert_equal change_log.user_id, nil
        assert_equal change_log.changed_record_id, feedback.id
        assert_equal change_log.changed_record_type, "Comprehension::Feedback"
        assert_equal change_log.new_value, new_text
        assert_equal change_log.previous_value, old_text
      end

      it "make a change log record after updating nested plagiarism rule highlights" do
        rule.update(rule_type: 'plagiarism')
        feedback = create(:comprehension_feedback, rule: rule)
        highlight = create(:comprehension_highlight, feedback: feedback)
        new_text = "new highlight"
        old_text = highlight.text

        post :update, params: {id: rule.id, rule: { feedbacks_attributes: [{id: feedback.id, highlights_attributes: {id: highlight.id, text: new_text}}]}}

        highlight = Comprehension::Highlight.last
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Plagiarism Rule Highlight - updated"
        assert_equal change_log.user_id, nil
        assert_equal change_log.changed_record_id, highlight.id
        assert_equal change_log.changed_record_type, "Comprehension::Highlight"
        assert_equal change_log.new_value, new_text
        assert_equal change_log.previous_value, old_text
      end

      it 'should update a valid record with plagiarism_text attributes' do
        plagiarism_text = "New plagiarism text"
        patch(:update, :params => ({ :id => rule.id, :rule => ({ :plagiarism_text_attributes => ({ :text => plagiarism_text }) }) }))
        expect(plagiarism_text).to(eq(rule.reload.plagiarism_text.text))
      end

      it 'should update nested feedback attributes if present' do
        feedback = create(:comprehension_feedback, :rule => (rule))
        new_text = "new text for the feedbacks object"
        patch(:update, :params => ({ :id => rule.id, :rule => ({ :feedbacks_attributes => ([{ :id => feedback.id, :text => new_text }]) }) }))
        expect(response.code.to_i).to(eq(204))
        expect(response.body).to(eq(""))
        feedback.reload
        expect(new_text).to(eq(feedback.text))
      end

      it 'make a change log record after updating feedback text for a semantic first order rule' do
        automl_rule = create(:comprehension_rule, rule_type: 'autoML', prompt_ids: [prompt.id])
        label = create(:comprehension_label, rule: automl_rule)
        feedback = create(:comprehension_feedback, order: 0, rule: automl_rule)
        old_text = feedback.text
        new_text = 'new test feedback text is some new test feedback'
        post :update, params: {id: automl_rule.id, rule: { feedbacks_attributes: [{id: feedback.id, text: new_text}]}}

        automl_rule.reload
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Semantic Label First Layer Feedback - updated"
        assert_equal change_log.user_id, nil
        assert_equal change_log.changed_record_id, feedback.id
        assert_equal change_log.changed_record_type, "Comprehension::Feedback"
        assert_equal change_log.new_value, new_text
        assert_equal change_log.previous_value, old_text
      end

      it 'make a change log record after updating feedback text for a semantic second order rule' do
        automl_rule = create(:comprehension_rule, rule_type: 'autoML', prompt_ids: [prompt.id])
        label = create(:comprehension_label, rule: automl_rule)
        feedback = create(:comprehension_feedback, order: 1, rule: automl_rule)
        old_text = feedback.text
        new_text = 'new test feedback text is some new test feedback'
        post :update, params: {id: automl_rule.id, rule: { feedbacks_attributes: [{id: feedback.id, text: new_text}]}}

        automl_rule.reload
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Semantic Label Second Layer Feedback - updated"
        assert_equal change_log.user_id, nil
        assert_equal change_log.changed_record_id, feedback.id
        assert_equal change_log.changed_record_type, "Comprehension::Feedback"
        assert_equal change_log.new_value, new_text
        assert_equal change_log.previous_value, old_text
      end

      it 'should update nested highlight attributes in feedback if present' do
        feedback = create(:comprehension_feedback, :rule => (rule))
        highlight = create(:comprehension_highlight, :feedback => feedback)
        new_text = "New text to highlight"
        post(:update, :params => ({ :id => rule.id, :rule => ({ :feedbacks_attributes => ([{ :id => feedback.id, :highlights_attributes => ([{ :id => highlight.id, :text => new_text }]) }]) }) }))
        expect(response.code.to_i).to(eq(204))
        expect(response.body).to(eq(""))
        highlight.reload
        expect(highlight.text).to(eq(new_text))
      end

      it 'make a change log record after updating highlight text for a semantic first order rule' do
        automl_rule = create(:comprehension_rule, rule_type: 'autoML', prompt_ids: [prompt.id])
        label = create(:comprehension_label, rule: automl_rule)
        feedback = create(:comprehension_feedback, order: 0, rule: automl_rule)
        highlight = create(:comprehension_highlight, feedback: feedback)
        old_text = highlight.text
        new_text = "New text to highlight"

        post :update, params: {id: automl_rule.id, rule: { feedbacks_attributes: [{id: feedback.id, highlights_attributes: [{id: highlight.id, text: new_text}]}]}}

        automl_rule.reload
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Semantic Label First Layer Feedback Highlight - updated"
        assert_equal change_log.user_id, nil
        assert_equal change_log.changed_record_id, highlight.id
        assert_equal change_log.changed_record_type, "Comprehension::Highlight"
        assert_equal change_log.new_value, new_text
        assert_equal change_log.previous_value, old_text
      end

      it 'make a change log record after updating highlight text for a semantic second order rule' do
        automl_rule = create(:comprehension_rule, rule_type: 'autoML', prompt_ids: [prompt.id])
        label = create(:comprehension_label, rule: automl_rule)
        feedback = create(:comprehension_feedback, order: 1, rule: automl_rule)
        highlight = create(:comprehension_highlight, feedback: feedback)
        old_text = highlight.text
        new_text = "New text to highlight"

        post :update, params: {id: automl_rule.id, rule: { feedbacks_attributes: [{id: feedback.id, highlights_attributes: [{id: highlight.id, text: new_text}]}]}}

        automl_rule.reload
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Semantic Label Second Layer Feedback Highlight - updated"
        assert_equal change_log.user_id, nil
        assert_equal change_log.changed_record_id, highlight.id
        assert_equal change_log.changed_record_type, "Comprehension::Highlight"
        assert_equal change_log.new_value, new_text
        assert_equal change_log.previous_value, old_text
      end

      it 'should not update read-only nested label name' do
        label = create(:comprehension_label, :rule => (rule))
        new_name = "can not be updated"
        post(:update, :params => ({ :id => rule.id, :rule => ({ :label_attributes => ({ :id => label.id, :name => new_name }) }) }))
        expect(response.code.to_i).to(eq(204))
        label.reload
        expect((label.name != new_name)).to(be_truthy)
      end

      it "make a change log record after updating nested regex rule text" do
        regex_rule = create(:comprehension_regex_rule, rule: rule)
        new_text = "new regex text"
        old_text = regex_rule.regex_text

        post :update, params: {id: rule.id, rule: { regex_rules_attributes: [{id: regex_rule.id, regex_text: new_text}]}}

        regex_rule = Comprehension::RegexRule.last
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Regex Rule Regex - updated"
        assert_equal change_log.user_id, nil
        assert_equal change_log.changed_record_id, regex_rule.id
        assert_equal change_log.changed_record_type, "Comprehension::RegexRule"
        assert_equal change_log.new_value, new_text
        assert_equal change_log.previous_value, old_text
      end

      it "make a change log record after updating nested regex rule feedback" do
        feedback = create(:comprehension_feedback, rule: rule)
        new_text = "new feedback"
        old_text = feedback.text

        post :update, params: {id: rule.id, rule: { feedbacks_attributes: [{id: feedback.id, text: new_text}]}}

        feedback = Comprehension::Feedback.last
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Regex Rule Feedback - updated"
        assert_equal change_log.user_id, nil
        assert_equal change_log.changed_record_id, feedback.id
        assert_equal change_log.changed_record_type, "Comprehension::Feedback"
        assert_equal change_log.new_value, new_text
        assert_equal change_log.previous_value, old_text
      end

      it "make a change log record after updating nested regex rule highlights" do
        feedback = create(:comprehension_feedback, rule: rule)
        highlight = create(:comprehension_highlight, feedback: feedback)
        new_text = "new highlight"
        old_text = highlight.text

        post :update, params: {id: rule.id, rule: { feedbacks_attributes: [{id: feedback.id, highlights_attributes: {id: highlight.id, text: new_text}}]}}

        highlight = Comprehension::Highlight.last
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Regex Rule Highlight - updated"
        assert_equal change_log.user_id, nil
        assert_equal change_log.changed_record_id, highlight.id
        assert_equal change_log.changed_record_type, "Comprehension::Highlight"
        assert_equal change_log.new_value, new_text
        assert_equal change_log.previous_value, old_text
      end

      it "make a change log record after creating a nested regex rule through update call" do
        new_text = "new regex text"

        post :update, params: {id: rule.id, rule: { regex_rules_attributes: [{regex_text: new_text}]}}

        regex_rule = Comprehension::RegexRule.last
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Regex Rule Regex - updated"
        assert_equal change_log.user_id, nil
        assert_equal change_log.changed_record_id, regex_rule.id
        assert_equal change_log.changed_record_type, "Comprehension::RegexRule"
        assert_equal change_log.new_value, new_text
        assert_equal change_log.previous_value, nil
      end

      it 'should update nested regex rule attributes if present' do
        regex_rule = create(:comprehension_regex_rule, :rule => (rule))
        new_text = "new regex text"
        post(:update, :params => ({ :id => rule.id, :rule => ({ :regex_rules_attributes => ([{ :id => regex_rule.id, :regex_text => new_text }]) }) }))
        expect(response.code.to_i).to(eq(204))
        expect(response.body).to(eq(""))
        regex_rule.reload
        expect(regex_rule.regex_text).to(eq(new_text))
      end

      it 'should return an error if regex is invalid' do
        regex_rule = create(:comprehension_regex_rule, :rule => (rule))
        new_text = "(invalid|"
        post(:update, :params => ({ :id => rule.id, :rule => ({ :regex_rules_attributes => ([{ :id => regex_rule.id, :regex_text => new_text }]) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["invalid_regex"][0].include?("end pattern with unmatched parenthesis")).to(eq(true))
      end

      it 'make a change log record after updating the name of an autoML rule' do
        automl_rule = create(:comprehension_rule, rule_type: 'autoML', prompt_ids: [prompt.id])
        label = create(:comprehension_label, rule_id: automl_rule.id)
        old_name = automl_rule.name
        new_name = 'new name'

        put :update, params: {id: automl_rule.id, rule: { name: 'new name'}}

        automl_rule.reload
        change_log = Comprehension.change_log_class.last
        assert_equal change_log.serializable_hash["comprehension_action"], "Semantic Label - updated"
        assert_equal change_log.user_id, 1
        assert_equal change_log.changed_record_id, automl_rule.id
        assert_equal change_log.changed_record_type, "Comprehension::Rule"
        assert_equal change_log.new_value, new_name
        assert_equal change_log.previous_value, old_name
      end
    end

    context 'should destroy' do
      let!(:rule) { create(:comprehension_rule) }

      it 'should destroy record at id' do
        delete(:destroy, :params => ({ :id => rule.id }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        expect(rule.id).to(be_truthy)
        expect(Rule.find_by_id(rule.id)).to(be_nil)
      end
    end

    context 'should update_rule_order' do
      let!(:rule1) { create(:comprehension_rule, :suborder => 100) }
      let!(:rule2) { create(:comprehension_rule, :suborder => 12) }
      let!(:rule3) { create(:comprehension_rule, :suborder => 77) }

      it 'should update the rules to have the suborders in the order of their ids' do
        put(:update_rule_order, :params => ({ :ordered_rule_ids => ([rule2.id, rule3.id, rule1.id]) }))
        expect(response.code.to_i).to(eq(200))
        expect(0).to(eq(rule2.reload.suborder))
        expect(1).to(eq(rule3.reload.suborder))
        expect(2).to(eq(rule1.reload.suborder))
      end

      it 'should return an error if any of the updated rules are invalid' do
        put(:update_rule_order, :params => ({ :ordered_rule_ids => ([rule2.id, nil, rule1.id]) }))
        expect(response.code.to_i).to(eq(422))
      end
    end
  end
end
