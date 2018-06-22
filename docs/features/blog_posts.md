# Blog Posts

Blog posts comprise the content of the Teacher Resources section of the website.

## Blog Post attributes

Blog posts have the following attributes, which are saved to the LMS database:

- `title`: string
    - displayed on both preview card and full blog post page
    - used as the title of the page itself.
- `body`: text
    - content of the blogpost, written in markdown
- `subtitle`: text
    - used as the description in the meta tag of the page
    - used in searches
    - used to prepopulate info on the preview card
- `read_count`: integer
    - number of page views for the blog post
- `topic`: string
    - the general category to which the article belongs; see the section below entitled 'Blog Post Topics'
- `draft`: boolean
    - whether or not the blog post is a draft (has not been published)
- `author_id`: integer
    - the identifier for the article's author as found in the LMS database `authors` table
- `preview_card_content`: text
    - content for the preview card, written in html
- `slug`: string
    - the last part of the blog post's url; the part that distinguishes the post
- `premium`: boolean
    - whether or not the blog post is only viewable by premium users
- `tsv`: tsvector
    - a search-optimized version of the post
- `published_at`: datetime
    - a datetime value set by a staff member to set the publish date for display
    - only set manually currently
    - can be backdated
- `external_link`: string
    - a link to an external website; if set, the preview card will link there instead of to the quill page for the blog post
- `center_images`: boolean
    - whether or not images in the blog post should be centered
- `order_number`: integer
    - the order in which the blog post will appear in its topic

## Blog Post Topics

Blog posts can belong to the following topics:

- Case Studies
- Teacher Stories
- Webinars
- Teacher Materials
- Education Research
- Announcements
- Support
- Best Practices
- Press


This list lives in the `blog_post.rb` model file in the LMS codebase, and can only be added to by a developer.

## CMS Blog Posts

See: [CMS Blog Posts](./cms_blog_posts.html)
