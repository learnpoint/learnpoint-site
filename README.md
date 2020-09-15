# Development Environment Setup

- [Install Deno](https://github.com/denoland/deno_install) version ```1.3.2```.
- No VSCode extensions for Deno are required.


# Fork & Pull Request Workflow

1. Create your own fork
2. Create a new development branch in your fork
3. Do all development in your development branch
4. When done, merge upstream/master and rebase your development branch
5. Squash your commits if appropriate
6. Make a pull request

Detailed instructions [here](https://gist.github.com/Chaser324/ce0505fbed06b947d962).


# Development Workflow

First, start the development server:

```
deno run -A server.js
```

The development server will start the site on ```http://127.0.0.1:3333```. Navigate to that address with your browser.

Then, make all your file changes in directory ```src```. Keep the server running while your're doing file changes. The development server will automatically rebuild the site and reload your browser as you make files changes.

Do **not** make any manual file changes in the ```docs``` directory. If there are any problems or file mismatches, it is perfectly safe to  stop the server, completely delete the ```docs``` directory, and then start the server again.

Stop the server with ```Ctrl + C``` when you're done.

Commit and push to your development branch.


# Production Environment

Statically serve ```docs``` as the root folder for the site.

The are no buildsteps required or dependencies needed. The ```docs``` directory is always ready to be served as it is.

Configure ```index.html``` as default document. If a request is made to ```/blog```, the server should serve ```/blog/index.html``` (if that file exists), or respond with ```404 Not Found``` (if that file does not exists).

The server should not list directory content.

Be mindful about client caching. There's no build in cache invalidation logic, except for file changes. Before implementing a fancy caching strategy, consider one of the following three options.

**(1)** Do not use any caching at all. Between deployments, request recurrency is expected to be weak, and therefore, the value of caching is low. For end user availability, focus on compression:
```
cache-control: no-store
```

**(2)** Use a short (60 min) cache that's easy to understand and manage:
```
cache-control: public, max-age=3600
```

**(3)** To off-load the production environment, implement a ETag header::
```
cache-control: public, max-age=3600
ETag: W/"22b6d046870a8db69794472c1ada0ea4"
```


# About Dependencies

For production, no dependencies are allowed at all. The directory ```docs``` must always be deployable, as it is, by any standard static web server, without any builds, dependencies, or non-standard configurations.

For development, try to avoid dependencies. In the long run, a few lines of code is easier to manage than a few dependencies.

Also, avoid 3rd party modules. Use [deno/std](https://deno.land/std) and modules written in-house. There are two reasons for this. First, 3rd party modules often creates deep dependency graphs, and those are difficult to troubleshoot when there's a problem. Second, it's often easier to fix a bug in our own code than in a 3rd party module.

All dependencies must be defined in ```deps.js```.

All dependencies must be integrity checked by ```lock.json```.

All dependencies must be stored ```deno_dir```.
