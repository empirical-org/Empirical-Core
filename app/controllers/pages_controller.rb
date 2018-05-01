class PagesController < ApplicationController
  include HTTParty
  before_filter :determine_js_file, :determine_flag
  layout :determine_layout

  def home
    if signed_in?
      redirect_to(profile_path) && return
    end

    @body_class = 'home-page'

    @activity = Activity.with_classification.find_by_uid(ENV.fetch('HOMEPAGE_ACTIVITY_UID', ''))

    self.formats = ['html']
  end

  def home_new
    if signed_in?
      redirect_to(profile_path) && return
    end
    @title = 'Quill.org — Interactive Writing and Grammar'
    @description = 'Quill provides free writing and grammar activities for middle and high school students.'
  end

  def develop
  end

  def ideas
    connect = HTTParty.get('https://trello.com/1/boards/5B4Jalbc/lists?fields=name,id')
    lessons = HTTParty.get('https://trello.com/1/boards/cIRvYfE7/lists?fields=name,id')
    @connect_json = add_cards(JSON.parse(connect.body))
    @lessons_json = add_cards(JSON.parse(lessons.body))
  end

  def partners
  end

  def mission
  end

  def beta
  end

  def play
    @activity = Activity.with_classification.find_by_uid('-K0rnIIF_iejGqS3XPJ8')
    @module_url = @activity.anonymous_module_url
    redirect_to(@module_url.to_s)
  end

  def about
    @body_class = 'full-width-page white-page'
  end

  def faq
    @sections = [
      {
        title: 'General Questions',
        faqs: [
          {
            question: "What is Quill?",
            answer: "<p>Quill is a lightweight learning management system integrated with a suite of online apps that teach writing, grammar, and vocabulary skills to students. Students using Quill learn English grammar and vocabulary by fixing sentences, proofreading passages, and collaboratively writing passages. Quill is part of Empirical, a 501(c)3 nonprofit organization.</p>"
          },
          {
            question: "How does Quill work?",
            answer: "<p>Quill provides 10-15 minute exercises that help students build sentence construction skills. Quill automatically grades the writing and provides feedback and hints to help students improve it. The immediate feedback enables students to quickly build their skills, and it saves teachers dozens of hours spent on grading.</p>"
          },
          {
            question: "What are Quill's tools?",
            answer: "
              <p><strong>Quill Diagnostic</strong>: Identify Learning Gaps and Assign Personalized Learning Plans</p>
              <p><strong>Quill Lessons</strong>: Shared Group Lessons</p>
              <p><strong>Quill Connect</strong>: Combine Sentences</p>
              <p><strong>Quill Grammar</strong>: Practice Mechanics</p>
              <p><strong>Quill Proofreader</strong>: Fix Errors In Passages</p>
            "
          },
          {
            question: "Who is using Quill?",
            answer: "<p>As of January 2018, over 20,000 teachers and 750,000 students have used Quill. These students complete approximately 30,000 activities each day. From Rhode Island to Russia, and the Bay Area to Great Britain, these students live all over the world.</p>"
          },
          {
            question: "How can I integrate Quill into my classroom?",
            answer: "
              <p><strong>Do Now</strong>: Use Quill’s activities as a quick daily warm-up at the beginning of class.</p>
              <p><strong>Whole-Class Lessons</strong>: Lead whole-class interactive and small group writing instruction.</p>
              <p><strong>Independent Practice</strong>: Use Quill after a mini lesson to reinforce your instruction.</p>
              <p><strong>Homework</strong>: Assign Quill as homework for students to complete on a smartphone or a computer.</p>
            "
          },
          {
            question: "Which grammar concepts are covered by Quill?",
            answer: "<p>Quill activities cover more than 300 grammar concepts such as Complex Sentences, Capitalization, Fragments, Compound Sentences, Adjectives, Prepositions and more. You can view a list of our most popular activity packs <a href='https://www.quill.org/activities/packs'>here</a> and you can view a list of the standards that we cover <a href='https://www.quill.org/activities/section/7'>here</a>.</p>"
          },
          {
            question: "How much does Quill cost?",
            answer: "
              <p>All of Quill's activities are free for educators and students to use with no hidden fees. There is no limit to the number of activities you can assign or the number of students you can invite. We also offer a premium service for in-depth reporting for educators, schools, and districts. You can learn more about Quill Premium <a href='https://www.quill.org/premium'>here</a>.</p>
            "
          },
          {
            question: "How many activities are on Quill?",
            answer: "<p>As of September 2017, we have created over 300 activities with 1,309 practice questions, covering Common Core topics for grades 1-8. Each activity is approximately 10-15 minutes in length.</p>"
          },
          {
            question: "I am a parent. Can I use Quill for my child?",
            answer: "<p>Yes. However, we do not currently offer parent accounts. You will need to sign up for a teacher account, create a classroom, and then add your child to it as a student.</p>"
          }
        ]
      },
      {
        title: 'Implementation Questions',
        faqs: [
          {
            question: "I just signed up for Quill. Now what?",
            answer: "<p>We have a getting started guide <a href='http://community.quill.org/wp-content/uploads/2015/11/Quill-Getting-Started-Guide-for-Teachers.pdf'>here.</a></p>"
          },
          {
            question: "How much time should my students spend on Quill?",
            answer: "<p>Quill is a supplemental tool, and each activity takes 10-15 minutes. We recommend that students complete 2-3 activities a week over eight weeks in order to see an improvement in their writing.</p>"
          },
          {
            question: "How does Quill fit into the larger classroom experience?",
            answer: "<p>Quill activities are approximately 15 minutes in length. Teachers who have a 1:1 computer to student ratio tend to use Quill as a warm-up activity at the beginning of a class. Teachers who have a limited availability of laptops tend to have their students rotate through the computers while the rest of the class engages in other activities.</p>"
          },
          {
            question: "Is there a fixed progression of activities?",
            answer: "<p>While our activities are arranged by Common Core Standard, there is not a fixed progression of activities. Teachers have all of our activities available to them, and they may choose to assign any activity they're interested in teaching.</p>"
          },
        ]
      },
      {
        title: 'Pedagogical Questions',
        faqs: [
          {
            question: "How do you build your activities?",
            answer: "<p>We take each standard from the Common Core language section, and then we consult with a team of educators to find the best ways of teaching the topic. Finally, we collaborate with a group of teachers that creates the content. If you’re interested in helping us create content, please email us at <a href='mailto:hello@quill.org'>hello@quill.org</a>.</p>"
          },
          {
            question: "How does Quill provide personalized instruction?",
            answer: "<p>Once your students complete the diagnostic, Quill will generate a 10 week personalized learning plan for each student that targets needed skills. Quill also provides a diagnostic for ELLs.</p>"
          },
          {
            question: "What happens if a student answers a question incorrectly?",
            answer: "<p>Students can retry each question once per sentence writing activity. If they answer incorrectly twice they move on to the next question.</p>"
          },
          {
            question: "What happens if a student wants to retry an activity?",
            answer: "
              <p>As of January 2017, Quill provides four tools to help students improve their writing, grammar, and proofreading skills. Each tool provides a different level of feedback for students.</p>
              <br />
              <p><strong>Quill Proofreader: One Attempt</strong></p>
              <p>In Quill Proofreader, students proofread a passage to find and correct the errors. Students are given one attempt to find the errors, and if they do not find them, they see the error highlighted in red.</p>
              <br />
              <p><strong>Quill Grammar: Two Attempts</strong></p>
              <p>Students are able to attempt each Quill Grammar question twice. If they get it right on the second attempt, students receive full credit for the question. If they answer incorrectly twice they move on to the next question.</p>
              <br />
              <p><strong>Quill Connect: Five Attempts</strong></p>
              <p>In Quill Connect, Quill's sentence combining tool, students are provided with up to five opportunities to revise their work. Students receive instant feedback after each attempt. If a student receives writes a strong answer on the first attempt, the student receives full credit. If the student writes a strong sentence after receiving feedback, the student receives partial credit. Quill Connect exercises are graded on the following logic:</p>
              <br />
              <ul>
                <li>1st Attempt: 1 Point</li>
                <li>2nd Attempt: 3/4's of a Point</li>
                <li>3rd Attempt: 1/2 of a Point </li>
                <li>4th Attempt: 1/4 of a Point</li>
                <li>5th Attempt: 0 Points</li>
              </ul>
              <br />
              <p><strong>Quill Diagnostic: One Attempt</strong></p>
              <p>Students are not provided with any feedback on the diagnostic. Since we are using it to gauge the student's skills, we show some questions that are intentionally difficult to assess their needs. Students do not see their scores at the end, and every student earns a 100% score for a Quill Diagnostic exercise on the dashboard.</p>
            "
          },
          {
            question: "How do the colored scores work?",
            answer: "<p>Quill utilizes a stoplight system of green, yellow, and red scores. A green square indicates that the student scored 76-100%. A yellow square indicates the student scored 50-75%. A red square indicates that the student scored under 50%. A grey square indicates an uncompleted lesson.</p>"
          },
          {
            question: "Why are the Common Core lessons arranged into stages?",
            answer: "<p>The Common Core State Standards do not always map onto the development stages of students. For example, we have found that our 2nd grade CCSS materials are popular among middle schools. Relative pronouns, a 4th grade CCSS concept, are often taught in high schools. Using the word stage, instead of grade level, reinforces the concept that each student will learn grammar at her or his own pace.</p>"
          },
          {
            question: "How does Quill decide which grammar rules to teach?",
            answer: "<p>Quill follows the guidelines for grammar and style published in the Chicago Manual of Style. While other style guides are geared towards specific audiences and genres of writing, the Chicago Manual of Style is designed to support writers of all types. It’s also one of the most comprehensive and detailed style guides available, which is perfect for grammar lovers like us!</p>"
          },
          {
            question: "How does Quill address learning for English Language Learners?",
            answer: "<p>Quill provides a special diagnostic for ELL students. Our activities begin with the Common Core grade one concepts. We cover all of the basic grammatical concepts, such as subject-verb agreement and articles. We also feature a variety of activities focused on commonly confused words. All of our activities may be viewed at <a href='https://www.quill.org/activities'>https://www.quill.org/activities</a>.</p>"
          },
          {
            question: "How can Quill be used with tools for accessibility?",
            answer: "<p>Quill fully integrates with many extensions such as <a href='https://chrome.google.com/webstore/detail/read-aloud-a-text-to-spee/hdhinadidafjejdhmfkjgnolgimiaplp?hl=en'>ReadAloud</a> and <a href='https://chrome.google.com/webstore/detail/opendyslexic/cdnapgfjopgaggbmfgbiinmmbdcglnam?hl=en'>Open Dyslexic</a>. You can view a list of all the extensions that Quill works with <a href='https://support.quill.org/research-and-pedagogy/differentiation/free-extensions-for-students-with-modifications-iep-ell'>here</a>.</p>"
          }
        ]
      },
      {
        title: 'Technical Questions',
        faqs: [
          {
            question: "Why aren't activities loading?",
            answer: "<p>If you’re having trouble accessing Quill’s activities, your school is likely encountering some firewall issues when trying to access activities on Quill.org.</p>
                    <br />
                  <p>Firewall issues will generally need to be dealt with by your IT Department. We've written a brief text you can send them below. If it does not resolve your issues, please let us know.</p>
                  <br />
                  <blockquote>
                    <p>Hello,</p>
                    <br />
                    <p>Quill uses various subdomains, and Firebase to store data, so please whitelist *.quill.org as well as *.firebaseio.com.As of August 2016, Google has issued a new SSL certificate for all apps hosted by Firebase, causing issues with firewalls like FortiGate. AwesomeTable discovered this issue, and we've copied their explanation and solution below:The issue appears to be linked to the number of SANs in the certificate, which is almost a thousand. We don't know if Google is going to change something here.If you are a Fortinet user, you can enable/check \"Inspect All Ports\" in Policy & Objects > Policy > SSL/SSH Inspection > [your policy]. Explanation: when \"Inspect All Ports\" is DISABLED (you're scanning specific ports), the FortiGate's proxyworker process is doing the SSL Inspection. The proxyworker isn't able to handle all of those SANs. However, if \"Inspect All Ports\" is ENABLED, SSL Inspection gets offloaded to the IPS Module, which is able to handle that number of SANs just fine.Another solution is to write firewall rules to allow traffic with no certificate inspection for cdn.firebase.com (151.101.44.249), firebase.com and quill.org.You can test Firebase access here https://www.firebase.com/test.html</p>
                    <br />
                    <p>Thank you,</p>
                    <br />
                    <p>The Quill Engineering Team</p>
                  </blockquote>
                  <br />
                  <p>Credit to AwesomeTable for discovering the source of this complication.</p>
            "
          },
          {
            question: "What are Quill's technical requirements?",
            answer: "<p>Quill is built in HTML5, so it runs on all tablets, smartphones and modern browsers. Quill runs in Firefox, Chrome, Safari, and Internet Explorer 9, 10, and 11. Quill recommends that students have access to keyboards so that they can type their responses.</p>"
          },
          {
            question: "Can Quill be used on smartphones and tablets?",
            answer: "
              <p>Yes, Quill works on iPhones, Android devices and all tablets including Kindles. Students can start and finish their independent practice on any of these devices and they can follow along with your slides in the group mode.</p>
              <br />
              <p><span>Recommendation:</span> If students are using Quill on a tablet, for better typing we recommend using a keyboard with the tablet. We have seen that students perform better and type faster with a keyboard rather than a touchscreen.</p>
              <br />
              <p><em>Coming soon:</em> We are currently working on a mobile app that will allow students to do their homework or independent practice on their phone while offline and share their score with their teachers when they are back online.</p>
            "
          },
          {
            question: "What technologies is Quill built off of?",
            answer: "<p>The Quill LMS is built in Ruby on Rails. Our newer tools, including Quill Diagnostic and Quill Connect, were written in React.js, while Quill Grammar and Quill Proofreader were written in Angular.js. We make use of additional libraries and tools as needed, including Redux, TypeScript, Redis, Firebase, and Elasticsearch.</p>"
          },
          {
            question: "How can I get started with Quill?",
            answer: "<p>Teachers create teacher accounts and students create student accounts by clicking <a href='http://www.quill.org/account/new'>here</a>. Teachers are given a class code for each class. Students join their teacher's class by plugging in their teacher's class code. Teachers may also manually create accounts for their students. If you have a Google Classroom account, you can sign up with Google and import your students. For more information about getting started, please visit our <a href='https://www.quill.org/teacher_resources'>Teacher Resources</a> page. You can also download our <a href='https://d1yxac6hjodhgc.cloudfront.net/wp-content/uploads/2015/11/Quill-Getting-Started-Guide-for-Teachers.pdf'>Getting Started Guide for Teachers.</a></p>"
          },
        ]
      },
      {
        title: 'Organizational Questions',
        faqs: [
          {
            question: "Why is Quill a nonprofit organization?",
            answer: "<p>Quill's mission is to collaboratively build educational materials and make those materials freely available. We work with a large team of volunteers who spend their time on this project because they believe in this mission. We, in turn, have no interest in ever being purchased by another company or being sold on the stock market. While we are a commercial nonprofit, and intend to generate sustainable revenue, our mission is to revolutionize how students learn.</p>"
          },
          {
            question: "What are some other similar nonprofit organizations?",
            answer: "<p>In educational technology, the closest organization to our own is Reasoning Mind. Reasoning Mind is a nonprofit organization that charges a fee to use its mathematics software. Another similar nonprofit is EdX. EdX intends to create sustainable revenue by charging school systems for its services.</p>"
          },
          {
            question: "What does Open Source mean?",
            answer: "<p>Open Source means that all of our code is made freely available. You may download it and install it for free for any non-commercial purpose. Other developers may reuse our code in their programs. We build our code through GitHub, and you can see what we are working on at the moment <a href='https://github.com/empirical-org/quill/issues?state=open_'>here</a>.</p>"
          },
          {
            question: "What does Open Content mean?",
            answer: "<p>All of our instructional materials are made available under a Creative Commons BY-SA-NC license. This means that you may reuse our materials for any non-commercial purpose.</p>"
          },
          {
            question: "I have an idea or a suggestion for Quill. How an I share it?",
            answer: "
              <p>We are always looking for suggestions and ideas from our teachers to improve and grow Quill so if you have an idea that you would like to see on Quill, please fill out <a href='https://docs.google.com/forms/d/e/1FAIpQLScwoB67VKZicMzukzpiK5ufDFSEjLXbUBjEGOl_UMsRl02aiw/viewform?usp=send_form'>this short form</a> and share it with us. We have so far turned many of our teachers' ideas to products such as Quill Diagnostic and Quill Lessons, so don't hesitate to reach out to us.</p>
            "
          },
        ]
      },
      {
        title: 'Supporting Quill',
        faqs: [
          {
            question: "Can I donate to Quill?",
            answer: "<p>Yes, as a 501(c)3 charitable organization, you can make a tax deductible donation to us. Please email <a href='hello@quill.org'>hello@quill.org</a> for more information about this.</p>"
          },
          {
            question: "How can I work with Quill as an educator?",
            answer: "<p>We are always looking for educators who are interested in helping Quill by providing feedback, creating content, or giving us ideas for new apps. Please contact us at <a href='hello@quill.org'>hello@quill.org</a> if you would like to do any of these things.</p>"
          },
          {
            question: "How can I work with Quill as a developer?",
            answer: "<p>We are open source and can always use volunteer developers! Our Github is here: <a href='https://github.com/empirical-org'>https://github.com/empirical-org</a>.</p>"
          },
        ]
      }
    ]
  end

  def impact
  end

  def team
  end

  def tos
    @body_class = 'auxiliary white-page formatted-text'
  end

  def media_kit
  end

  def privacy
    @body_class = 'auxiliary white-page formatted-text'
  end

  def board
  end

  def diagnostic_tool
    @title = 'Quill Diagnostic - Free Diagnostic and Adaptive Lesson Plan'
    @description = 'Quickly determine which skills your students need to work on with our 22 question diagnostic.'
  end

  def grammar_tool
    @title = 'Quill Grammar - Free 10 Minute Activities for your Students'
    @description = 'Over 150 sentence writing activities to help your students practice basic grammar skills.'
  end

  def proofreader_tool
    @title = 'Quill Proofreader - Over 100 Expository Passages To Read And Edit'
    @description = 'Students edit passages and receive personalized exercises based on their results.'
  end

  def connect_tool
    @title = 'Quill Connect - Free Sentence Structure Activities'
    @description = 'Help your students advance from fragmented and run-on sentences to complex and well-structured sentences with Quill Connect.'
  end

  def lessons_tool
    @title = 'Quill Lessons - Free Group Writing Activities'
    @description = 'Lead whole-class and small group writing instruction with interactive writing prompts and discussion topics.'
  end

  def activities
    @body_class = 'full-width-page white-page'
    @section = if params[:section_id].present? then Section.find(params[:section_id]) else Section.first end
    @topics = @section.topics.map{ |topic| [topic, topic.activities.production] }.select{ |group| group.second.any? }
  end

  # for link to premium within 'about' (discover) pages
  def premium
    @user_is_eligible_for_new_subscription= current_user&.eligible_for_new_subscription?
    @user_is_eligible_for_trial = current_user&.subscriptions&.none?
    @user_belongs_to_school_that_has_paid = current_user&.school ? Subscription.school_or_user_has_ever_paid?(current_user&.school) : false
    @last_four = current_user&.last_four
  end

  def tutorials
  end

  def press
    @blog_posts = BlogPost.where(draft: false, topic: 'Press')
  end

  def announcements
    @blog_posts = BlogPost.where(draft: false, topic: 'Announcements')
  end


  private

  def determine_layout
    case action_name
    when 'home'
      'home'
    when 'home_new', 'diagnostic_tool', 'connect_tool', 'grammar_tool', 'proofreader_tool', 'lessons_tool'
      'twenty_seventeen_home'
    end
  end

  def determine_js_file
    case action_name
    when 'partners', 'mission', 'faq', 'impact', 'team', 'tos', 'media_kit', 'media', 'faq', 'privacy', 'premium', 'map', 'teacher_resources', 'news', 'stats', 'activities'
      @js_file = 'public'
    when 'grammar_tool', 'connect_tool', 'grammar_tool', 'proofreader_tool', 'lessons_tool'
      @js_file = 'tools'
    end
  end

  def determine_flag
    case action_name
    when 'grammar_tool', 'connect_tool', 'grammar_tool', 'proofreader_tool', 'lessons_tool'
      @beta_flag = current_user && current_user&.testing_flag == 'beta'
    end
  end

  def add_cards(list_response)
    list_response.each{|list| list["cards"] = HTTParty.get("https://api.trello.com/1/lists/#{list["id"]}/cards/?fields=name,url")}
    list_response
  end

end
