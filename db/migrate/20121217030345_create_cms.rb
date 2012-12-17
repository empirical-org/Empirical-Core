class CreateCMS < ActiveRecord::Migration
  def change
    create_table :courses do |t|
      t.string :title
      t.string :professor_name
      t.text :description
      t.timestamps
    end

    create_table :lectures do |t|
      t.string :title
      t.string :lecturer_name
      t.text :description
      t.belongs_to :course
      t.timestamps
    end

    add_index :lectures, :course_id
    create_table :lecture_chaptures do |t|
      t.belongs_to :lecture
      t.string :title
      t.string :subtitle
      t.integer :position
      t.text :youtube_embed_code
      t.text :citation_text
      t.text :reading_text
      t.text :annotatable_text
      t.text :chart_embed_code
      t.text :globe_embed_code
      t.text :quiz_embed_code
      t.text :slideshow_embed_code
      t.timestamps
    end

    add_index :lecture_chaptures, :lecture_id
    create_table :lecture_chapter_images do |t|
      t.belongs_to :lecture_chapter
      t.string :image_file
      t.timestamps
    end

    add_index :lecture_chapter_images, :lecture_chapter_id

  end
end
