## Development Environment Set Up

1. [Install Deno](https://deno.land/manual@v1.27.1/getting_started/installation) **v1.27.1** or later.

2. [Create a fork](https://github.com/learnpoint/learnpoint-site/fork) to your personal GitHub account.

3. On GitHub, navigate to your fork that you just created, and create a new branch named `dev`.

4. On GitHub, make the new branch `dev` the default branch.

5. Open a terminal and move into an appropriate folder.

6. Clone the fork. Should be something like this:

        git clone https://github.com/GITHUB-USERNAME/learnpoint-site.git

7. Move into the cloned fork:

        cd learnpoint-site

8. Checkout the `dev` branch:

        git checkout dev

9. Add upstream to your fork:

        git remote add upstream https://github.com/learnpoint/learnpoint-site.git

10. Verify upstream was added. This command should not give any errors:

        git remote show upstream

11. [Sign up to Netlify](https://app.netlify.com/signup) using your GitHub account.

12. Create a new site on Netlify:
    1. Find and click the button **Add new site**.
    2. Select **Import existing project**.
    3. Choose **GitHub**.
    4. Select the `dev` branch on your fork.
    5. Choose `docs` as the **Publish directory**. Keep everything else empty.
    6. Finish the wizard.

13. Verify that your Netlify site is working. If you navigate to the created Netlify site, your should see the Learnpoint home page.

14. Whenever you want to discuss your work, just share the link to your Netlify site. The Netlify site should automatically update when you push commits to your fork.



## Development Workflow

1. Start the dev server:

        deno task dev

2. Open the site at `http://localhost:3333`

3. Write all your changes to the `src` folder. You should never make any changes to the `docs` folder.

4. If there are any file mismatches, or build problems, it's perfectly safe to:
    1. Stop the dev server: `Ctrl + C`.
    2. Completely delete the ```docs``` folder.
    3. Restart the dev server: `deno task dev`.

5. When done, stop the server:

        Ctrl + C

6. Commit and push to your fork.

7. Verify that your changes are deployed to your Netlify site.

8. Share and discuss your work.



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



## Language

* All pages should be written in both english and swedish. Use `lang="en"` and `lang="sv"` to specify the language for the content of an element.
* English is the default language. Use english where there's only room for a single language, for example `<title>`, `<meta name="description" ... >`, and `alt` attributes.
* Help pages are an exception. They are only written in swedish. For help pages, when there's only room for a single language, use swedish.



## Screenshots

* When appropriate, screenshots should have two versions, one for desktop and one for mobile.
* Screenshots should be cropped and zoomed to make the text in the screenshot readable. This is particularly important when there's no mobile screenshot.



## How to: Add a Job Opening Page

1. If it does not exist yet, create an appropriate folder inside the `/jobs` folder.
2. Create a html file with a descriptive name. For example: `/jobs/2023/spring/backend-developer-internship.html`.
3. Set layout, title and description in front matter. Title and description should be in english.
4. Make sure the page content is written in both swedish and english.
5. Make sure there is some kind of approximate date information at the beginning of the page. The date can refer to when the page was publish or when the opening is available, whatever makes most sense.
6. Add a link to the page in `/jobs/index.html`.



## How to: Remove a Job Opening Page

1. Remove the link to the page in `/jobs/index.html`.
2. Do ***not*** delete the page! We don't want to break external links.
3. Add the `<!-- job-no-longer-available.html -->` include on the page.
4. Set `robots: noindex` in front matter for the page.



## How to: Write Help Pages

* Write primarily for staff and teachers, but, as much as possible, try to make help pages applicable to any role.
* Use clear but compact language. Write: *"Klicka på `Spara`"* rather than: *"Klicka på knappen `Spara`"*.
* Put labels for links and buttons in code tags (or backticks if using markdown).
* Assets (like screenshots) should be stored in a folder named `_assets` next to the page.
* When painting arrows and indicators on a screenshot, use the orange color `#FF7B00`.
* For now, help pages are only written in swedish. Add the `<!-- only-in-swedish.html -->` include immediately after the `h1` element.
* `<title>`, `<meta name="description" ... >` and `alt` attributes should be written in swedish.



## How to: Write News Articles

1. If it doesn't exist yet, create an appropriate folder inside the `/news` folder.
2. Create a html file with a descriptive name. For example: `/news/2022-06/group-code-in-title-field.html`.
3. Set layout, title and description in front matter. Title should be in english, but description can be in both english and swedish.
4. Set `robots: noindex` in front matter. We don't want news articles to compete with other pages on google search results.
5. Try to include at least one relevant screenshot in the article.
6. Language should be correct, compact and casual.
7. Speak directly to the reader. Use the pronoun *"you"* in active sentences. Avoid pronouns like *"teachers"*, *"users"*, etc.
8. Avoid using *"we"*, unless the reader is clearly included. Instead of: *"We've added a new feature"*, write: "*A new feature is added"*.
9. Use a neutral and descriptive language. Instead of: *"The page is simplified"*, write: "*The page is updated*" or: "*Some elements are removed from the page*".
10. Write in both swedish and english.
