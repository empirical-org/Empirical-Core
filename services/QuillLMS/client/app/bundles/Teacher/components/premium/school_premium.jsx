import React from 'react'

const baseImageLink = `${process.env.CDN_URL}/images/pages/premium`

const blueSchoolCircleSrc = `${baseImageLink}/illustrations-blue-school-circle.svg`

const teacherReportsSrc = `${baseImageLink}/illustrations-teacher-reports.svg`
const schoolDashboardSrc = `${baseImageLink}/illustrations-school-dashboard.svg`
const schoolSupportSrc = `${baseImageLink}/illustrations-school-support.svg`

const studentCompletingDiagnosticSrc = `${baseImageLink}/student-completing-diagnostic.webp`
const backwardsPlanningSrc = `${baseImageLink}/backwards-planning-book.webp`
const premiumReportLaptopSrc = `${baseImageLink}/premium-report-laptop.webp`

const erikaSrc = `${baseImageLink}/coach-erika.webp`
const shannonSrc = `${baseImageLink}/coach-shannon.webp`
const sherrySrc = `${baseImageLink}/coach-sherry.webp`

const PremiumFeature = ({ imageSrc, imageAlt, header, text, popular, subheader, }) => (
  <div className="premium-feature">
    <div className="image-wrapper">
      <img alt={imageAlt} src={imageSrc} />
      {popular && <div className="popular-tag"><span className="popular-tag-background" /><span className="popular-tag-text">Popular</span></div>}
    </div>
    <h4>{header}</h4>
    {subheader}
    <p>{text}</p>
  </div>
)

const TopicExplored = ({color, imgSrc, imgAlt, text}) => (
  <div className="topic-explored" style={{color: color}}>
    <img alt={imgAlt} src={imgSrc} />
    <p>{text}</p>
  </div>
)

const actionableFeaturesAndSupport = (
  <section>
    <h3>Actionable features and support</h3>
    <div className="premium-features-row">
      <PremiumFeature
        header="Teacher reports"
        imageAlt="Example dashboard showing multiple teacher reports"
        imageSrc={teacherReportsSrc}
        text="Access each classroom’s Quill Premium reports. Print and download progress reports on concepts and standards mastered."
      />
      <PremiumFeature
        header="School administrator dashboard"
        imageAlt="Example admin dashboard showing multiple teacher dashboards with student results"
        imageSrc={schoolDashboardSrc}
        text="Access each teacher’s Premium account to assign activities, manage rosters and view data. Access school-level reports to see rolled up data at the school level."
      />
      <PremiumFeature
        header="School-wide educator support"
        imageAlt="A school with a person giving a presentation and another person teaching"
        imageSrc={schoolSupportSrc}
        text="Access customized training and professional development webinars, instructional coaching sessions, and individualized reporting, all provided by our dedicated School Partnerships team."
      />
    </div>
  </section>
)

const professionalDevelopmentSessions = (
  <section>
    <h3>Professional development sessions</h3>
    <p>Quill Premium for schools and districts includes live virtual workshop-style training and an asynchronous course library.</p>
    <div className="premium-features-row">
      <PremiumFeature
        imageAlt="A student focusing on his laptop while working on Quill Diagnostic"
        imageSrc={studentCompletingDiagnosticSrc}
        popular={true}
        text="Flexible and comprehensive training that fits your schedule with virtual and on-demand formats"
      />
      <PremiumFeature
        imageAlt="A photograph of the book, Writing for Understanding"
        imageSrc={backwardsPlanningSrc}
        popular={true}
        text="A focus on instructional best practices and practical application with workshop-style training"
      />
      <PremiumFeature
        imageAlt="A person typing on a laptop with a Quill Premium report on the screen"
        imageSrc={premiumReportLaptopSrc}
        text="Support for educators that strengthens both pedagogical and Quill skills"
      />
    </div>
  </section>
)

const topicsExplored = (
  <section>
    <h3>What are some topics explored?</h3>
    <TopicExplored color="#4D8DD9" imgAlt="" imgSrc="" text="Supporting English language learners" />
    <TopicExplored color="#AD277B" imgAlt="" imgSrc="" text="Supporting exceptional learners" />
    <TopicExplored color="#2C7F9B" imgAlt="" imgSrc="" text="Data instruction" />
    <TopicExplored color="#DF9E3D" imgAlt="" imgSrc="" text="Improving sentence fluency" />
    <TopicExplored color="#EB4F47" imgAlt="" imgSrc="" text="Backward planning" />
    <TopicExplored color="#06806B" imgAlt="" imgSrc="" text="Leveraging Quill's tools and activities" />
    <TopicExplored color="#C04500" imgAlt="" imgSrc="" text="Impactful feedback practices" />
    <TopicExplored color="#9035D6" imgAlt="" imgSrc="" text="Empowering student writers" />
  </section>
)

