module ChaptersHelper
  def next_lecture_chapter lecture_chapter
    scope = lecture_chapter.lecture.lecture_chapters
    index = scope.to_a.index(lecture_chapter)

    if (next_chapter = scope.to_a[index + 1].present?)
      next_chapter
    else
      scope.first
    end
  end
end
