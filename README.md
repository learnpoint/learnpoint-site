## Development Environment Set Up

1. [Install Deno](https://docs.deno.com/runtime/manual/getting_started/installation) `v1.46.3` or later.

2. [Create a fork](https://github.com/learnpoint/learnpoint-site/fork). Make sure to create the fork in your personal GitHub account, not in the Learnpoint organisation.

3. On GitHub, navigate to the new fork you just created, and create a new branch named `dev`.

4. On GitHub, make the new branch `dev` the default branch.

5. Open a terminal and move into an appropriate folder.

6. Clone the fork into the folder. Should be something like this:

        git clone https://github.com/GITHUB-USERNAME/learnpoint-site.git

7. Move into the cloned fork:

        cd learnpoint-site

8. Checkout the `dev` branch:

        git checkout dev

9. Add upstream repo to your fork:

        git remote add upstream https://github.com/learnpoint/learnpoint-site.git

10. Verify upstream was added. This command should not give any errors:

        git remote show upstream



## Optional: Deploy Your Fork to Netlify

Deploying your fork to Netlify is optional, but highly recommended.

1. [Sign up to Netlify](https://app.netlify.com/signup) using your GitHub account.

2. Deploy your fork to Netlify:
    - Navigate to the `Sites` page on Netlify.
    - Click the button `Add new site` and select `Import existing project`.
    - Click the button `GitHub`.
    - Click the repository (fork) that you just created.
    - In the `Branch to deploy` drop-down, select `dev`.
    - In the `Publish directory` textbox, type `docs`.
    - Keep everything else empty.
    - Click the button `Deploy site`.

3. Verify that your Netlify site is working:
    - Navigate to the `Sites` page on Netlify.
    - Click on the site that you just created.
    - Click on the deployment-link close to the top of the page.
    - You should now be navigated to your deployed site.

4. Whenever you want to show or discuss your work, just share the link to your Netlify site. The site should be automatically updated when you push commits to your fork (with some seconds of delay).



## Development Workflow

1. Start the dev server with default port (3333):

        deno task dev

     or specify custom port:

        deno task dev [port]

2. Open the site at `http://localhost:3333` (or with specified port)

3. Write all your changes to the `src` folder. You should never make any changes to the `docs` folder.

4. If there are any file mismatches, or build problems, it's perfectly safe to:
    1. Stop the dev server: `Ctrl + C`.
    2. Completely delete the ```docs``` folder.
    3. Restart the dev server: `deno task dev` (this will rebuild the `docs` folder).

5. When done, stop the server:

        Ctrl + C

6. Commit and push to your fork.

7. Verify that your changes are deployed to your Netlify site.



## Keeping Your Fork Up To Date

1. Make sure that you're on the `dev` branch on your fork.

2. Commit and push all your changes.

3. Fetch upstream changes:

        git fetch upstream

4. Merge upstream to your fork:

        git merge upstream/master

5. Push the changes:

        git push



## Make A Pull Request When Done

1. Make sure that you're on the `dev` branch on your fork.
2. Commit and push all your changes.
3. Navigate to your fork on GitHub.
4. Find and click the button `Create pull request`.



## Languages

* Most pages should be written in both english and swedish. Use the attributes `lang="en"` and `lang="sv"` to specify the language for an element.
* English is the default language. Use english where there's only room for a single language, for example `<title>`, `<meta name="description" ... >`, and `alt` attributes.
* The help pages are an exception — they are typically only written in swedish. When there's only room for a single language on a help page, use swedish.



## How to: Add a Job Opening Page

1. If it doesn't exist yet, create an appropriate folder inside the `/jobs` folder.
2. Create an html file with a descriptive name. For example: `/jobs/2023/spring/backend-developer-internship.html`.
3. Set layout, title and description in front matter. Title and description should be written in english (see Languages above).
4. Make sure the page content is written in both swedish and english.
5. Make sure there is some kind of approximate date information at the beginning of the page. The date can refer to when the page was publish, or when the opening is available, whatever makes most sense.
6. Add a link to the page in `/jobs/index.html`.



## How to: Remove a Job Opening Page

1. Remove the link to the page from `/jobs/index.html`.
2. Do ***not*** delete the page! We don't want to break incoming links.
3. Add the `<!-- job-no-longer-available.html -->` include on the page.
4. Set `robots: noindex` in front matter for the page.



## How to: Write Help Pages

* Write primarily for staff and teachers (not students), but, as much as possible, try to make help pages applicable to any role.
* Use clear but compact language. Write: *"Klicka på `Spara`"* rather than: *"Klicka på knappen `Spara`"*.
* Wrap labels for links and buttons in code tags (or backticks if using markdown).
* Assets (like screenshots) should be stored in a folder named `_assets` next to the page.
* When painting arrows and indicators on a screenshot, use the orange color `#FF7B00`.
* Help pages are typically only written in swedish (see Language above). Add the `<!-- only-in-swedish.html -->` include immediately after the `h1` element.
* `<title>`, `<meta name="description" ... >` and `alt` attributes should be written in swedish.



## How to: Write News Articles

1. If it doesn't exist yet, create an appropriate folder inside the `/news` folder.
2. Create a html file with a descriptive name. For example: `/news/2022-06/group-code-in-title-field.html`.
3. Set layout, title and description in front matter. Title should be in english, but description can be in both english and swedish.
4. Set `robots: noindex` in front matter. We don't want news articles to compete with other Learnpoint pages in Google search, because the content in a news article can become obsolete really fast.
5. Try to include at least one relevant screenshot in the article.
6. Language should be correct, compact and casual.
7. Speak directly to the reader. Use the pronoun *"you"* in active sentences. Avoid pronouns like *"teachers"*, *"users"*, etc.
8. Avoid using *"we"*, because the reader would probably feel excluded. Instead of *"We've added a new feature"*, write "*A new feature is added"*.
9. Use factual statements instead of assessments. Instead of *"The page is simplified"*, write "*The page is updated*", or "*Some elements are removed from the page*". Let the reader make her own judgements.
10. Write in both swedish and english.



## Screenshots

Crop and zoom to make the screenshot readable on both desktop and mobile. Specifically, minimize the width of the browser (or the screenshot object) as much as possible.



## Screen Recordings

Screen recordings must be encoded with h264 and stored in an mp4 file. Audio tracks are not allowed.

[ShareX](https://getsharex.com/) is a recording tool that supports h264. Select the `Very slow` option for the x264 video recording preset to make sure the output have optimal compression.

[FFmpeg](https://ffmpeg.org/download.html) is a tool for multimedia manipulation. Here's a command to insert a fade-in transition at the beginning of a video (frame 0 to 50), while also making sure that the h264 codec is used, and that any audio tracks are removed:

        ffmpeg -i in.mp4 -vf "fade=in:0:50" -c:v libx264 -an out.mp4

Here's how to make a screen recording:

1. Crop and zoom appropriately. (See **Screenshots** above).
2. Don't use audio.
3. Use high fidelity resolution, framerate, and colors.

When making a screen recoring, make sure that every mouse movement and click are clearly intentional and explanatorily timed. For example, here's how you could choreograph a click on an button:
1. Move the cursor in a straight line to the button you intend to click.
2. Hover the button for about 2 seconds, holding the cursor perfectly still.
3. Click the button.
