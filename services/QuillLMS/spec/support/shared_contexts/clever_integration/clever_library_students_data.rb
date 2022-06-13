# frozen_string_literal: true

RSpec.shared_context "Clever Library Students Data" do
  let(:student1_clever_id) { "5b2c569c7a68e0097457ff9a" }
  let(:student1_first_name) { 'Bryce' }
  let(:student1_last_name) { 'Pauling' }
  let(:student1_name) { 'Bryce Pauling' }

  let(:student1_data) do
    {
      "data" => {
        "id"=> student1_clever_id,
        "grade"=>"2",
        "name"=> {
          "first"=> student1_first_name,
          "last"=> student1_last_name
        }
      }
    }
  end

  let(:student1_attrs) do
    {
      clever_id: student1_clever_id,
      email: nil,
      name: student1_name,
      username: student1_clever_id
    }
  end

  let(:student2_clever_id) { "5b2c569c7a68e0097457ff9a" }
  let(:student2_first_name) { 'Becca' }
  let(:student2_last_name) { 'Drake' }
  let(:student2_name) { 'Becca Drake' }

  let(:student2_data) do
    {
      "data" => {
        "id"=> student2_clever_id,
        "grade"=>"2",
        "name"=> {
          "first"=> student2_first_name,
          "last"=> student2_last_name
        }
      }
    }
  end

  let(:student2_attrs) do
    {
      clever_id: student2_clever_id,
      email: nil,
      name: student2_name,
      username: student2_clever_id
    }
  end

  let(:student3_clever_id) { '5b2c569c7a68e0097457ff9c' }
  let(:student3_first_name) { 'Linda' }
  let(:student3_last_name) { 'Redding' }
  let(:student3_name) { 'Linda Redding' }

  let(:student3_data) do
    {
      "data" => {
        "id"=> student3_clever_id,
        "grade"=>"",
        "name"=> {
          "first"=> student3_first_name,
          "last"=> student3_last_name
        }
      }
    }
  end

  let(:student3_attrs) do
    {
      clever_id: student3_clever_id,
      email: nil,
      name: student3_name,
      username: student3_clever_id
    }
  end
end
