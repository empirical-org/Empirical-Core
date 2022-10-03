# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(HintsController, :type => :controller) do
    before { @routes = Engine.routes }

    context 'should index' do

      it 'should return successfully with no records' do
        get(:index)
        parsed_response = JSON.parse(response.body)
        expect(response.status).to eq(200)
        expect(parsed_response.class).to(eq(Array))
        expect(parsed_response.empty?).to(eq(true))
      end

      context 'should with hints' do
        let!(:hint) { create(:evidence_hint) }

        it 'should return successfully' do
          get(:index)
          parsed_response = JSON.parse(response.body)
          expect(response.status).to eq(200)
          expect(parsed_response.class).to(eq(Array))
          expect(parsed_response.empty?).to(eq(false))
          expect(parsed_response.first["name"]).to(eq(hint.name))
          expect(parsed_response.first["image_link"]).to(eq(hint.image_link))
          expect(parsed_response.first["image_alt_text"]).to(eq(hint.image_alt_text))
        end
      end
    end

    context 'should create' do
      let!(:hint) { create(:evidence_hint) }

      it 'should create a valid record and return it as json' do
        expect do
          post(:create, :params => ({ :hint => ({ :name => hint.name, :image_link => hint.image_link, :image_alt_text => hint.image_alt_text, :explanation => hint.explanation }) }))
          parsed_response = JSON.parse(response.body)
          expect(response.code.to_i).to(eq(201))
          expect(parsed_response["name"]).to(eq(hint.name))
          expect(parsed_response["image_link"]).to(eq(hint.image_link))
          expect(parsed_response["image_alt_text"]).to(eq(hint.image_alt_text))
          expect(parsed_response["explanation"]).to(eq(hint.explanation))
        end.to change(Hint, :count).by(1)
      end

      it 'should not create an invalid record and return errors as json' do
        expect do
          post(:create, :params => ({ :hint => { :name => 'New Hint'} }))
          parsed_response = JSON.parse(response.body)
          expect(response.code.to_i).to(eq(422))
          expect(parsed_response["image_link"]).to(include("can't be blank"))
          expect(parsed_response["image_alt_text"]).to(include("can't be blank"))
          expect(parsed_response["explanation"]).to(include("can't be blank"))
        end.to change(Hint, :count).by(0)
      end
    end

    context 'should show' do
      let!(:hint) { create(:evidence_hint) }

      it 'should return json if found' do
        get(:show, :params => ({ :id => hint.id }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(200))
        expect(parsed_response["name"]).to(eq(hint.name))
        expect(parsed_response["image_link"]).to(eq(hint.image_link))
        expect(parsed_response["image_alt_text"]).to(eq(hint.image_alt_text))
        expect(parsed_response["explanation"]).to(eq(hint.explanation))
      end

      it 'should raise if not found (to be handled by parent app)' do
        expect { get(:show, :params => ({ :id => 99999 })) }.to(raise_error(ActiveRecord::RecordNotFound))
      end
    end

    context 'should update' do
      let!(:hint) { create(:evidence_hint) }

      it 'should update record if valid, return nothing' do
        new_name = 'This is a new name'
        new_explanation = 'This is a new explanation'
        patch(:update, :params => ({ :id => hint.id, :hint => ({ :name => new_name, :explanation => new_explanation }) }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        hint.reload
        expect(hint.name).to(eq(new_name))
        expect(hint.explanation).to(eq(new_explanation))
      end

      it 'should not update record and return errors as json' do
        patch(:update, :params => ({ :id => hint.id, :hint => ({ :name => nil, :explanation => nil }) }))
        parsed_response = JSON.parse(response.body)
        expect(response.code.to_i).to(eq(422))
        expect(parsed_response["name"]).to(include("can't be blank"))
        expect(parsed_response["explanation"]).to(include("can't be blank"))
      end
    end

    context 'should destroy' do
      let!(:hint) { create(:evidence_hint) }

      it 'should destroy record at id' do
        delete(:destroy, :params => ({ :id => hint.id }))
        expect(response.body).to(eq(""))
        expect(response.code.to_i).to(eq(204))
        expect(hint.id).to(be_truthy)
        expect(Hint.find_by_id(hint.id)).to(be_nil)
      end
    end
  end
end
