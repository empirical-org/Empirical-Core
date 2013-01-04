module ChaptersHelper
  def next_lecture_chapter lecture_chapter
    scope = lecture_chapter.lecture.lecture_chapters
    index = scope.to_a.index(lecture_chapter)

    if (next_chapter = scope.to_a[index + 1]).present?
      next_chapter
    else
      scope.first
    end
  end

  def display_panel? panel
    case panel
    when 'slideshow'  then @lecture_chapter.slideshow_embed_code.present?
    when 'annotate'   then @lecture_chapter.annotatable_text.present?
    when 'images'     then @lecture_chapter.lecture_chapter_images.any?
    when 'citations'  then @lecture_chapter.citation_text.present?
    when 'discussion' then @lecture_chapter.discussion_text.present?
    when 'chart'      then @lecture_chapter.chart_embed_code.present?
    when 'globe'      then @lecture_chapter.globe_embed_code.present?
    when 'read'       then @lecture_chapter.reading_text.present?
    when 'quiz'       then @lecture_chapter.quiz_embed_code.present?
    when 'notes'      then false
    when 'review'     then @lecture_chapter.questions.any?
    when 'lecture'    then false
    else
      true
    end
  end
end
