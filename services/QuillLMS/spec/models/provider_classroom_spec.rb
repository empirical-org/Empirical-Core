require 'rails_helper'

RSpec.describe ProviderClassroom do
  subject { described_class.new(classroom) }

  describe '#active_student?' do
    context 'google classroom' do
      let(:classroom) { create(:classroom, :from_google, students: [student1, student2, student3]) }
      let(:student1) { create(:student, :signed_up_with_google) }
      let(:student2) { create(:student, :signed_up_with_google) }
      let(:student3) { create(:student) }

      before do
        create(:google_classroom_user,
          :active,
          provider_classroom_id: classroom.google_classroom_id,
          provider_user_id: student1.google_id
        )

        create(:google_classroom_user,
          :deleted,
          provider_classroom_id: classroom.google_classroom_id,
          provider_user_id: student2.google_id
        )
      end

      it { expect(subject.synced_status(student1.attributes)).to eq true }
      it { expect(subject.synced_status(student2.attributes)).to eq false }
      it { expect(subject.synced_status(student3.attributes)).to eq nil }
    end

    context 'clever classroom' do
      let(:classroom) { create(:classroom, :from_clever, students: [student1, student2, student3]) }
      let(:student1) { create(:student, :signed_up_with_clever) }
      let(:student2) { create(:student, :signed_up_with_clever) }
      let(:student3) { create(:student) }

      before do
        create(:clever_classroom_user,
          :deleted,
          provider_classroom_id: classroom.clever_id,
          provider_user_id: student1.clever_id
        )

        create(:clever_classroom_user,
          :active,
          provider_classroom_id: classroom.clever_id,
          provider_user_id: student2.clever_id
        )
      end

      it { expect(subject.synced_status(student1.attributes)).to eq false }
      it { expect(subject.synced_status(student2.attributes)).to eq true }
      it { expect(subject.synced_status(student3.attributes)).to eq nil }
    end
  end
end
