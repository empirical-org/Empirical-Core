# frozen_string_literal: true

require 'rails_helper'

describe TeacherActivityFeedBatchRefillWorker, type: :worker do
  let(:worker) { described_class.new }
  let!(:teacher_in_window1) { create(:teacher, last_sign_in: '2020-01-05')}
  let!(:teacher_in_window2) { create(:teacher, last_sign_in: '2020-01-06')}
  let!(:teacher_outside) { create(:teacher, last_sign_in: '2020-02-10')}

  it 'should queue jobs for teachers with last sign-in within start/end' do
    expect(TeacherActivityFeedRefillWorker).to receive(:perform_in).with(0, teacher_in_window1.id)
    expect(TeacherActivityFeedRefillWorker).to receive(:perform_in).with(7, teacher_in_window2.id)

    run_delay = 7

    worker.perform('2020-01-01', '2020-01-31', run_delay)
  end
end
