import React from 'react'

const baseImageLink = `${process.env.CDN_URL}/images/pages/premium`

const blueSchoolCircleSrc = `${baseImageLink}/illustrations-blue-school-circle.svg`

const teacherReportsSrc = `${baseImageLink}/illustrations-teacher-reports.svg`
const schoolDashboardSrc = `${baseImageLink}/illustrations-school-dashboard.svg`
const schoolSupportSrc = `${baseImageLink}/illustrations-school-support.svg`

const studentCompletingDiagnosticSrc = `${baseImageLink}/student-completing-diagnostic@2x.png`
const backwardsPlanningSrc = `${baseImageLink}/backwards-planning-book@2x.png`
const premiumReportLaptopSrc = `${baseImageLink}/premium-report-laptop@2x.png`
const quillLessonsTeacherSrc = `${baseImageLink}/quill-lessons-teacher@2x.png`
const studentsHelpingEachOtherSrc = `${baseImageLink}/students-helping-each-other@2x.png`
const englishLanguageLearnSrc = `${baseImageLink}/english-language-learner-with-laptop@2x.png`
const studentTeacherSignLanguageSrc = `${baseImageLink}/student-teacher-sign-language@2x.png`
const studentTeacherWritingSrc = `${baseImageLink}/student-teacher-writing@2x.png`
const studentHighlightedSrc = `${baseImageLink}/student-highlighted@2x.png`

const erikaSrc = `${baseImageLink}/coach-erika@2x.png`
const shannonSrc = `${baseImageLink}/coach-shannon@2x.png`
const sherrySrc = `${baseImageLink}/coach-sherry@2x.png`

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
    <p>Quill Premium for schools includes two professional development sessions per year selected by the school. Schools may purchase additional sessions.</p>
    <div className="premium-features-row">
      <PremiumFeature
        header="Leveraging Quill Diagnostics"
        imageAlt="A student focusing on his laptop while working on Quill Diagnostic"
        imageSrc={studentCompletingDiagnosticSrc}
        popular={true}
        text="Explore best practices for strategically incorporating the diagnostic recommendations to support student writing goals while also learning how to create supportive learning structures where students feel empowered."
      />
      <PremiumFeature
        header="Backwards planning"
        imageAlt="A photograph of the book, Writing for Understanding"
        imageSrc={backwardsPlanningSrc}
        popular={true}
        text="Leaning on key tenets from Writing for Understanding, teachers will unpack the knowledge and understanding required in an upcoming writing assignment and then strategically embed Quill activities into their unit plan to help students achieve the assignment's writing goals."
      />
      <PremiumFeature
        header="Data reporting & student work"
        imageAlt="A person typing on a laptop with a Quill Premium report on the screen"
        imageSrc={premiumReportLaptopSrc}
        text="We apply a research-based cycle of data inquiry to Quill's student data reports. Time will be dedicated for teachers to independently analyze their Quill data thus far and, together, explore how their findings can inform future instructional decisions and strategies."
      />
      <PremiumFeature
        header="Quill Lessons implementation tips"
        imageAlt="Arrows pointing to a teacher presenting a Quill Lesson"
        imageSrc={quillLessonsTeacherSrc}
        text="Quill Lessons is our interactive writing tool that helps teachers lead students through live grammar lessons. In this session, we explore various implementation ideas, as well as tips and guidance, to allow teachers to get the most out of this feature-packed tool."
      />
      <PremiumFeature
        header="Whole group discussion"
        imageAlt="Two students helping each other on one laptop"
        imageSrc={studentsHelpingEachOtherSrc}
        text="This session explores the conditions necessary for skills to transfer from the Quill platform to authentic writing. We consider strategies that use whole group micro-discussions to support this transfer."
      />
      <PremiumFeature
        header="Supporting English Language Learners"
        imageAlt="An ELL student typing on a laptop"
        imageSrc={englishLanguageLearnSrc}
        text="Explore Quill’s content created specifically for English Language Learners and learn  strategies to utilize these resources to support students’ written language acquisition."
      />
      <PremiumFeature
        header="Supporting students with IEPs"
        imageAlt="A teacher and a student practicing sign language"
        imageSrc={studentTeacherSignLanguageSrc}
        text="Learn how to make modifications to Quill’s learning plans for your students with IEPs,  provide targeted support, and track students’ growth and progress."
      />
      <PremiumFeature
        header="Improving sentence fluency"
        imageAlt="A teacher pointing to a student's paper while the student writes"
        imageSrc={studentTeacherWritingSrc}
        text="Explore ways to expand the work students do on the Quill platform to improve their sentence fluency in their writing beyond Quill."
      />
      <PremiumFeature
        header="Empowering student writers"
        imageAlt="A student smiling"
        imageSrc={studentHighlightedSrc}
        text="Explore various ways to encourage an increase in students’ writing self-efficacy using Quill’s tools, beyond extrinsic carrot and stick approaches."
      />
    </div>
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
        {testimonials}
        {coachingTeam}
      </div>
    </div>
  );
};

export default SchoolPremium;

SchoolPremium.displayName = 'SchoolPremium'
