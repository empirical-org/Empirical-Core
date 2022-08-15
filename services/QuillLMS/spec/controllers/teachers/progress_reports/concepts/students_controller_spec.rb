# frozen_string_literal: true

require 'rails_helper'

describe Teachers::ProgressReports::Concepts::StudentsController, type: :controller do
  include_context 'Student Concept Progress Report'
  it_behaves_like 'Progress Report' do
    let(:result_key) { 'students' }
    let(:expected_result_count) { visible_students.size }
  end

  context 'GET #index json' do
    context 'when logged in' do
      let(:json) { JSON.parse(response.body) }

      subject { get :index, as: :json }

      before { session[:user_id] = teacher.id }

      it 'includes a list of students in the JSON' do
        crs = alice.activity_sessions.map(&:concept_results).flatten
        crs_correct = 0
        crs.each{|cr| crs_correct += cr.correct ? 1 : 0}
        subject
        alice_json = json['students'][0]
        expect(alice_json['name']).to eq(alice.name)
        expect(alice_json['total_result_count'].to_i).to eq(alice_session.concept_results.size)
        expect(alice_json['correct_result_count'].to_i).to eq(crs_correct)
        expect(alice_json['incorrect_result_count'].to_i).to eq(crs.length - crs_correct)
      end
    end
  end
end
