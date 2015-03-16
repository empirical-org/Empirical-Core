require 'rails_helper'

describe 'Teacher Scorebook page' do
  let(:mr_kotter) { FactoryGirl.create :mr_kotter }

  context 'for an existing class with students' do
    include_context :ms_sorter_and_sort_fodder

    let(:scorebook_page) { Teachers::ScorebookPage.new(sort_fodder) }

    context 'when signed in as the Teacher' do
      before(:each) do
        sign_in_user ms_sorter
        scorebook_page.visit
      end

      it 'shows the students, sorted by (last, first) name' do
        expect(scorebook_page.students).to eq sort_fodder_sorted.map(&:name)
      end
    end
  end
end
