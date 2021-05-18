require 'test_helper'

module Comprehension
  class ActivitiesControllerTest < ActionController::TestCase
    setup do
      @routes = Engine.routes
    end

    context "index" do
      should "return successfully - no activities" do
        get :index

        parsed_response = JSON.parse(response.body)

        assert_response :success
        assert_equal Array, parsed_response.class
        assert parsed_response.empty?
      end

      context 'with activities where one has an archived parent' do
        setup do
          @archived_activity = Comprehension.parent_activity_class.create(name: 'Archived Activity', flags: ['archived'])
          @unarchived_activity = Comprehension.parent_activity_class.create(name: 'Unarchived Activity')
          create(:comprehension_activity, parent_activity_id: @archived_activity.id, title: "First Activity", target_level: 8)
          create(:comprehension_activity, parent_activity_id: @unarchived_activity.id, title: "Second Activity",
            target_level: 5)
        end

        should "return with only the unarchived activity" do
          get :index

          parsed_response = JSON.parse(response.body)

          assert_response :success
          assert_equal Array, parsed_response.class
          refute parsed_response.empty?

          assert_equal parsed_response.length, 1
          assert_equal  "Second Activity", parsed_response.first['title']
          assert_equal  5, parsed_response.first['target_level']
          assert_equal  @unarchived_activity.id, parsed_response.first['parent_activity_id']
        end
      end

      context 'with actitivites' do
        setup do
          # The controller sorts items alphabetically by "name"
          @first_activity = create(:comprehension_activity, title: "First Activity", name: "Name 1", target_level: 8)
          create(:comprehension_activity, title: "Second Activity", name: "Name 2", target_level: 5)
        end

        should "return successfully" do
          get :index

          parsed_response = JSON.parse(response.body)

          assert_response :success
          assert_equal Array, parsed_response.class
          refute parsed_response.empty?

          # We expect these to be ordered alphatbetically by name
          assert_equal  "First Activity", parsed_response.first['title']
          assert_equal  8, parsed_response.first['target_level']
          assert_equal  @first_activity.parent_activity.id, parsed_response.first['parent_activity_id']
        end
      end
    end

    context "create" do
      setup do
        @activity = build(:comprehension_activity, parent_activity_id: 1, title: "First Activity", target_level: 8, scored_level: "4th grade", name: "First Activity - Name")
        Comprehension.parent_activity_classification_class.create(key: 'comprehension')
      end

      should "create a valid record and return it as json" do
        post :create, activity: { parent_activity_id: @activity.parent_activity_id, scored_level: @activity.scored_level, target_level: @activity.target_level, title: @activity.title, name: @activity.name }

        parsed_response = JSON.parse(response.body)

        assert_equal 201, response.code.to_i
        assert_equal "First Activity", parsed_response['title']
        assert_equal "First Activity - Name", parsed_response['name']
        assert_equal 1, Activity.count
      end

      should "not create an invalid record and return errors as json" do
        post :create, activity: { parent_activity_id: @activity.parent_activity_id }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['title'].include?("can't be blank")
        assert_equal 0, Activity.count
      end

      should "create a valid record with passage attributes" do
        post :create, activity: { parent_activity_id: @activity.parent_activity_id, scored_level: @activity.scored_level, target_level: @activity.target_level, title: @activity.title, name: @activity.name, passages_attributes: [{text: ("Hello " * 20) }] }

        parsed_response = JSON.parse(response.body)

        assert_equal 201, response.code.to_i
        assert_equal "First Activity", parsed_response['title']
        assert_equal "First Activity - Name", parsed_response['name']
        assert_equal 1, Activity.count
        assert_equal 1, Activity.first.passages.count
        assert_equal ("Hello " * 20), Activity.first.passages.first.text
      end

      should "create a valid record with prompt attributes" do
        post :create, activity: { parent_activity_id: @activity.parent_activity_id, scored_level: @activity.scored_level, target_level: @activity.target_level, title: @activity.title, name: @activity.name, prompts_attributes: [{text: "meat is bad for you.", conjunction: "because"}] }

        parsed_response = JSON.parse(response.body)

        assert_equal 201, response.code.to_i
        assert_equal "First Activity", parsed_response['title']
        assert_equal "First Activity - Name", parsed_response['name']
        assert_equal 1, Activity.count
        assert_equal 1, Activity.first.prompts.count
        assert_equal "meat is bad for you.", Activity.first.prompts.first.text
      end

      should "create a new parent activity and activity if no parent_activity_id is passed" do
        post :create, activity: { parent_activity_id: nil, scored_level: @activity.scored_level, target_level: @activity.target_level, title: @activity.title, name: @activity.title, prompts_attributes: [{text: "meat is bad for you.", conjunction: "because"}] }
        parent_activity = Comprehension.parent_activity_class.find_by_name(@activity.title)
        new_activity = Activity.find_by_title(@activity.title)
        assert parent_activity.present?
        assert_equal new_activity.parent_activity_id, parent_activity.id
        assert new_activity.present?
      end
    end

    context "show" do
      setup do
        @activity = create(:comprehension_activity, parent_activity_id: 1, title: "First Activity", target_level: 8, scored_level: "4th grade")
        @passage = create(:comprehension_passage, activity: @activity, text: ('Hello' * 20))
        @prompt = create(:comprehension_prompt, activity: @activity, text: "it is good.")
      end

      should "return json if found" do
        get :show, id: @activity.id

        parsed_response = JSON.parse(response.body)

        assert_equal 200, response.code.to_i
        assert_equal "First Activity", parsed_response['title']
        assert_equal ('Hello' * 20), parsed_response['passages'].first['text']
        assert_equal "it is good.", parsed_response['prompts'].first['text']
      end

      should "raise if not found (to be handled by parent app)" do
        assert_raises ActiveRecord::RecordNotFound do
          get :show, id: 99999
        end
      end
    end

    context "update" do
      setup do
        @activity = create(:comprehension_activity, parent_activity_id: 1, title: "First Activity", target_level: 8, scored_level: "4th grade")
        @passage = create(:comprehension_passage, activity: @activity)
        @prompt = create(:comprehension_prompt, activity: @activity)
      end

      should "update record if valid, return nothing" do
        put :update, id: @activity.id, activity: { parent_activity_id: 2, scored_level: "5th grade", target_level: 9, title: "New title" }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        @activity.reload

        assert_equal 2, @activity.parent_activity_id
        assert_equal "5th grade",  @activity.scored_level
        assert_equal 9, @activity.target_level
        assert_equal "New title",  @activity.title
      end

      should "update passage if valid, return nothing" do
        put :update, id: @activity.id, activity: { passages_attributes: [{id: @passage.id, text: ('Goodbye' * 20)}] }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        @passage.reload

        assert_equal ('Goodbye' * 20), @passage.text
      end

      should "update prompt if valid, return nothing" do
        put :update, id: @activity.id, activity: { prompts_attributes: [{id: @prompt.id, text: "this is a good thing."}] }

        assert_equal "", response.body
        assert_equal 204, response.code.to_i

        @prompt.reload

        assert_equal "this is a good thing.", @prompt.text
      end


      should "not update record and return errors as json" do
        put :update, id: @activity.id, activity: { parent_activity_id: 2, scored_level: "5th grade", target_level: 99999999, title: "New title" }

        parsed_response = JSON.parse(response.body)

        assert_equal 422, response.code.to_i
        assert parsed_response['target_level'].include?("must be less than or equal to 12"), "Missing error message in response #{parsed_response['target_level']}"
      end
    end

    context 'destroy' do
      setup do
        @activity = create(:comprehension_activity)
        @passage = create(:comprehension_passage, activity: @activity)
      end

      should "destroy record at id" do
        delete :destroy, id: @activity.id

        assert_equal "", response.body
        assert_equal 204, response.code.to_i
        assert @activity.id # still in test memory
        assert_nil Activity.find_by_id(@activity.id) # not in DB.
        assert @passage.id
        assert_nil Passage.find_by_id(@passage.id)
      end
    end

    context 'rules' do
      setup do
        @activity = create(:comprehension_activity)
        @prompt = create(:comprehension_prompt, activity: @activity)
        @rule = create(:comprehension_rule, prompts: [@prompt])
        @passage = create(:comprehension_passage, activity: @activity)
      end

      should "return rules" do
        get :rules, id: @activity.id

        parsed_response = JSON.parse(response.body)

        assert_equal 200, response.code.to_i
        assert_equal parsed_response[0]['id'], @rule.id
      end

      should "404 if activity is invalid" do
        assert_raises ActiveRecord::RecordNotFound do
          get :rules, id: 99999
        end
      end
    end
  end
end
