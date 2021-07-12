require("rails_helper")

module Comprehension
  RSpec.describe(ActivitiesController, :type => :controller) do

    before { @routes = Engine.routes }

    context("index") do
      it("return successfully - no activities") do
        get :index

        parsed_response = JSON.parse(response.body)
        assert_response(:success)
        expect(parsed_response.class).to(eq(Array))
        expect(parsed_response.empty?).to(eq(true))
      end

      context("with activities where one has an archived parent") do
        before do
          @archived_activity = Comprehension.parent_activity_class.create(:name => "Archived Activity", :flags => (["archived"]))
          @unarchived_activity = Comprehension.parent_activity_class.create(:name => "Unarchived Activity")
          create(:comprehension_activity, :parent_activity_id => @archived_activity.id, :title => "First Activity", :target_level => 8)
          create(:comprehension_activity, :parent_activity_id => @unarchived_activity.id, :title => "Second Activity", :target_level => 5)
        end

        it("return with only the unarchived activity") do
          get :index

          parsed_response = JSON.parse(response.body)
          assert_response(:success)
          expect(parsed_response.class).to(eq(Array))
          expect(parsed_response.empty?).to(eq(false))
          expect(1).to(eq(parsed_response.length))
          expect(parsed_response.first["title"]).to(eq("Second Activity"))
          expect(parsed_response.first["target_level"]).to(eq(5))
          expect(parsed_response.first["parent_activity_id"]).to(eq(@unarchived_activity.id))
        end
      end
      context("with actitivites") do
        before do
          @first_activity = create(:comprehension_activity, title: "First Activity", notes: "Notes 1", target_level: 8)
          create(:comprehension_activity, :title => "Second Activity", :notes => "Notes 2", :target_level => 5)
        end

        it("return successfully") do
          get :index

          parsed_response = JSON.parse(response.body)
          assert_response(:success)
          expect(parsed_response.class).to(eq(Array))
          expect(parsed_response.empty?).to(eq(false))
          expect(parsed_response.first["title"]).to(eq("First Activity"))
          expect(parsed_response.first["target_level"]).to(eq(8))
          expect(parsed_response.first["parent_activity_id"]).to(eq(@first_activity.parent_activity.id))
        end
      end
    end

    context("create") do
      before do
        @activity = build(:comprehension_activity, :parent_activity_id => 1, :title => "First Activity", :target_level => 8, :scored_level => "4th grade", :notes => "First Activity - Notes")
        Comprehension.parent_activity_classification_class.create(:key => "comprehension")
      end

      it("create a valid record and return it as json") do
        post :create, params: {:activity => { :parent_activity_id => @activity.parent_activity_id, :scored_level => @activity.scored_level, :target_level => @activity.target_level, :title => @activity.title, :notes => @activity.notes }}

        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["title"]).to(eq("First Activity"))
        expect(parsed_response["notes"]).to(eq("First Activity - Notes"))
        expect(Activity.count).to(eq(1))
      end

      it("not create an invalid record and return errors as json") do
        post :create, params: {:activity => { :parent_activity_id => @activity.parent_activity_id } }

        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["title"].include?("can't be blank")).to(eq(true))
        expect(Activity.count).to(eq(0))
      end

      it("create a valid record with passage attributes") do
        post :create, params: {:activity => { :parent_activity_id => @activity.parent_activity_id, :scored_level => @activity.scored_level, :target_level => @activity.target_level, :title => @activity.title, :notes => @activity.notes, :passages_attributes => ([{ :text => ("Hello " * 20) }]) }}

        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["title"]).to(eq("First Activity"))
        expect(parsed_response["notes"]).to(eq("First Activity - Notes"))
        expect(Activity.count).to(eq(1))
        expect(Activity.first.passages.count).to(eq(1))
        expect(Activity.first.passages.first.text).to(eq(("Hello " * 20)))
      end

      it("create a valid record with prompt attributes") do
        post :create, params: {:activity => { :parent_activity_id => @activity.parent_activity_id, :scored_level => @activity.scored_level, :target_level => @activity.target_level, :title => @activity.title, :notes => @activity.notes, :prompts_attributes => ([{ :text => "meat is bad for you.", :conjunction => "because" }]) }}

        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(201))
        expect(parsed_response["title"]).to(eq("First Activity"))
        expect(parsed_response["notes"]).to(eq("First Activity - Notes"))
        expect(Activity.count).to(eq(1))
        expect(Activity.first.prompts.count).to(eq(1))
        expect(Activity.first.prompts.first.text).to(eq("meat is bad for you."))
      end

      it("create a new parent activity and activity if no parent_activity_id is passed") do
        post :create, params: {:activity => { :parent_activity_id => nil, :scored_level => @activity.scored_level, :target_level => @activity.target_level, :title => @activity.title, :notes => @activity.notes, :prompts_attributes => [{ :text => "meat is bad for you.", :conjunction => "because" }] }}

        parent_activity = Comprehension.parent_activity_class.find_by_name(@activity.title)
        new_activity = Activity.find_by_title(@activity.title)
        expect(parent_activity.present?).to(eq(true))
        expect(parent_activity.id).to(eq(new_activity.parent_activity_id))
        expect(new_activity.present?).to(eq(true))
      end
    end

    context("show") do
      before do
        @activity = create(:comprehension_activity, :parent_activity_id => 1, :title => "First Activity", :target_level => 8, :scored_level => "4th grade")
        @passage = create(:comprehension_passage, :activity => (@activity), :text => ("Hello" * 20))
        @prompt = create(:comprehension_prompt, :activity => (@activity), :text => "it is good.")
      end

      it("return json if found") do
        get :show, params: {:id => @activity.id}

        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(200))
        expect(parsed_response["title"]).to(eq("First Activity"))
        expect(parsed_response["passages"].first["text"]).to(eq(("Hello" * 20)))
        expect(parsed_response["prompts"].first["text"]).to(eq("it is good."))
      end

      it("raise if not found (to be handled by parent app)") do
        expect { get(:show, params: {:id => 99999}) }.to(raise_error(ActiveRecord::RecordNotFound))
      end
    end

    context("update") do
      before do
        @activity = create(:comprehension_activity, :parent_activity_id => 1, :title => "First Activity", :target_level => 8, :scored_level => "4th grade")
        @passage = create(:comprehension_passage, :activity => (@activity))
        @prompt = create(:comprehension_prompt, :activity => (@activity))
      end

      it("update record if valid, return nothing") do
        put :update, params: {:id => @activity.id, :activity => { :parent_activity_id => 2, :scored_level => "5th grade", :target_level => 9, :title => "New title" }}

        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        @activity.reload
        expect(@activity.parent_activity_id).to(eq(2))
        expect(@activity.scored_level).to(eq("5th grade"))
        expect(@activity.target_level).to(eq(9))
        expect(@activity.title).to(eq("New title"))
      end

      it("update passage if valid, return nothing") do
        put :update, params: {:id => @activity.id, :activity => { :passages_attributes => [{ :id => @passage.id, :text => ("Goodbye" * 20) }] }}

        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        @passage.reload
        expect(@passage.text).to(eq(("Goodbye" * 20)))
      end

      it("update prompt if valid, return nothing") do
        put :update, params: {:id => @activity.id, :activity => { :prompts_attributes => [{ :id => @prompt.id, :text => "this is a good thing." }] }}

        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        @prompt.reload
        expect(@prompt.text).to(eq("this is a good thing."))
      end

      it("not update record and return errors as json") do
        put :update, params: { :id => @activity.id, :activity => { :parent_activity_id => 2, :scored_level => "5th grade", :target_level => 99999999, :title => "New title" }}
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["target_level"].include?("must be less than or equal to 12")).to(eq(true))
      end
    end

    context("destroy") do
      before do
        @activity = create(:comprehension_activity)
        @passage = create(:comprehension_passage, :activity => (@activity))
      end

      it("destroy record at id") do
        delete :destroy, params: {:id => @activity.id}

        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        expect(@activity.id).to(be_truthy)
        expect(Activity.find_by_id(@activity.id)).to(be_nil)
        expect(@passage.id).to(be_truthy)
        expect(Passage.find_by_id(@passage.id)).to(be_nil)
      end
    end

    context("rules") do
      before do
        @activity = create(:comprehension_activity)
        @prompt = create(:comprehension_prompt, :activity => (@activity))
        @rule = create(:comprehension_rule, :prompts => ([@prompt]))
        @passage = create(:comprehension_passage, :activity => (@activity))
      end

      it("return rules") do
        get :rules, params: {:id => @activity.id}

        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(200))
        expect(@rule.id).to(eq(parsed_response[0]["id"]))
      end

      it("404 if activity is invalid") do
        expect { get(:rules, params: {:id => 99999}) }.to(raise_error(ActiveRecord::RecordNotFound))
      end
    end
  end
end
