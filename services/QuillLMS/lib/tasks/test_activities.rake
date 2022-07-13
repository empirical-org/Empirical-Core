# frozen_string_literal: true

namespace :test do
  desc 'create test activities A1, A2, A3'
  task :activities => :environment do

    a1_data = {
      uid: "tWwOHnapjOTXqMQOY6p7-g-test",
      name: 'Test A1 (And, Or)',
      description: "Write 10 sentences using the conjunctions and, or.",
      data: {"rule_position"=>"---\n- - '423'\n  - '1'\n"},
      activity_classification_id: 2,
      standard_id: 14
    }

    a2_data = {
      uid: "VolwH12xgS732exLTniUDQ-test",
      name: "Test A2 (Snow Day, Fiction)",
      description: "Proofread a passage to ensure that commas are plac...",
      data: {"body"=>"--- \"Alex woke up at seven o’clock as always. {+However,-However|173} when he looked\n  out his window, he could barely see anything.\\r\\n\"\n", "instructions"=>"--- This story has three introductory words. However, they do not have a comma placed\n  after them.<br><br> To make changes, click on a word and add a comma to the end\n  of it.\n...\n"},
      activity_classification_id: 1,
      standard_id: 47
    }


    a3_data = {
        uid: "Pgcl7c_giqeHwWvdgJA3CQ-test",
        name: "Test A3 (So, Because)",
        description: "Write 10 sentences using the conjunctions so or be...",
        data: {"rule_position"=>"---\n- - '423'\n  - '1'\n"},
        activity_classification_id: 2,
        standard_id: 14
    }

    a_datas = [a1_data, a2_data, a3_data]

    a_datas.each do |a_data|
      a = Activity.find_or_create_by uid: a_data[:uid]
      a.update(a_data)
      a.update(flags: ["production"])
    end
  end
end
