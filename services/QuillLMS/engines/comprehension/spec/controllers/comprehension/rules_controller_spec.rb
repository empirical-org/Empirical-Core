require("rails_helper")
module Comprehension
  RSpec.describe(RulesController, :type => :controller) do
    before { @routes = Engine.routes }
    context("index") do
      it("return successfully - no rule") do
        get(:index)
        parsed_response = JSON.parse(response.body)
        assert_response(:success)
        expect(parsed_response.class).to(eq(Array))
        expect(parsed_response.empty?).to(eq(true))
      end
      context("with rules") do
        before { @rule = create(:comprehension_rule) }
        it("return successfully") do
          get(:index)
          parsed_response = JSON.parse(response.body)
          assert_response(:success)
          expect(parsed_response.class).to(eq(Array))
          expect(parsed_response.empty?).to(eq(false))
          expect(parsed_response.first["uid"]).to(eq(@rule.uid))
          expect(parsed_response.first["name"]).to(eq(@rule.name))
          expect(parsed_response.first["note"]).to(eq(@rule.note))
          expect(parsed_response.first["universal"]).to(eq(@rule.universal))
          expect(parsed_response.first["rule_type"]).to(eq(@rule.rule_type))
          expect(parsed_response.first["optimal"]).to(eq(@rule.optimal))
          expect(parsed_response.first["suborder"]).to(eq(@rule.suborder))
          expect(parsed_response.first["concept_uid"]).to(eq(@rule.concept_uid))
          expect(parsed_response.first["display_name"]).to(eq(@rule.display_name))
        end
      end
      context("with filter params") do
        before do
          @prompt1 = create(:comprehension_prompt)
          @prompt2 = create(:comprehension_prompt)
          @rule1 = create(:comprehension_rule, :prompts => ([@prompt1]), :rule_type => (Rule::TYPE_AUTOML))
          @rule2 = create(:comprehension_rule, :prompts => ([@prompt1]), :rule_type => (Rule::TYPE_GRAMMAR))
          @rule3 = create(:comprehension_rule, :prompts => ([@prompt2]), :rule_type => (Rule::TYPE_AUTOML))
          @rule4 = create(:comprehension_rule, :prompts => ([@prompt2]), :rule_type => (Rule::TYPE_GRAMMAR))
          @rule5 = create(:comprehension_rule, :prompts => ([@prompt1, @prompt2]), :rule_type => (Rule::TYPE_REGEX_ONE))
        end
        it("only get Rules for specified prompt when provided") do
          get(:index, :params => ({ :prompt_id => @prompt1.id }))
          parsed_response = JSON.parse(response.body)
          expect(3).to(eq(parsed_response.length))
          parsed_response.each do |r|
            expect(r["prompt_ids"].include?(@prompt1.id)).to(eq(true))
          end
        end
        it("only get unique Rules for specified prompts when provided") do
          get(:index, :params => ({ :prompt_id => ("#{@prompt1.id}, #{@prompt2.id}") }))
          parsed_response = JSON.parse(response.body)
          expect(5).to(eq(parsed_response.length))
        end
        it("only get Rules for specified rule type when provided") do
          get(:index, :params => ({ :rule_type => (Rule::TYPE_AUTOML) }))
          parsed_response = JSON.parse(response.body)
          expect(2).to(eq(parsed_response.length))
          parsed_response.each { |r| expect(Rule::TYPE_AUTOML).to(eq(r["rule_type"])) }
        end
        it("only get Rules for the intersection of prompt and rule type when both are provided") do
          get(:index, :params => ({ :prompt_id => @prompt1.id, :rule_type => (Rule::TYPE_AUTOML) }))
          parsed_response = JSON.parse(response.body)
          expect(1).to(eq(parsed_response.length))
          expect(parsed_response[0]["prompt_ids"].include?(@prompt1.id)).to(eq(true))
          expect(Rule::TYPE_AUTOML).to(eq(parsed_response[0]["rule_type"]))
        end
      end
    end
    context("create") do
      before do
        @prompt = create(:comprehension_prompt)
        @rule = build(:comprehension_rule)
      end
      it("create a valid record and return it as json") do
        expect(Rule.count).to(eq(0))
        post(:create, :params => ({ :rule => ({ :concept_uid => @rule.concept_uid, :note => @rule.note, :name => @rule.name, :optimal => @rule.optimal, :state => @rule.state, :suborder => @rule.suborder, :rule_type => @rule.rule_type, :universal => @rule.universal, :prompt_ids => @rule.prompt_ids }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["name"]).to(eq(@rule.name))
        expect(parsed_response["note"]).to(eq(@rule.note))
        expect(parsed_response["universal"]).to(eq(@rule.universal))
        expect(parsed_response["rule_type"]).to(eq(@rule.rule_type))
        expect(parsed_response["optimal"]).to(eq(@rule.optimal))
        expect(parsed_response["state"]).to(eq(@rule.state))
        expect(parsed_response["suborder"]).to(eq(@rule.suborder))
        expect(parsed_response["concept_uid"]).to(eq(@rule.concept_uid))
        expect(parsed_response["prompt_ids"]).to(eq(@rule.prompt_ids))
        expect(Rule.count).to(eq(1))
      end
      it("not create an invalid record and return errors as json") do
        post(:create, :params => ({ :rule => ({ :concept_uid => @rule.uid, :note => @rule.note, :name => @rule.name, :optimal => @rule.optimal, :state => nil, :suborder => -1, :rule_type => @rule.rule_type, :universal => @rule.universal }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["suborder"].include?("must be greater than or equal to 0")).to(eq(true))
        expect(Rule.count).to(eq(0))
      end
      it("return an error if regex is invalid") do
        post(:create, :params => ({ :rule => ({ :concept_uid => @rule.uid, :note => @rule.note, :name => @rule.name, :optimal => @rule.optimal, :suborder => 1, :rule_type => @rule.rule_type, :universal => @rule.universal, :state => (Rule::STATE_INACTIVE), :regex_rules_attributes => ([{ :regex_text => "(invalid|", :case_sensitive => false }]) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["invalid_regex"][0].include?("end pattern with unmatched parenthesis")).to(eq(true))
      end
      it("create a valid record with plagiarism_text attributes") do
        plagiarism_text = "Here is some text to be checked for plagiarism."
        post(:create, :params => ({ :rule => ({ :concept_uid => @rule.concept_uid, :note => @rule.note, :name => @rule.name, :optimal => @rule.optimal, :state => @rule.state, :suborder => @rule.suborder, :rule_type => @rule.rule_type, :universal => @rule.universal, :plagiarism_text_attributes => ({ :text => plagiarism_text }) }) }))
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["name"]).to(eq(@rule.name))
        expect(parsed_response["plagiarism_text"]["text"]).to(eq(plagiarism_text))
      end
      it("return an error if plagiarism rule already exists for prompt") do
        plagiarism_rule = create(:comprehension_rule, :prompt_ids => ([@prompt.id]), :rule_type => (Rule::TYPE_PLAGIARISM))
        post(:create, :params => ({ :rule => ({ :concept_uid => @rule.uid, :note => @rule.note, :name => @rule.name, :optimal => @rule.optimal, :suborder => 1, :rule_type => (Rule::TYPE_PLAGIARISM), :universal => false, :state => (Rule::STATE_ACTIVE), :prompt_ids => ([@prompt.id]) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["prompts"][0].include?("prompt #{@prompt.id} already has a plagiarism rule")).to(eq(true))
      end
      it("create nested feedback record when present in params") do
        expect(Feedback.count).to(eq(0))
        feedback = build(:comprehension_feedback)
        post(:create, :params => ({ :rule => ({ :concept_uid => @rule.concept_uid, :note => @rule.note, :name => @rule.name, :optimal => @rule.optimal, :state => @rule.state, :suborder => @rule.suborder, :rule_type => @rule.rule_type, :universal => @rule.universal, :feedbacks_attributes => ([{ :text => feedback.text, :description => feedback.description, :order => feedback.order }]) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["feedbacks"][0]["text"]).to(eq(feedback.text))
        expect(parsed_response["feedbacks"][0]["description"]).to(eq(feedback.description))
        expect(parsed_response["feedbacks"][0]["order"]).to(eq(feedback.order))
        expect(Feedback.count).to(eq(1))
      end
      it("create nested highlight record when nested in feedback_attributes") do
        expect(Highlight.count).to(eq(0))
        feedback = create(:comprehension_feedback, :rule => (@rule))
        highlight = build(:comprehension_highlight, :starting_index => 2)
        post(:create, :params => ({ :rule => ({ :concept_uid => @rule.concept_uid, :note => @rule.note, :name => @rule.name, :optimal => @rule.optimal, :state => @rule.state, :suborder => @rule.suborder, :rule_type => @rule.rule_type, :universal => @rule.universal, :feedbacks_attributes => ([{ :text => feedback.text, :description => feedback.description, :order => feedback.order, :highlights_attributes => ([{ :text => highlight.text, :highlight_type => highlight.highlight_type, :starting_index => highlight.starting_index }]) }]) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["feedbacks"][0]["highlights"][0]["text"]).to(eq(highlight.text))
        expect(parsed_response["feedbacks"][0]["highlights"][0]["highlight_type"]).to(eq(highlight.highlight_type))
        expect(parsed_response["feedbacks"][0]["highlights"][0]["starting_index"]).to(eq(highlight.starting_index))
        expect(Highlight.count).to(eq(1))
      end
      it("create nested label record when present in params") do
        expect(Label.count).to(eq(0))
        label = build(:comprehension_label)
        post(:create, :params => ({ :rule => ({ :concept_uid => @rule.concept_uid, :note => @rule.note, :name => @rule.name, :optimal => @rule.optimal, :state => @rule.state, :suborder => @rule.suborder, :rule_type => @rule.rule_type, :universal => @rule.universal, :label_attributes => ({ :name => label.name }) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["label"]["name"]).to(eq(label.name))
        expect(Label.count).to(eq(1))
      end
      it("create nested regex rule record when present in params") do
        expect(RegexRule.count).to(eq(0))
        regex_rule = build(:comprehension_regex_rule)
        post(:create, :params => ({ :rule => ({ :concept_uid => @rule.concept_uid, :note => @rule.note, :name => @rule.name, :optimal => @rule.optimal, :state => @rule.state, :suborder => @rule.suborder, :rule_type => @rule.rule_type, :universal => @rule.universal, :regex_rules_attributes => ([{ :regex_text => regex_rule.regex_text, :case_sensitive => regex_rule.case_sensitive }]) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["regex_rules"][0]["regex_text"]).to(eq(regex_rule.regex_text))
        expect(parsed_response["regex_rules"][0]["case_sensitive"]).to(eq(regex_rule.case_sensitive))
        expect(RegexRule.count).to(eq(1))
      end
    end
    context("show") do
      before { @rule = create(:comprehension_rule) }
      it("return json if found by id") do
        get(:show, :params => ({ :id => @rule.id }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(200))
        expect(parsed_response["uid"]).to(eq(@rule.uid))
        expect(parsed_response["name"]).to(eq(@rule.name))
        expect(parsed_response["note"]).to(eq(@rule.note))
        expect(parsed_response["universal"]).to(eq(@rule.universal))
        expect(parsed_response["rule_type"]).to(eq(@rule.rule_type))
        expect(parsed_response["optimal"]).to(eq(@rule.optimal))
        expect(parsed_response["suborder"]).to(eq(@rule.suborder))
        expect(parsed_response["concept_uid"]).to(eq(@rule.concept_uid))
      end
      it("return json if found by uid") do
        get(:show, :params => ({ :id => @rule.uid }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(200))
        expect(parsed_response["uid"]).to(eq(@rule.uid))
        expect(parsed_response["name"]).to(eq(@rule.name))
        expect(parsed_response["note"]).to(eq(@rule.note))
        expect(parsed_response["universal"]).to(eq(@rule.universal))
        expect(parsed_response["rule_type"]).to(eq(@rule.rule_type))
        expect(parsed_response["optimal"]).to(eq(@rule.optimal))
        expect(parsed_response["suborder"]).to(eq(@rule.suborder))
        expect(parsed_response["concept_uid"]).to(eq(@rule.concept_uid))
      end
      it("raise if not found (to be handled by parent app)") do
        expect { get(:show, :params => ({ :id => 99999 })) }.to(raise_error(ActiveRecord::RecordNotFound))
      end
    end
    context("update") do
      before do
        @prompt = create(:comprehension_prompt)
        @rule = create(:comprehension_rule, :prompt_ids => ([@prompt.id]))
      end
      it("update record if valid, return nothing") do
        new_prompt = create(:comprehension_prompt)
        patch(:update, :params => ({ :id => @rule.id, :rule => ({ :concept_uid => @rule.concept_uid, :note => @rule.note, :name => @rule.name, :optimal => @rule.optimal, :state => @rule.state, :suborder => @rule.suborder, :rule_type => @rule.rule_type, :universal => @rule.universal, :prompt_ids => ([new_prompt.id]) }) }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        expect([new_prompt.id]).to(eq(@rule.reload.prompt_ids))
      end
      it("not update record and return errors as json") do
        patch(:update, :params => ({ :id => @rule.id, :rule => ({ :concept_uid => @rule.concept_uid, :note => @rule.note, :name => @rule.name, :optimal => @rule.optimal, :state => @rule.state, :suborder => -1, :rule_type => @rule.rule_type, :universal => @rule.universal }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["suborder"].include?("must be greater than or equal to 0")).to(eq(true))
      end
      it("update a valid record with plagiarism_text attributes") do
        plagiarism_text = "New plagiarism text"
        patch(:update, :params => ({ :id => @rule.id, :rule => ({ :plagiarism_text_attributes => ({ :text => plagiarism_text }) }) }))
        expect(plagiarism_text).to(eq(@rule.reload.plagiarism_text.text))
      end
      it("update nested feedback attributes if present") do
        feedback = create(:comprehension_feedback, :rule => (@rule))
        new_text = "new text for the feedbacks object"
        patch(:update, :params => ({ :id => @rule.id, :rule => ({ :feedbacks_attributes => ([{ :id => feedback.id, :text => new_text }]) }) }))
        expect(response.code.to_i).to(eq(204))
        expect(response.body).to(eq(""))
        feedback.reload
        expect(new_text).to(eq(feedback.text))
      end
      it("update nested highlight attributes in feedback if present") do
        feedback = create(:comprehension_feedback, :rule => (@rule))
        highlight = create(:comprehension_highlight, :feedback => feedback)
        new_text = "New text to highlight"
        post(:update, :params => ({ :id => @rule.id, :rule => ({ :feedbacks_attributes => ([{ :id => feedback.id, :highlights_attributes => ([{ :id => highlight.id, :text => new_text }]) }]) }) }))
        expect(response.code.to_i).to(eq(204))
        expect(response.body).to(eq(""))
        highlight.reload
        expect(highlight.text).to(eq(new_text))
      end
      it("not update read-only nested label name") do
        label = create(:comprehension_label, :rule => (@rule))
        new_name = "can not be updated"
        post(:update, :params => ({ :id => @rule.id, :rule => ({ :label_attributes => ({ :id => label.id, :name => new_name }) }) }))
        expect(response.code.to_i).to(eq(204))
        label.reload
        expect((label.name != new_name)).to(be_truthy)
      end
      it("update nested regex rule attributes if present") do
        regex_rule = create(:comprehension_regex_rule, :rule => (@rule))
        new_text = "new regex text"
        post(:update, :params => ({ :id => @rule.id, :rule => ({ :regex_rules_attributes => ([{ :id => regex_rule.id, :regex_text => new_text }]) }) }))
        expect(response.code.to_i).to(eq(204))
        expect(response.body).to(eq(""))
        regex_rule.reload
        expect(regex_rule.regex_text).to(eq(new_text))
      end
      it("return an error if regex is invalid") do
        regex_rule = create(:comprehension_regex_rule, :rule => (@rule))
        new_text = "(invalid|"
        post(:update, :params => ({ :id => @rule.id, :rule => ({ :regex_rules_attributes => ([{ :id => regex_rule.id, :regex_text => new_text }]) }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["invalid_regex"][0].include?("end pattern with unmatched parenthesis")).to(eq(true))
      end
    end
    context("destroy") do
      before { @rule = create(:comprehension_rule) }
      it("destroy record at id") do
        delete(:destroy, :params => ({ :id => @rule.id }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        expect(@rule.id).to(be_truthy)
        expect(Rule.find_by_id(@rule.id)).to(be_nil)
      end
    end
    context("update_rule_order") do
      before do
        @rule1 = create(:comprehension_rule, :suborder => 100)
        @rule2 = create(:comprehension_rule, :suborder => 12)
        @rule3 = create(:comprehension_rule, :suborder => 77)
      end
      it("update the rules to have the suborders in the order of their ids") do
        put(:update_rule_order, :params => ({ :ordered_rule_ids => ([@rule2.id, @rule3.id, @rule1.id]) }))
        expect(response.code.to_i).to(eq(200))
        expect(0).to(eq(@rule2.reload.suborder))
        expect(1).to(eq(@rule3.reload.suborder))
        expect(2).to(eq(@rule1.reload.suborder))
      end
      it("return an error if any of the updated rules are invalid") do
        put(:update_rule_order, :params => ({ :ordered_rule_ids => ([@rule2.id, nil, @rule1.id]) }))
        expect(response.code.to_i).to(eq(422))
      end
    end
  end
end
