# frozen_string_literal: true

# == Schema Information
#
# Table name: concepts
#
#  id             :integer          not null, primary key
#  description    :text
#  explanation    :text
#  name           :string
#  uid            :string           not null
#  visible        :boolean          default(TRUE)
#  created_at     :datetime
#  updated_at     :datetime
#  parent_id      :integer
#  replacement_id :integer
#
require 'rails_helper'

describe Concept, type: :model do

  it { should have_many(:change_logs) }

  describe 'can behave like an uid class' do
    context 'when behaves like uid' do
      it_behaves_like 'uid'
    end
  end

  describe '.leaf_nodes' do
    let!(:root_concept) { create(:concept, name: 'root') }
    let!(:leaf1) { create(:concept, name: 'leaf1', parent: root_concept)}
    let!(:mid_level_concept) { create(:concept, name: 'mid', parent: root_concept)}
    let!(:leaf2) { create(:concept, name: 'leaf2', parent: mid_level_concept)}

    subject { Concept.leaf_nodes }

    it 'finds all the concepts that are leaf nodes in the tree (no children)' do
      expect(subject.size).to eq(2)
    end

    it 'finds the right concepts' do
      expect(subject.map(&:name)).to match(['leaf1', 'leaf2'])
    end
  end

  describe '.all_with_level' do
    let!(:level_2_concept) {create(:concept, name: 'level_2_concept')}
    let!(:level_1_concept) {create(:concept, name: 'level_1_concept', parent: level_2_concept)}

    subject { Concept.all_with_level }

    it 'assigns level 2 to level_2_concept' do
      cor = subject.find{ |c| c.name == "level_2_concept" }
      expect(cor['level']).to eq(2)
    end

    it 'assigns level 1 to level_1_concept' do
      root = subject.find{ |c| c.name == "level_1_concept" }
      expect(root['level']).to eq(1)
    end
  end

  describe ".find" do
    it "can find by uid string" do
      uid = 'a2423kahfadf32'
      concept = create(:concept, id: '999', uid: uid)

      result = Concept.find_by_id_or_uid(uid)

      expect(result).to eq(concept)
    end

    it "can find by numeric id" do
      id = 999
      concept = create(:concept, id: id, uid: 'a2423kahfadf32')

      result = Concept.find_by_id_or_uid(id)

      expect(result).to eq(concept)
    end
  end

  describe '.visible_level_zero_concept_ids' do
    let!(:concept_f) { create(:concept, name: 'f') }
    let!(:concept_g) { create(:concept, name: 'g', parent: concept_f) }
    let!(:concept_h) { create(:concept, name: 'h', parent: concept_g) }

    let!(:concept_a) { create(:concept, name: 'a') }
    let!(:concept_b) { create(:concept, name: 'b', parent: concept_a) }
    let!(:concept_c) { create(:concept, name: 'c', parent: concept_a) }
    let!(:concept_d) { create(:concept, name: 'd', parent: concept_b) }
    let!(:concept_e) { create(:concept, name: 'e', parent: concept_b, visible: false) }

    subject { Concept.visible_level_zero_concept_ids }

    it { expect(subject).to eq [concept_d.id, concept_h.id] }
  end
end
