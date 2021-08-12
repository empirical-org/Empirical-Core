require 'rails_helper'

describe TeacherCenterHelper do
  describe '#teacher_center_tabs' do
    let(:current_user) { create(:teacher) }
    let(:app_setting) { create(:app_setting, name: "comprehension") }
    let(:tabs) {
      [{ id: "All resources", name: "All resources", url: "teacher-center" },
      { id: "Getting started", name: "Getting started", url: "teacher-center/topic/getting-started" },
      { id: "Teacher stories", name: "Teacher stories", url: "teacher-center/topic/teacher-stories" },
      { id: "Writing instruction research", name: "Writing instruction research", url: "teacher-center/topic/writing-instruction-research" },
      { id: "FAQ", name: "FAQ", url: "faq" },
      { id: "Premium", name: "Premium", url: "premium" }]
    }

    before do
      allow(helper).to receive(:current_user) { current_user }
    end

    it 'should return the tabs without comprehension if app setting is false' do
      create(:app_setting, name: "comprehension")
      expect(helper.teacher_center_tabs).to eq tabs
    end
    it 'should return the tabs with comprehension if app setting is true' do
      comprehension_tab = { id: "Using quill for reading comprehension", name: "Using Quill for reading comprehension", url: "teacher-center/topic/using-quill-for-reading-comprehension" }
      app_setting.enabled = true
      app_setting.user_ids_allow_list = [current_user.id]
      app_setting.save!
      tabs.insert(1, comprehension_tab)
      expect(helper.teacher_center_tabs).to eq tabs
    end
  end
end
