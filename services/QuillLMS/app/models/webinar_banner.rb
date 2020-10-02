class WebinarBanner
  attr_reader :time

  ONE_OFFS = {
    '10-2-16' => ["Quill's Spotlight on Exploring the Activity Library", "https://quill-org.zoom.us/webinar/register/WN_uzoWu3HuQCa2ZpyQ0j4C5g"],
    '10-7-11' => ["Quill's Spotlight on Exploring the Activity Library", "https://quill-org.zoom.us/webinar/register/WN_uzoWu3HuQCa2ZpyQ0j4C5g"],
    '10-7-16' => ["Quill's Spotlight on Exploring the Activity Library", "https://quill-org.zoom.us/webinar/register/WN_ptLJPr_ZQTilmzklfDVrjA"],
    '10-14-11' => ["Quill's Spotlight on Ways to Use Quill with Google Classroom", "https://quill-org.zoom.us/webinar/register/WN_DhZRpHV7Q4K413v4SzcK1A"],
    '10-14-16' => ["Quill's Spotlight on Ways to Use Quill with Google Classroom", "https://quill-org.zoom.us/webinar/register/WN_DHVXyOXzS3mytUCqK_UbIA"],
    '10-21-11' => ["Quill's Spotlight on Keeping Your Remote Classroom on Track", "https://quill-org.zoom.us/webinar/register/WN_UiN_HtS7TwmYQObgOVCOGw"],
    '10-21-16' => ["Quill's Spotlight on Keeping Your Remote Classroom on Track", "https://quill-org.zoom.us/webinar/register/WN_DHVXyOXzS3mytUCqK_UbIA"],
    '10-28-11' => ["Quill's Spotlight on Using Quill to Support Students with IEPs", "https://quill-org.zoom.us/webinar/register/WN_4RGmnNfiSSSqO-EB13ecbw"],
    '10-28-16' => ["Quill's Spotlight on Using Quill to Support Students with IEPs", "https://quill-org.zoom.us/webinar/register/WN_YgimZ7j2TTCGW7HiniJAwg"],
    '11-4-11' => ["Quill's Spotlight on Data and Instruction", "https://quill-org.zoom.us/webinar/register/WN_8Dq0_YxNRa23-qWZT4qDaQ"],
    '11-4-16' => ["Quill's Spotlight on Data and Instruction", "https://quill-org.zoom.us/webinar/register/WN_d_oq8DgBQjGpeHzXXzM1AA"],
    '11-18-11' => ["Quill's Spotlight on Equitable Grading using Quill", "https://quill-org.zoom.us/webinar/register/WN_fggbcB53QcGSjVgqCvCkDQ"],
    '11-18-16' => ["Quill's Spotlight on Equitable Grading using Quill", "https://quill-org.zoom.us/webinar/register/WN_BNF3nVnyRVqrKQ9udZis-w"],
    '12-2-11' => ["Quill's Spotlight on Using Quill to Support English Language Learners", "https://quill-org.zoom.us/webinar/register/WN_xewDiLaYSEGM3jljnyYKAg"],
    '12-2-16' => ["Quill's Spotlight on Using Quill to Support English Language Learners", "https://quill-org.zoom.us/webinar/register/WN_R3h0pKEHTVqiLlNwdFHF4g"],
    '12-9-11' => ["Quill's Spotlight on Sentence Fluency at the Lesson Level", "https://quill-org.zoom.us/webinar/register/WN_i4r1iasTS2WqH38mVmabaA"],
    '12-9-16' => ["Quill's Spotlight on Sentence Fluency at the Lesson Level", "https://quill-org.zoom.us/webinar/register/WN_M0eiXLFaSEq-GQOAzj0kSA"],
    '12-16-11' => ["Quill's Spotlight on Encouraging & Empowering Your Writers", "https://quill-org.zoom.us/webinar/register/WN_1WBmjTBeSTmq_f3Kikkaaw"],
    '12-16-16' => ["Quill's Spotlight on Encouraging & Empowering Your Writers", "https://quill-org.zoom.us/webinar/register/WN_yB6Lltm3QH2h4AnobnCdLw"]
  }

  RECURRING = {
    '1-11' => ["Quill 101",  "https://quill-org.zoom.us/webinar/register/WN_OmB4MXOgTkWh_jeTFXUTnw"],
    '1-16' => ["Quill 101", "https://quill-org.zoom.us/webinar/register/WN_a4Z1_Zs6RSGUWwr_t0V18Q"],
    '2-11' => ["Quill in Pre-AP® and AP®: Spotlight on Data and Instruction", "https://quill-org.zoom.us/webinar/register/WN_UuoWsG_8Q5Cpbh9Bqqi24g"],
    '2-16' => ["Quill in Pre-AP® and AP®: Spotlight on Data and Instruction", "https://quill-org.zoom.us/webinar/register/WN_UuoWsG_8Q5Cpbh9Bqqi24g"],
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

  private

  def values
    day_of_week = time.wday
    if day_of_week == 1 || day_of_week == 2
      key = "#{day_of_week}-#{time.hour}"
      RECURRING[key]
    elsif day_of_week == 3
      key = "#{time.month}-#{time.day}-#{time.hour}"
      ONE_OFFS[key]
    elsif day_of_week == 5
      key = "#{time.month}-#{time.day}-#{time.hour}"
      ONE_OFFS[key]
    end
  end
end