const coachingSessions = (
  <section>
    <h3>One-on-one coaching sessions with our Senior Instructional Coaches</h3>
    <p>Once per quarter, teachers are invited to schedule 1:1 coaching sessions to work directly with a senior instructional coach on Quill&apos;s team. These sessions enable teachers to solve issues and understand reports. The coach and the teacher are looking at the Quill dashboard and leave the coaching session with more confidence in the tool.</p>
  </section>
)

const testimonials = (
  <section>
    <div className="premium-features-row">
      <div className="testimonial long">
        <p>Totally personalized! I told the Quill coach my background and what my familiarity with Quill was, and she was able to walk me through exactly what I needed. Also appreciate that she could show me with her screen, walking through my classes with me.</p>
        <span>Teacher, Glacier View Junior High School</span>
      </div>
      <div className="testimonial">
        <p>I appreciated the time given to analyze our own data while in the training.</p>
        <span>Teacher, Meeting Street Elementary at Burns</span>
      </div>
      <div className="testimonial">
        <p>Our Quill coach is a really engaging facilitator! I appreciated her expertise and the built-in work time.</p>
        <span>Director of Academics, Thurgood Marshall</span>
      </div>
      <div className="testimonial">
        <p>I appreciated the facilitator&#39;s responsiveness to the needs specific to our network. I also appreciate the thoughtfulness of applying Quill remotely.</p>
        <span>Administrator, Mastery Charter Schools</span>
      </div>
      <div className="testimonial">
        <p>Our Quill coach was very knowledgeable and friendly. I felt as though I could ask her anything and there would be no judgement!!</p>
        <span>Teacher, Union High School</span>
      </div>
    </div>
  </section>
)

const coachingTeam = (
  <section>
    <h3>Meet the professional learning team</h3>
    <div className="premium-features-row">
      <PremiumFeature
        header="Erika Parker-Havens"
        imageAlt="Photograph of Quill's coach, Erika"
        imageSrc={erikaSrc}
        subheader={[<span key="years">15+ years in Education</span>, <span key="title">Former MS English teacher and Academic Dean</span>]}
        text="Expert in culturally responsive teaching practices, writing in the content areas and helping teachers practically use tools to facilitate learning through writing"
      />
      <PremiumFeature
        header="Shannon Browne"
        imageAlt="Photograph of Quill's coach, Shannon"
        imageSrc={shannonSrc}
        subheader={[<span key="years">15+ years in Education</span>, <span key="title">Former HS English Teacher and Director of Instruction</span>]}
        text="Expert in data-informed instructional strategies and prioritizing the needs of special populations in writing practice routines"
      />
      <PremiumFeature
        header="Sherry Lewkowicz"
        imageAlt="Photograph of Quill's coach, Sherry"
        imageSrc={sherrySrc}
        subheader={[<span key="years">15+ years in Education</span>, <span key="title">Former AP English Literature teacher</span>]}
        text="Expert in writing instruction best practices and helping teachers incorporate those best practices into their teaching"
      />
    </div>
  </section>
)

const SchoolPremium = () => {
  return(
    <div className='container premium-features school text-center' id="school-premium">
      <section className='premium-features-header'>
        <div className="img-holder">
          <img alt="Illustration of a blue and gray school with a blue flag" src={blueSchoolCircleSrc} />
        </div>
        <h1>School and District Premium</h1>
        <p>We offer School Premium site licenses that provide access for all teachers at a school to both our free and teacher premium features. In addition, we offer school-wide professional development, administrative oversight and reporting, and individualized, ongoing support from our School Partnerships team.</p>
      </section>
      <div className='premium-features-body'>
        {actionableFeaturesAndSupport}
        {professionalDevelopmentSessions}
        {topicsExplored}
        {coachingSessions}
        {testimonials}
        {coachingTeam}
      </div>
    </div>
  );
};

export default SchoolPremium;

SchoolPremium.displayName = 'SchoolPremium'
