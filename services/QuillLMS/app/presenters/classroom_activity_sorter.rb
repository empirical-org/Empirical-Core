module ClassroomActivitySorter

  def self.sort(classroom_activities)
    dued, undued = classroom_activities.partition{ |ca| ca.due_date.present? }
    self.sort_dued(dued).concat(self.sort_undued(undued))
  end

  private

  def self.sort_dued(dued)
    dued.sort_by{|d| d.due_date}
  end

  def self.sort_undued(undued)
    undued.sort_by{|u| u.created_at}
  end
end