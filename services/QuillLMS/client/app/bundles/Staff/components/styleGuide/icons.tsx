import * as React from "react";

const baseImgSrc = `${process.env.CDN_URL}/images/icons`

const iconGroups = [
  {
    path: 'xl',
    title: 'XL (Extra Large / 96x96)',
    icons: [
      { path: "book-empty.svg" },
      { path: "clipboard.svg" },
      { path: "comment-document.svg" },
      { path: "diagnostic.svg" },
      { path: "diamond-in-hand.svg" },
      { path: "evidence-handbook.svg" },
      { path: "fountain-pen.svg" },
      { path: "global-education.svg" },
      { path: "lecture-hall.svg" },
      { path: "list.svg" },
      { path: "pencil.svg" },
      { path: "research-books.svg" },
      { path: "retry-pencil.svg" },
      { path: "search-document.svg" },
      { path: "search-empty.svg" },
      { path: "success.svg" },
      { path: "time-in-hand.svg" }
    ]
  },
  {
    path: 'l',
    title: 'L (Large / 64x64)',
    icons: [
      { path: "activity-library.svg" },
      { path: "activity-packs.svg" },
      { path: "add-students.svg" },
      { path: "ai.svg" },
      { path: "ap.svg" },
      { path: "archive.svg" },
      { path: "assign-activities.svg" },
      { path: "assigned-activities.svg" },
      { path: "business-building.svg" },
      { path: "diagnostics-all.svg" },
      { path: "earth.svg" },
      { path: "email.svg" },
      { path: "globe.svg" },
      { path: "graduation-cap.svg" },
      { path: "home-building.svg" },
      { path: "join-link.svg" },
      { path: "map-search.svg" },
      { path: "packs-independent.svg" },
      { path: "packs-whole.svg" },
      { path: "pre-ap.svg" },
      { path: "premium.svg" },
      { path: "quill.svg" },
      { path: "referral-gift.svg" },
      { path: "school-building.svg" },
      { path: "school-campus.svg" },
      { path: "scroll.svg" },
      { path: "share-activity-pack.svg" },
      { path: "share-activity.svg" },
      { path: "ship.svg" },
      { path: "springboard.svg" },
      { path: "student-accounts.svg" },
      { path: "student-pencil.svg" },
      { path: "student.svg" },
      { path: "teacher-chalkboard.svg" },
      { path: "teacher-presentation.svg" },
      { path: "view-student.svg" }
    ]
  },
  {
    path: 'sm',
    title: 'SM (Small-Medium / 48x48)',
    icons: [
      { path: "ai.svg" },
      { path: "bulb-alt.svg" },
      { path: "globe.svg" },
      { path: "revise.svg" },
      { path: "success.svg" },
      { path: "tool-connect-bordered.svg" },
      { path: "tool-diagnostic-bordered.svg" },
      { path: "tool-evidence-bordered.svg" },
      { path: "tool-grammar-bordered.svg" },
      { path: "tool-lessons-bordered.svg" },
      { path: "tool-proofreader-bordered.svg" }
    ]
  },
  {
    path: 's',
    title: 'S (Small 24x24)',
    icons: [
      { path: "account-add.svg" },
      { path: "account-group.svg" },
      { path: "account-multiple-check-outlined.svg" },
      { path: "account-multiple-check.svg" },
      { path: "account-view.svg" },
      { path: "account.svg" },
      { path: "add-fill.svg" },
      { path: "ai.svg" },
      { path: "archive.svg" },
      { path: "arrow-back.svg" },
      { path: "avatar.svg" },
      { path: "bar-chart.svg" },
      { path: "bookmark-fill.svg" },
      { path: "bookmark-outline.svg" },
      { path: "canvas-color.svg" },
      { path: "canvas.svg" },
      { path: "card-text.svg" },
      { path: "check-contained-dark.svg" },
      { path: "check-contained.svg" },
      { path: "check.svg" },
      { path: "checkbox-multi.svg" },
      { path: "clever-alt.svg" },
      { path: "clever-color.svg" },
      { path: "clever.svg" },
      { path: "clipboard-check.svg" },
      { path: "clipboard-common-core.svg" },
      { path: "clipboard-concepts.svg" },
      { path: "clipboard.svg" },
      { path: "clock.svg" },
      { path: "close-1.svg" },
      { path: "close-alt-1.svg" },
      { path: "close-alt-2.svg" },
      { path: "close-white.svg" },
      { path: "close.svg" },
      { path: "collapse.svg" },
      { path: "comment-account.svg" },
      { path: "compass.svg" },
      { path: "continue-gold.svg" },
      { path: "continue.svg" },
      { path: "correct.svg" },
      { path: "diamond-alt.svg" },
      { path: "direction.svg" },
      { path: "email.svg" },
      { path: "exclamation-circle.svg" },
      { path: "expand.svg" },
      { path: "eye-slash.svg" },
      { path: "eye.svg" },
      { path: "file-chart.svg" },
      { path: "file-document.svg" },
      { path: "file-download.svg" },
      { path: "filter.svg" },
      { path: "folder.svg" },
      { path: "gift.svg" },
      { path: "glasses.svg" },
      { path: "globe.svg" },
      { path: "google-classroom-color.svg" },
      { path: "google-classroom.svg" },
      { path: "google-color.svg" },
      { path: "indeterminate-spinner-grey.svg" },
      { path: "indeterminate-spinner-white.svg" },
      { path: "information.svg" },
      { path: "language.svg" },
      { path: "laptop-glyph.svg" },
      { path: "lightbulb.svg" },
      { path: "lock.svg" },
      { path: "logout.svg" },
      { path: "map-search.svg" },
      { path: "menu-white.svg" },
      { path: "more-horizontal.svg" },
      { path: "multiple-choice.svg" },
      { path: "open.svg" },
      { path: "pencil.svg" },
      { path: "play-box.svg" },
      { path: "pointing-arrow-left.svg" },
      { path: "premium-diamond.svg" },
      { path: "press.svg" },
      { path: "preview.svg" },
      { path: "question-mark.svg" },
      { path: "quill medal.svg" },
      { path: "quill.svg" },
      { path: "remove.svg" },
      { path: "rename.svg" },
      { path: "reorder.svg" },
      { path: "review-correct.svg" },
      { path: "review-incorrect.svg" },
      { path: "review-not-necessary.svg" },
      { path: "revise-gold.svg" },
      { path: "revise.svg" },
      { path: "school.svg" },
      { path: "search-1.svg" },
      { path: "search.svg" },
      { path: "settings-large.svg" },
      { path: "settings.svg" },
      { path: "share.svg" },
      { path: "social-facebook.svg" },
      { path: "social-instagram.svg" },
      { path: "social-twitter.svg" },
      { path: "sort.svg" },
      { path: "speaker.svg" },
      { path: "standards.svg" },
      { path: "star.svg" },
      { path: "students.svg" },
      { path: "table-account.svg" },
      { path: "table-check.svg" },
      { path: "teacher-account-view.svg" },
      { path: "teacher-pointing-gold.svg" },
      { path: "teacher.svg" },
      { path: "tool-connect-color.svg" },
      { path: "tool-connect-white.svg" },
      { path: "tool-connect.svg" },
      { path: "tool-diagnostic-color.svg" },
      { path: "tool-diagnostic-white.svg" },
      { path: "tool-diagnostic.svg" },
      { path: "tool-evidence-color.svg" },
      { path: "tool-evidence-white.svg" },
      { path: "tool-evidence.svg" },
      { path: "tool-grammar-color.svg" },
      { path: "tool-grammar-white.svg" },
      { path: "tool-grammar.svg" },
      { path: "tool-lessons-color.svg" },
      { path: "tool-lessons-white.svg" },
      { path: "tool-lessons.svg" },
      { path: "tool-proofreader-color.svg" },
      { path: "tool-proofreader-white.svg" },
      { path: "tool-proofreader.svg" },
      { path: "trash.svg" },
      { path: "warning.svg" }
    ]
  },
  {
    path: 'xs',
    title: 'XS (Extra Small / 16x16)',
    icons: [
      { path: "arrow.svg" },
      { path: "account-green.svg" },
      { path: "asterisk.svg" },
      { path: "bar-graph-increasing.svg" },
      { path: "calendar-date.svg" },
      { path: "card-multiple.svg" },
      { path: "check-circle.svg" },
      { path: "check-small.svg" },
      { path: "check-small-white.svg" },
      { path: "chevron-left.svg" },
      { path: "clear-enabled.svg" },
      { path: "clear-enabled-black.svg" },
      { path: "dash-black.svg" },
      { path: "dash-white.svg" },
      { path: "description-ccss.svg" },
      { path: "description-concept.svg" },
      { path: "description-copyright.svg" },
      { path: "description-diagnostic.svg" },
      { path: "description-information.svg" },
      { path: "description-lessons.svg" },
      { path: "description-proofreader.svg" },
      { path: "description-readability.svg" },
      { path: "description-tool-connect/medium.svg" },
      { path: "description-tool-connect/small.svg" },
      { path: "description-tool-grammar.svg" },
      { path: "description-topic.svg" },
      { path: "dropdown-white.svg" },
      { path: "dropdown.svg" },
      { path: "dropup.svg" },
      { path: "help-white.svg" },
      { path: "help.svg" },
      { path: "incorrect.svg" },
      { path: "information-circle-gold.svg" },
      { path: "information.svg" },
      { path: "lightbulb.svg" },
      { path: "locked.svg" },
      { path: "open-in-new.svg" },
      { path: "placeholder.svg" },
      { path: "pointing-hand.svg" },
      { path: "premium-icon.svg" },
      { path: "remove.svg" },
      { path: "return-arrow.svg" },
      { path: "revise-gold.svg" },
      { path: "star-white.svg" },
      { path: "star-green.svg" },
      { path: "swap-vertical.svg" },
      { path: "triangle-up-green.svg" },
      { path: "triangle-up-light-green.svg" },
      { path: "user-multiple.svg" },
      { path: "wrench.svg" }
    ]
  },
  {
    path: '2xs',
    title: '2XS (Extra Extra Small / 8x8)',
    icons: [
      { path: "proficiency-circle/maintained-proficiency.svg" },
      { path: "proficiency-circle/no-proficiency.svg" },
      { path: "proficiency-circle/partial-proficiency.svg" },
      { path: "proficiency-circle/proficient.svg" },
      { path: "social-media/facebook.svg" },
      { path: "social-media/instagram.svg" },
      { path: "social-media/twitter.svg" }
    ]
  }
]

