## Set up Development Environment

- [Install Deno](https://deno.land/manual/getting_started/installation) version ```1.14.0``` or later.


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

2. Do **not** make file changes in the ```docs``` folder. If there are any problems or file mismatches, it is perfectly safe to stop the dev server, completely delete the ```docs``` folder, and then start the server again.

4. When done, stop the server with ```Ctrl + C```.

5. Commit and push to your development branch.
