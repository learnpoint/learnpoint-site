## Set up Development Environment

- [Install Deno](https://deno.land/manual/getting_started/installation) version ```1.20.6``` or later.


## Fork & Pull Request Workflow

1. Create your own fork.
2. Clone the fork to your computer.
3. Create a new development branch on your fork.
4. Do all coding in your development branch (as explained in next section).
5. When done, merge upstream/master and rebase your development branch.
6. If appropriate, squash your commits.
7. Make a pull request.

Read more about Fork & Pull Request Workflow  [here](https://gist.github.com/Chaser324/ce0505fbed06b947d962).


## Development Workflow

1. Start the dev server:

        $ deno run -A dev.js

2. Make file changes in the ```src``` folder. The dev server will automatically rebuild the site and reload your browser as you make files changes.

3. Do **not** make file changes in the ```docs``` folder. If there are any problems or file mismatches, it is perfectly safe to stop the dev server, completely delete the ```docs``` folder, and then start the server again.

4. When done, stop the server with ```Ctrl + C```.

5. Commit and push to your development branch.


## Add Job Opening Page

1. If it doesn't exist yet, create an appropriate folder inside /jobs.
2. Create a html file with a descriptive name. For example: /jobs/2022/autumn/backend-developer-internship.html.
3. Set layout, title and description in front matter.
4. Make sure the page is written in both swedish and english.
5. Make sure there is some kind of approximate date information at the beginning of the page. The date can refer to when the page was publish or when the opening is available, whatever makes most sense.
6. Add a link to the page from /jobs/index.html.


## Remove Job Opening Page

1. Remove the link from /jobs/index.html.
2. Do **not** delete the page. There might exist links to the page on external crawler sites.
3. Add job-no-longer-available include on the page.
4. Set robots: noindex in front matter.


## Writing Help Pages

* Put names for controls (links and buttons) in code tags (or backticks if using markdown).
* Content images (screenshots) should be stored in a folder named _assets next to the page.
* When painting arrows and indicators on a screenshot, use the orange color FF7B00.
* Screenshots must always have two version. One for desktop and one for mobile.
* If page only in swedish, add only-in-swedish include just after the h1 header.