const IconDisplay = ({ title, icons, groupPath }) => {
  const iconElements = icons.map(icon => {
    const fullPath = `${baseImgSrc}/${groupPath}/${icon.path}`
    return (
      <div className="icon-item" key={icon.path}>
        <div>
          <img alt="" src={fullPath} />
        </div>
        <code>/{groupPath}/{icon.path}</code>
      </div>
    )
  })

  return (
    <div className="element-container">
      <h4>{title}</h4>
      <div className={`icon-list ${groupPath}`}>
        {iconElements}
      </div>
    </div>
  );
};

const IconGallery = () => {
  return (
    <div id="icons">
      <h2 className="style-guide-h2">Icons</h2>
      <p>All paths follow: <code>{process.env.CDN_URL}/images/icons</code></p>
      <p>If you need to change the color of an image for use in a design, rather than downloading a new version of the image, please use a <a href="https://codepen.io/sosuke/pen/Pjoqqp" rel="noopener noreferrer" target="_blank">CSS filter generator</a> to apply via CSS and make a mixin for that filter in the variables file if it doesn't already exist. See: <code>@mixin quill-green-filter</code></p>
      {iconGroups.map(iconGroup => (
        <IconDisplay groupPath={iconGroup.path} icons={iconGroup.icons} key={iconGroup.path} title={iconGroup.title} />
      ))}
    </div>
  );
};

export default IconGallery;
