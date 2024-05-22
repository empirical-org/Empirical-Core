# frozen_string_literal: true

require 'rails_helper'

Rails.application.load_tasks

describe "schools.rake", type: :task do
  let(:nces_id) { 123456789 }
  let(:left_padded_nces_id) { "0#{nces_id}" }
  let(:new_name) { 'New School Name' }
  let!(:original_school) { create(:school, nces_id: left_padded_nces_id) }
  let!(:duplicate_school) { create(:school, nces_id: nces_id, name: new_name) }

  context "reassign_users_from_duplicates" do

    # Originally I tried to do this as three different `it` blocks, but
    # whichever one ran first would pass, and the other two would fail.
    # Not sure what was up with that, but this test at least works?
    it 'should move users and admins assigned to duplicate schools to their original schools' do
      user = create(:user, school: duplicate_school)
      admin = create(:user, administered_schools: [duplicate_school])

      Rake::Task["schools:reassign_users_from_duplicates"].invoke

      expect(user.reload.school).to eq(original_school)
      expect(admin.reload.administered_schools).to eq([original_school])
    end
  end

  context "clean_up_duplicates" do
    it 'should update original school record with data from the new school record, and then delete the old record' do
      Rake::Task["schools:clean_up_duplicates"].invoke

      expect(original_school.reload.name).to eq(new_name)
      expect(School.exists?(original_school.id)).to be(true)
      expect(School.exists?(duplicate_school.id)).to be(false)
    end
  end
end
