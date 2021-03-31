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

const PremiumFeature = ({ imageSrc, imageAlt, header, text, popular}) => (
  <div className="premium-feature">
    <div className="image-wrapper">
      <img alt={imageAlt} src={imageSrc} />
      {popular && <span className="popular-tag">Popular</span>}
    </div>
    <h4>{header}</h4>
    <p>{text}</p>
  </div>
)

const actionableFeaturesAndSupport = (
  <section>
    <h3>Actionable features and support</h3>
    <div className="premium-features-row">
      <PremiumFeature
        header="Teacher reports"
        imageAlt="TODO"
        imageSrc={teacherReportsSrc}
        text="Access each classroom’s Quill Premium reports. Print and download progress reports on concepts and standards mastered."
      />
      <PremiumFeature
        header="School administrator dashboard"
        imageAlt="TODO"
        imageSrc={schoolDashboardSrc}
        text="Access each teacher’s Premium account to assign activities, manage rosters and view data. Access school-level reports to see rolled up data at the school level."
      />
      <PremiumFeature
        header="School-wide educator support"
        imageAlt="TODO"
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
        imageAlt="TODO"
        imageSrc={studentCompletingDiagnosticSrc}
        popular={true}
        text="Explore best practices for strategically incorporating the diagnostic recommendations to support student writing goals while also learning how to create supportive learning structures where students feel empowered."
      />
      <PremiumFeature
        header="Backwards planning"
        imageAlt="TODO"
        imageSrc={backwardsPlanningSrc}
        popular={true}
        text="Leaning on key tenets from Writing for Understanding, teachers will unpack the knowledge and understanding required in an upcoming writing assignment and then strategically embed Quill activities into their unit plan to help students achieve the assignment's writing goals."
      />
      <PremiumFeature
        header="Data reporting & student work"
        imageAlt="TODO"
        imageSrc={premiumReportLaptopSrc}
        text="We apply a research-based cycle of data inquiry to Quill's student data reports. Time will be dedicated for teachers to independently analyze their Quill data thus far and, together, explore how their findings can inform future instructional decisions and strategies."
      />
      <PremiumFeature
        header="Quill Lessons implementation tips"
        imageAlt="TODO"
        imageSrc={quillLessonsTeacherSrc}
        text="Quill Lessons is our interactive writing tool that helps teachers lead students through live grammar lessons. In this session, we explore various implementation ideas, as well as tips and guidance, to allow teachers to get the most out of this feature-packed tool."
      />
      <PremiumFeature
        header="Whole group discussion"
        imageAlt="TODO"
        imageSrc={studentsHelpingEachOtherSrc}
        text="This session explores the conditions necessary for skills to transfer from the Quill platform to authentic writing. We consider strategies that use whole group micro-discussions to support this transfer."
      />
      <PremiumFeature
        header="Supporting English Language Learners"
        imageAlt="TODO"
        imageSrc={englishLanguageLearnSrc}
        text="Explore Quill’s content created specifically for English Language Learners and learn  strategies to utilize these resources to support students’ written language acquisition."
      />
      <PremiumFeature
        header="Supporting students with IEPs"
        imageAlt="TODO"
        imageSrc={studentTeacherSignLanguageSrc}
        text="Learn how to make modifications to Quill’s learning plans for your students with IEPs,  provide targeted support, and track students’ growth and progress."
      />
      <PremiumFeature
        header="Improving sentence fluency"
        imageAlt="TODO"
        imageSrc={studentTeacherWritingSrc}
        text="Explore ways to expand the work students do on the Quill platform to improve their sentence fluency in their writing beyond Quill."
      />
      <PremiumFeature
        header="Empowering student writers"
        imageAlt="TODO"
        imageSrc={studentHighlightedSrc}
        text="Explore various ways to encourage an increase in students’ writing self-efficacy using Quill’s tools, beyond extrinsic carrot and stick approaches."
      />
    </div>
  </section>
)

const SchoolPremium = () => {
  return(
    <div className='container premium-features school text-center' id="school-premium">
      <section className='premium-features-header'>
        <div className="img-holder">
          <img alt="Presentation board" src={blueSchoolCircleSrc} />
        </div>
        <h1>School and District Premium</h1>
        <p>We offer School Premium site licenses that provide access for all teachers at a school to both our free and teacher premium features. In addition, we offer school-wide professional development, administrative oversight and reporting, and individualized, ongoing support from our School Partnerships team.</p>
      </section>
      <div className='premium-features-body'>
        {actionableFeaturesAndSupport}
        {professionalDevelopmentSessions}
      </div>
    </div>
  );
};

export default SchoolPremium;

SchoolPremium.displayName = 'SchoolPremium'
