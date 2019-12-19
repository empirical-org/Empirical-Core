class AddUniqueResponseIndex < ActiveRecord::Migration[5.1]
  def change
    merge_duplicate_responses
    add_index :responses, [:question_uid, :text], unique: true
  end

  def merge_duplicate_responses
    Response.select(:question_uid, :text).having('COUNT(*) > 1').group(:question_uid, :text).each do |unique_pairs|
      first_match = true
      Response.where(question_uid: unique_pairs.question_uid, text: unique_pairs.text).each do |response|
        if first_match
          question_uid = response.question_uid
          text = response.text
          total_count = Response.where(question_uid: question_uid, text: text).sum(:count) 
          total_child_count = Response.where(question_uid: question_uid, text: text).sum(:child_count)
          response.count = total_count
          response.child_count = total_child_count
          response.save!
          first_match = false
        else
          response.destroy!
        end
      end
    end
  end
end
