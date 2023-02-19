import * as React from 'react';

const baseImageUrl = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/pages/dashboard/daily_tiny_tips`

const dailyTinyTips = [
  {
    title: 'Four Ways to use Quill Lessons',
    url: 'https://www.quill.org/teacher-center/4-ways-to-use-quill-lessons',
    imageSrc: `${baseImageUrl}/projector.svg`,
    imageAlt: 'Projector illustration'
  },
  {
    title: 'Helping Students Type Well',
    url: 'https://www.quill.org/teacher-center/tiny-tips-for-teachers-quill--helping-students-type-well',
    imageSrc: `${baseImageUrl}/keyboard.svg`,
    imageAlt: 'Laptop illustration'
  },
  {
    title: 'Using Quill Lessons as a Remote Resource',
    url: 'https://www.quill.org/teacher-center/tiny-tips-for-teachers-using-quill-lessons-as-a-remote-resource',
    imageSrc: `${baseImageUrl}/laptop.svg`,
    imageAlt: 'Laptop with a play button illustration'
  },
  {
    title: 'Using Quill as a Strategic Do Now',
    url: 'https://www.quill.org/teacher-center/tiny-tips-for-teachers-using-quill-as-a-lesson-related-launching-activity',
    imageSrc: `${baseImageUrl}/clock.svg`,
    imageAlt: 'Clock illustration'
  },
  {
    title: 'Encourage Replay for Improved Recall',
    url: 'https://www.quill.org/teacher-center/tiny-tips-for-teachers-encourage-replay-for-improved-recall',
    imageSrc: `${baseImageUrl}/button-click.svg`,
    imageAlt: 'Mouse cursor over an abstract button illustration'
  },
  {
    title: 'Pacing the Assignment of Diagnostic Recommendations',
    url: 'https://www.quill.org/teacher-center/tiny-tips-for-teachers-pacing-the-assignment-of-diagnostic-recommendations',
    imageSrc: `${baseImageUrl}/tactic.svg`,
    imageAlt: 'Circle moving past two x shapes illustration'
  },
  {
    title: 'Grading at the Concept Level',
    url: 'https://www.quill.org/teacher-center/tiny-tips-for-teachers-grading-at-the-concept-level',
    imageSrc: `${baseImageUrl}/graded-lines.svg`,
    imageAlt: 'Abstract lines being graded illustration'
  },
  {
    title: 'Using Quill for help with Thesis Statements',
    url: 'https://www.quill.org/teacher-center/tiny-tips-for-teachers-using-quill-for-help-with-thesis-statements',
    imageSrc: `${baseImageUrl}/scroll.svg`,
    imageAlt: 'Scroll illustration'
  },
  {
    title: 'Modeling with Quill',
    url: 'https://www.quill.org/teacher-center/tiny-tips-for-teachers-modeling--thinking-aloud-with-quill',
    imageSrc: `${baseImageUrl}/single-eye.svg`,
    imageAlt: 'Single eye illustration'
  },
  {
    title: 'Naming Packs to Signal Purpose',
    url: 'https://www.quill.org/teacher-center/tiny-tips-for-teachers-naming-packs-to-signal-purpose',
    imageSrc: `${baseImageUrl}/luggage-tag.svg`,
    imageAlt: 'Luggage tag illustration'
  },
  {
    title: '5 Ways to Wrap up the School Year with Quill',
    url: 'https://www.quill.org/teacher-center/tiny-tips-for-teachers-5-ways-to-wrap-up-the-school-year-with-quill',
    imageSrc: `${baseImageUrl}/school-building.svg`,
    imageAlt: 'School building illustration'
  },
  {
    title: 'Setting Up Remote Routines with Quill',
    url: 'https://www.quill.org/teacher-center/teacher-toolbox-setting-up-remote-routines-with-quill',
    imageSrc: `${baseImageUrl}/calendar-plus.svg`,
    imageAlt: 'Calendar with a plus button illustration'
  },
]

function dailyTip() {
  const now = new Date(Date.now()); // equivalent to just `new Date()` and easier to stub for tests
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return dailyTinyTips[day % dailyTinyTips.length]
}

const DailyTinyTip = () => {
  const tip = dailyTip()
  return (
    <section className="daily-tiny-tip">
      <h2>Daily tiny tip</h2>
      <a className="focus-on-light" href={tip.url} rel="noopener noreferrer" target="_blank">
        <span>{tip.title}</span>
        <img alt={tip.imageAlt} src={tip.imageSrc} />
      </a>
    </section>
  )
}

export default DailyTinyTip
