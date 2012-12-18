class AddLectureCommentIdToComments < ActiveRecord::Migration
  def change
    add_column :comments, :lecture_chapter_id, :integer
  end
end
