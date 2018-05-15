# CMS Blog Posts

The blog post CMS index is located at http://quill.org/cms/blog_posts. From here, you can create, edit, delete, and preview blog posts, as well as drag and drop them to reorder them within a given topic.

For more about blog posts, see [here](./blog_posts.html).

## Individual Blog Posts

The individual blog post editor can be located by either adding a new blog post or by clicking 'Edit' next to an individual blog post from the CMS blog post index page. It is populated with fields for the various attributes of the blog post.

### Preview Card Templates

There are six preview card templates to choose from when creating a new blog post or significantly altering the preview card of an existing one. They are as follows:

- Tiny Image
  - formatted to include a 300x90 image, as well as the blog post's title, description, and author or published_at date if present. a button can also be added.

- Medium Image
  - formatted to include a 300x138 image, as well as the blog post's title, description, and author or published_at date if present. a button can also be added.

- Large Image
  - formatted to include a 300x200 image, as well as the blog post's title, description, and author or published_at date if present. a button can also be added.

- Youtube Video
  - formatted to include a miniature version of the linked video, as well as the video's description and author or published_at date if present.

- Tweet
  - formatted to include a 300x135 image, as well as the content of the tweet, name of the twitter account, and author or published_at date if present.

- Custom HTML
  - completely editable html field.

Once selected, a preview card template form will populate with some prefilled data that should be changed for each blog post. Changes made are reflected in the card preview next to the form.

> NOTE: These fields are for ease of use, and their individual content is not persisted to the database. Instead, when the blog post is saved, the values entered are saved as the html content of the card itself. In order to later edit these values directly, the user will have to make changes to the HTML version of the card, or start over with a new template.

### Uploading Images

We are currently using React-Dropzone to support uploading images into blogposts. On the CMS blog post page, there is a square that an image can be dragged into, or clicked on to locate. Once inserted, the file is sent back to the LMS and saved as a record in the images table. We include the FileUploader, a Carrierwave uploader, in the image model file to save the image to an s3 bucket. Once saved, the controller will return json with the link to the hosted image and the user can copy and paste that link into an image tag in either the preview card content or the article content.
