require 'rails_helper'

RSpec.describe ProviderClassroom do
  subject { described_class.new(classroom) }

  describe '#active_student?' do
    context 'google classroom' do
      let(:classroom) { create(:classroom_with_a_couple_students, :from_google, students: [student1, student2]) }
      let(:student1) { create(:student, :signed_up_with_google) }
      let(:student2) { create(:student, :signed_up_with_google) }

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

      it { expect(subject.active_student?(student1.attributes)).to eq true }
      it { expect(subject.active_student?(student2.attributes)).to eq false }
    end

    context 'clever classroom' do
      let(:classroom) { create(:classroom_with_a_couple_students, :from_clever, students: [student1, student2]) }
      let(:student1) { create(:student, :signed_up_with_clever) }
      let(:student2) { create(:student, :signed_up_with_clever) }

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

      it { expect(subject.active_student?(student1.attributes)).to eq false }
      it { expect(subject.active_student?(student2.attributes)).to eq true }
    end
  end
end
