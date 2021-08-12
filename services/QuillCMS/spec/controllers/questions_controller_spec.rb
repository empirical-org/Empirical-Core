require "rails_helper"

RSpec.describe QuestionsController, type: :controller do
  before(:each) do
    allow_any_instance_of(Response).to receive(:create_index_in_elastic_search)
  end

  context '#responses' do
    it 'should return empty array if nothing found' do
      get :responses, params: {question_uid: '123'}

      expect(response.status).to eq 200
      expect(JSON.parse(response.body)).to be_empty
    end

    context 'with data' do
      let!(:response_optimal) {create(:response, question_uid: '123', optimal: true)}
      let!(:response_nonoptimal) {create(:response, question_uid: '123', optimal: false)}
      let!(:response_ungraded) {create(:response, question_uid: '123', optimal: nil)}

      before(:each) do
        GradedResponse.refresh
      end

      it 'should return graded responses' do
        get :responses, params: {question_uid: '123'}

        expect(response.status).to eq 200
        # sorting to make test consistent (order doesn't matter for this API)
        json = JSON.parse(response.body).sort_by{|gr| gr['id']}

        expect(json.count).to eq 2
        expect(json.first['id']).to eq response_optimal.id
        expect(json.second['id']).to eq response_nonoptimal.id
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
      let!(:optimal1) {create(:response, question_uid: '123', optimal: true, count: 5)}
      let!(:optimal2) {create(:response, question_uid: '123', optimal: true, count: 7)}
      let!(:optimal3) {create(:response, question_uid: '123', optimal: true, count: 9)}

      let!(:nonoptimal1) {create(:response, question_uid: '123', optimal: false, count: 7)}
      let!(:nonoptimal2) {create(:response, question_uid: '123', optimal: false, count: 5)}
      let!(:nonoptimal3) {create(:response, question_uid: '123', optimal: false, count: 9)}

      let!(:ungraded) {create(:response, question_uid: '123', optimal: nil, count: 1000)}

      before(:each) do
        GradedResponse.refresh
        MultipleChoiceResponse.refresh
      end

      # Note, this expectation is bound to QuestionsController::MULTIPLE_CHOICE_LIMIT
      it 'should return graded responses, 2 optimal, 2 from nonoptimal/ungraded' do
        get :multiple_choice_options, params: {question_uid: '123'}

        expect(response.status).to eq 200

        json = JSON.parse(response.body)
        optimal_count = json.count {|gr| gr['optimal']}
        nonoptimal_count = json.count {|gr| gr['optimal'] == false }
        null_optimal_count = json.count {|gr| gr['optimal'].nil?}

        expect(json.count).to eq 4
        expect(optimal_count).to eq 2
        expect(nonoptimal_count).to eq 1
        expect(null_optimal_count).to eq 1
      end

      it 'should return responses with the highest counts' do
        get :multiple_choice_options, params: {question_uid: '123'}

        expect(response.status).to eq 200

        json = JSON.parse(response.body)
        response_ids = json.map{|r| r['id']}.sort
        highest_count_ids = [optimal2.id, optimal3.id, ungraded.id, nonoptimal3.id].sort

        expect(response_ids).to eq highest_count_ids
      end
    end

    context 'only optimal responses available' do
      let!(:optimal1) {create(:response, question_uid: '123', optimal: true)}
      let!(:optimal2) {create(:response, question_uid: '123', optimal: true)}
      let!(:optimal3) {create(:response, question_uid: '123', optimal: true)}

      before(:each) do
        GradedResponse.refresh
        MultipleChoiceResponse.refresh
      end

      # Note, this expectation is bound to QuestionsController::MULTIPLE_CHOICE_LIMIT
      it 'should return graded responses, 2 optimal' do
        get :multiple_choice_options, params: {question_uid: '123'}

        expect(response.status).to eq 200

        json = JSON.parse(response.body)
        optimal_count = json.count {|gr| gr['optimal']}
        nonoptimal_count = json.count {|gr| gr['optimal'] == false}
        null_optimal_count = json.count {|gr| gr['optimal'].nil?}

        expect(json.count).to eq 2
        expect(optimal_count).to eq 2
        expect(nonoptimal_count).to eq 0
        expect(null_optimal_count).to eq 0
      end
    end
  end
end
