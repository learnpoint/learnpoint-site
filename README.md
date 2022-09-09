## Set up Development Environment

- [Install Deno](https://deno.land/manual/getting_started/installation) version **1.24.0** or later.



## Fork & Pull Request Workflow

1. Create your own fork.
2. Clone the fork to your computer.
3. Create a new development branch on your fork.
4. Do all coding in your development branch (explained in next section).
5. You can publish your fork on a static host (like Netlify), but **do not** use github pages, because the `CNAME` file is used for production. Make sure that your host respond with a `x-robots-tag: noindex` header on every request. (This is to prevent your published fork from ending up in google searches.)
6. When done, merge upstream/master and rebase your development branch.
7. If appropriate, squash your commits.
8. Make a pull request.

Read more about Fork & Pull Request Workflow  [here](https://gist.github.com/Chaser324/ce0505fbed06b947d962).



## Development Workflow

1. Start dev server:

        deno task dev

2. Open site at `http://localhost:3333`

3. Write your changes to the ```src``` folder.

4. Do **not** make any file changes in the ```docs``` folder.

5. If there are any file mismatches or build problems, it's perfectly safe to:
    1. Stop the dev server
    2. Completely delete the ```docs``` folder
    3. Start the dev server again.

6. When done, stop the server with ```Ctrl + C```.

7. Commit and push to your development branch.

8. When done, make a pull request (as explained in previous section).


## Language

* All pages should be written in both english and swedish. Use `lang="en"` and `lang="sv"` to specify the language for the content of an element.
* English is the default language. Use english where there's only room for a single language, for example `<title>`, `<meta name="description" ... >`, and `alt` attributes.
* Help pages are an exception. They are only written in swedish. For help pages, when there's only room for a single language, use swedish.


## Screenshots

* When appropriate, screenshots should have two versions, one for desktop and one for mobile.
* Screenshots should be cropped and zoomed to make the text in the screenshot readable. This is especially important for desktop screenshots. 


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

* Put labels for links and buttons in code tags (or backticks if using markdown).
* Content images (screenshots) should be stored in a folder named _assets next to the page.
* When painting arrows and indicators on a screenshot, use the orange color `#FF7B00`.
* If appropriate, screenshots should have two versions, one for desktop and one for mobile.
* For now, help pages are only written in swedish. Add the `<!-- only-in-swedish.html -->` include immediately after the `h1` element.
* `<title>`, `<meta name="description" ... >` and `alt` attributes should be written in swedish.
