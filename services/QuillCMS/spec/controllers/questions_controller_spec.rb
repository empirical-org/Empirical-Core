require "rails_helper"

RSpec.describe QuestionsController, type: :controller do
  before do
    allow_any_instance_of(Response).to receive(:create_index_in_elastic_search)
  end

  context '#responses' do
    before do
      Rails.cache.clear
    end

    it 'should return empty array if nothing found' do
      get :responses, params: {question_uid: '123'}

      expect(response.status).to eq 200
      expect(JSON.parse(response.body)).to be_empty
    end

    context 'with data not in GradedResponse' do
      let!(:optimal) {create(:optimal_response, question_uid: '123')}
      let!(:graded_nonoptimal) {create(:graded_nonoptimal_response, question_uid: '123')}
      let!(:ungraded) {create(:ungraded_response, question_uid: '123')}

      it 'should return graded responses' do
        get :responses, params: {question_uid: '123'}

        expect(response.status).to eq 200
        # sorting to make test consistent (order doesn't matter for this API)
        json = JSON.parse(response.body).sort_by{|gr| gr['id']}

        expect(json.count).to eq 2
        expect(json.first['id']).to eq optimal.id
        expect(json.second['id']).to eq graded_nonoptimal.id
      end
    end

    context 'with data' do
      let!(:optimal) {create(:optimal_response, question_uid: '123')}
      let!(:graded_nonoptimal) {create(:graded_nonoptimal_response, question_uid: '123')}
      let!(:ungraded) {create(:ungraded_response, question_uid: '123')}

      before do
        GradedResponse.refresh
      end

      it 'should return graded responses' do
        get :responses, params: {question_uid: '123'}

        expect(response.status).to eq 200
        # sorting to make test consistent (order doesn't matter for this API)
        json = JSON.parse(response.body).sort_by{|gr| gr['id']}

        expect(json.count).to eq 2
        expect(json.first['id']).to eq optimal.id
        expect(json.second['id']).to eq graded_nonoptimal.id
      end
    end
  end

  context '#multiple_choice_options' do

    it 'should return empty array' do
      get :multiple_choice_options, params: {question_uid: '123'}

      expect(response.status).to eq 200
      expect(JSON.parse(response.body)).to be_empty
    end

    context 'with all data' do
      let!(:optimal1) {create(:optimal_response, question_uid: '123', count: 5)}
      let!(:optimal2) {create(:optimal_response, question_uid: '123', count: 7)}
      let!(:optimal3) {create(:optimal_response, question_uid: '123', count: 9)}

      let!(:graded_nonoptimal1) {create(:graded_nonoptimal_response, question_uid: '123', count: 17)}
      let!(:graded_nonoptimal2) {create(:graded_nonoptimal_response, question_uid: '123', count: 15)}
      let!(:graded_nonoptimal3) {create(:graded_nonoptimal_response, question_uid: '123', count: 19)}

      let!(:ungraded) {create(:ungraded_response, question_uid: '123', count: 1000)}

      before do
        GradedResponse.refresh
        MultipleChoiceResponse.refresh
      end

      # Note, this expectation is bound to QuestionsController::MULTIPLE_CHOICE_LIMIT
      it 'should return graded responses, 2 optimal, 2 from nonoptimal/ungraded' do
        get :multiple_choice_options, params: {question_uid: '123'}

        expect(response.status).to eq 200

        json = JSON.parse(response.body)
        optimal_count = json.count {|gr| gr['optimal']}
        graded_nonoptimal_count = json.count {|gr| gr['optimal'] == false }
        ungraded_count = json.count {|gr| gr['optimal'].nil?}

        expect(json.count).to eq 4
        expect(optimal_count).to eq 2
        expect(graded_nonoptimal_count).to eq 1
        expect(ungraded_count).to eq 1
      end

      it 'should return responses with the highest counts' do
        get :multiple_choice_options, params: {question_uid: '123'}

        expect(response.status).to eq 200

        json = JSON.parse(response.body)
        response_ids = json.map{|r| r['id']}.sort
        highest_count_ids = [optimal2.id, optimal3.id, ungraded.id, graded_nonoptimal3.id].sort

        expect(response_ids).to eq highest_count_ids
      end
    end

    context 'only optimal responses available' do
      before do
        create(:optimal_response, question_uid: '123')
        create(:optimal_response, question_uid: '123')
        create(:optimal_response, question_uid: '123')

        GradedResponse.refresh
        MultipleChoiceResponse.refresh
      end

      # Note, this expectation is bound to QuestionsController::MULTIPLE_CHOICE_LIMIT
      it 'should return graded responses, 2 optimal' do
        get :multiple_choice_options, params: {question_uid: '123'}

        expect(response.status).to eq 200

        json = JSON.parse(response.body)
        optimal_count = json.count {|gr| gr['optimal']}
        graded_nonoptimal_count = json.count {|gr| gr['optimal'] == false}
        ungraded_count = json.count {|gr| gr['optimal'].nil?}

        expect(json.count).to eq 2
        expect(optimal_count).to eq 2
        expect(graded_nonoptimal_count).to eq 0
        expect(ungraded_count).to eq 0
      end
    end

    context 'fallback responses needed - use graded' do
      before do
        create(:graded_nonoptimal_response, question_uid: '123', count: 17)
        create(:ungraded_response, question_uid: '123', count: 9)
        create(:ungraded_response, question_uid: '123', count: 3)
        create(:graded_nonoptimal_response, question_uid: '123', count: 2)

        GradedResponse.refresh
        MultipleChoiceResponse.refresh
      end

      # Note, this expectation is bound to QuestionsController::MULTIPLE_CHOICE_LIMIT
      it 'should return graded responses, 1 from MultipleChoiceResponse and 1 from fallback, favoring graded responses even with lower counts' do
        get :multiple_choice_options, params: {question_uid: '123'}

        expect(response.status).to eq 200

        json = JSON.parse(response.body)
        optimal_count = json.count {|gr| gr['optimal']}
        graded_nonoptimal_count = json.count {|gr| gr['optimal'] == false}
        ungraded_count = json.count {|gr| gr['optimal'].nil?}

        expect(json.count).to eq 2
        expect(optimal_count).to eq 0
        expect(graded_nonoptimal_count).to eq 2
        expect(ungraded_count).to eq 0
      end
    end

    context 'fallback responses needed - use ungraded' do
      before do
        create(:graded_nonoptimal_response, question_uid: '123', count: 17)
        create(:ungraded_response, question_uid: '123', count: 9)
        create(:ungraded_response, question_uid: '123', count: 3)

        GradedResponse.refresh
        MultipleChoiceResponse.refresh
      end

      # Note, this expectation is bound to QuestionsController::MULTIPLE_CHOICE_LIMIT
      it 'should return graded responses, 1 from MultipleChoiceResponse and 1 from ungraded responses since there are no more graded responses' do
        get :multiple_choice_options, params: {question_uid: '123'}

        expect(response.status).to eq 200

        json = JSON.parse(response.body)
        optimal_count = json.count {|gr| gr['optimal']}
        graded_nonoptimal_count = json.count {|gr| gr['optimal'] == false}
        ungraded_count = json.count {|gr| gr['optimal'].nil?}

        expect(json.count).to eq 2
        expect(optimal_count).to eq 0
        expect(graded_nonoptimal_count).to eq 1
        expect(ungraded_count).to eq 1
      end
    end
  end
end
