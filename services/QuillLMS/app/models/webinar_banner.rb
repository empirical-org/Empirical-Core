class WebinarBanner
  attr_reader :time

  ZOOM_URL = "https://quill-org.zoom.us/webinar/register"

  # ONE-OFFS have the key format Month-Day-Hour
  # RECURRING have the key format DayOfWeek-Hour

  ONE_OFFS = {
    '10-7-11' => ["Quill's Spotlight on Exploring the Activity Library", "#{ZOOM_URL}/WN_uzoWu3HuQCa2ZpyQ0j4C5g"],
    '10-7-16' => ["Quill's Spotlight on Exploring the Activity Library", "#{ZOOM_URL}/WN_ptLJPr_ZQTilmzklfDVrjA"],
    '10-14-11' => ["Quill's Spotlight on Ways to Use Quill with Google Classroom", "#{ZOOM_URL}/WN_DhZRpHV7Q4K413v4SzcK1A"],
    '10-14-16' => ["Quill's Spotlight on Ways to Use Quill with Google Classroom", "#{ZOOM_URL}/WN_DHVXyOXzS3mytUCqK_UbIA"],
    '10-21-11' => ["Quill's Spotlight on Keeping Your Remote Classroom on Track", "#{ZOOM_URL}/WN_UiN_HtS7TwmYQObgOVCOGw"],
    '10-21-16' => ["Quill's Spotlight on Keeping Your Remote Classroom on Track", "#{ZOOM_URL}/WN_DHVXyOXzS3mytUCqK_UbIA"],
    '10-28-11' => ["Quill's Spotlight on Using Quill to Support Students with IEPs", "#{ZOOM_URL}/WN_4RGmnNfiSSSqO-EB13ecbw"],
    '10-28-16' => ["Quill's Spotlight on Using Quill to Support Students with IEPs", "#{ZOOM_URL}/WN_YgimZ7j2TTCGW7HiniJAwg"],
    '11-4-11' => ["Quill's Spotlight on Data and Instruction", "#{ZOOM_URL}/WN_8Dq0_YxNRa23-qWZT4qDaQ"],
    '11-4-16' => ["Quill's Spotlight on Data and Instruction", "#{ZOOM_URL}/WN_d_oq8DgBQjGpeHzXXzM1AA"],
    '11-18-16' => ["Quill's Spotlight on Equitable Grading using Quill", "#{ZOOM_URL}/WN_BNF3nVnyRVqrKQ9udZis-w"],
    '12-2-16' => ["Quill's Spotlight on Using Quill to Support English Language Learners", "#{ZOOM_URL}/WN_R3h0pKEHTVqiLlNwdFHF4g"],
    '12-9-16' => ["Quill's Spotlight on Sentence Fluency at the Lesson Level", "#{ZOOM_URL}/WN_M0eiXLFaSEq-GQOAzj0kSA"],
    '12-16-16' => ["Quill's Spotlight on Encouraging & Empowering Your Writers", "#{ZOOM_URL}/WN_yB6Lltm3QH2h4AnobnCdLw"]
  }

  RECURRING = {
    '1-16' => ["Quill 101", "#{ZOOM_URL}/WN_a4Z1_Zs6RSGUWwr_t0V18Q"],
    '2-16' => ["Quill in Pre-AP® and AP®: Spotlight on Data and Instruction", "#{ZOOM_URL}/WN_UuoWsG_8Q5Cpbh9Bqqi24g"]
  }

  def initialize(time)
    @time = time
  end

  def link
    values&.at(1)
  end

  def title
    values&.at(0)
  end

  def show?
    link.present? && title.present?
  end

  private def values
    if recurring?
      RECURRING[recurring_key]
    elsif one_off?
      ONE_OFFS[one_off_key]
    end
  end

  private def recurring?
    time.wday == 1 || time.wday == 2
  end

  private def recurring_key
    "#{time.wday}-#{time.hour}"
  end

  private def one_off?
    time.wday == 3
  end

  private def one_off_key
    "#{time.month}-#{time.day}-#{time.hour}"
  end
end
