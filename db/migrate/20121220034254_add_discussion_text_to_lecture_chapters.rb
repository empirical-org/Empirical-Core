class AddDiscussionTextToLectureChapters < ActiveRecord::Migration
  def change
    add_column :lecture_chapters, :discussion_text, :text
  end
end
