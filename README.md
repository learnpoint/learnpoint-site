## Set up Development Environment

- [Install Deno](https://deno.land/manual/getting_started/installation) version **1.23.3** or later.



## Fork & Pull Request Workflow

1. Create your own fork.
2. Clone the fork to your computer.
3. Create a new development branch on your fork.
4. Do all coding in your development branch (explained in next section).
5. You can publish your fork on a static host (like Netlify), but **do not** use github pages because the `CNAME` file is used for production.
6. When done, merge upstream/master and rebase your development branch.
7. If appropriate, squash your commits.
8. Make a pull request.

Read more about Fork & Pull Request Workflow  [here](https://gist.github.com/Chaser324/ce0505fbed06b947d962).



## Development Workflow

1. Start dev server:

        $ deno task dev

2. Open site at `http://localhost:3333`

3. Write your changes to the ```src``` folder. The dev server will automatically rebuild the site and reload your browser as you make your changes.

4. **Do not** make any file changes in the ```docs``` folder.

5. If there are any file mismatches or build problems, it's perfectly safe to:
    1. Stop the dev server
    2. Completely delete the ```docs``` folder
    3. Start the dev server again.

6. When done, stop the server with ```Ctrl + C```.

7. Commit and push to your development branch.

8. When done, make a pull request (as explained in previous section).



## How to: Add a Job Opening Page

1. If it does not exist yet, create an appropriate folder inside the `/jobs` folder.
2. Create a html file with a descriptive name. For example: `/jobs/2022/autumn/backend-developer-internship.html`.
3. Set layout, title and description in front matter.
4. Make sure the page is written in both swedish and english.
5. Make sure there is some kind of approximate date information at the beginning of the page. The date can refer to when the page was publish or when the opening is available, whatever makes most sense.
6. Add a link to the page in `/jobs/index.html`.


## How to: Remove a Job Opening Page

1. Remove the link to the page in `/jobs/index.html`.
2. Do ***not*** delete the page! We don't want to break external links.
3. Add the `<!-- job-no-longer-available.html -->` include on the page.
4. Set `robots: noindex` in front matter for the page.


## How to: Write Help Page

* Put names for controls (links and buttons) in code tags (or backticks if using markdown).
* Content images (screenshots) should be stored in a folder named _assets next to the page.
* When painting arrows and indicators on a screenshot, use the orange color `#FF7B00`.
* Screenshots must always have 2 versions, one for desktop and one for mobile.
* If the page is only written in swedish, add the `<!-- only-in-swedish.html -->` include immediately after the `h1` element.