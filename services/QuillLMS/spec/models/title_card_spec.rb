# frozen_string_literal: true

# == Schema Information
#
# Table name: title_cards
#
#  id              :integer          not null, primary key
#  content         :string
#  title           :string
#  title_card_type :string           not null
#  uid             :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_title_cards_on_title_card_type  (title_card_type)
#  index_title_cards_on_uid              (uid) UNIQUE
#
require 'rails_helper'

describe "TitleCard", type: :model do
  title_card_params = {uid:'testuid', content:'Test Content', title:'Test Title', title_card_type: 'connect_title_card'}

  describe "#valid" do
    it 'should be invalid if required params are not present' do
      required_params = [:uid, :content, :title, :title_card_type]
      required_params.each do |p|
        expect(TitleCard.new(title_card_params.except(p)).valid?).to eq(false)
      end
    end

    it 'should be valid if required params are present' do
      expect(TitleCard.new(title_card_params).valid?).to eq(true)
    end
  end

  describe "#as_json" do
    before do
      @title_card = TitleCard.create(title_card_params)
    end

    it 'should remove "id" param from json object' do
      expect(@title_card.as_json).not_to have_key(:id)
    end
  end
end
