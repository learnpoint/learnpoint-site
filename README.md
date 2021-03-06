# learnpoint-site

Repo for [learnpoint.se](https://learnpoint.se)


## Development Environment Setup

- [Install Deno](https://deno.land/manual/getting_started/installation) version ```1.7.1```


## Fork & Pull Request Workflow

1. Create your own fork
2. Create a new development branch in your fork
3. Do all development in your development branch (see next section)
4. When done, merge upstream/master and rebase your development branch
5. Squash your commits if appropriate
6. Make a pull request

Detailed instructions [here](https://gist.github.com/Chaser324/ce0505fbed06b947d962).


## Development Workflow

1. Start the dev server:

        $ deno run -A dev.js

2. Make file changes in the ```src``` directory. The dev server will automatically rebuild the site and reload your browser as you make files changes.

    Do **not** make file changes in the ```docs``` directory. If there are any problems or file mismatches, it is perfectly safe to stop the dev server, completely delete the ```docs``` directory, and then start the server again.

3. Stop the server with ```Ctrl + C``` when you're done.

4. Commit and push to your development branch.


## About Dependencies

- No dependencies are allowed for running the site in production. The directory ```docs``` must always be deployable, as it is, by any standard static web server, without any builds, dependencies, or non-standard configurations.

- For development, try to avoid dependencies. In the long run, a few lines of code is easier to manage than a few dependencies.

- Avoid 3rd party modules. Use [deno/std](https://deno.land/std) and modules written in-house. There are two reasons for this. First, 3rd party modules often creates deep dependency graphs, and those are difficult to troubleshoot when there's a problem. Second, it's often easier to fix a bug in our own code than in a 3rd party module.

- Dependencies are defined in ```deps.js```.

- Dependencies are integrity checked by ```lock.json```.

- Dependencies are stored ```.deno_dir```.


## Dependency Management

To add, remove, or change dependencies:

1. Make your dependency edits in ```deps.js```.

2. Make a fresh install of all dependencies on your machine:

        deno cache -r deps.js

3. Test the application(s) to verify everything works.

4. If everything works, store all dependencies in the folder ```.deno_dir``` and update integrity checks in ```lock.json```.

        DENO_DIR=.deno_dir deno cache -r --lock=lock.json --lock-write deps.js

    If you're using PowerShell, you cannot use the syntax above. You'll have to first set the environment variable, and then run ```deno cache``` in a separate command. (Note that the variable will be changed for the whole PowerShell session, not just for the command. When you're done, unset the variable or restart the PowerShell session.)

        $env:DENO_DIR=".deno_dir"
        deno cache -r --lock=lock.json --lock-write deps.js

    In Windows CMD, you set an environment variable like so:

        set DENO_DIR=".deno_dir"

5. Verify that everything works using the locally stored dependencies. You could, for example, run the server like this:

        DENO_DIR=.deno_dir deno run -A --lock=lock.json --cached-only server.js

    (In PowerShell and Windows CMD, you need to set the environmental variable ```DENO_DIR``` using a different syntax. See examples above.)

6. Commit and push your changes. Make sure you've unset the environment variable ```DENO_DIR```. 


## Production Environment

- Statically serve ```docs``` as the root folder for the site.

- No buildsteps or dependencies needed. The ```docs``` directory is always ready to be served as it is.

- Configure the ```404.html``` file to be served for non resovable requests. If a request is made to ```/hey.html``` and that files does not exist, the server should respond with ```404 Not Found``` and with the content in the file ```404.html``` (without any redirects). Note: if a request is made to ```/404.html```, the server should respond with ```200 OK```.

- Configure ```index.html``` as default document. When a request is made to ```/blog```, the server should try to serve ```/blog/index.html```. If that file does not exist, the server should respond with ```404 Not Found``` with the content in the file ```404.html``` (without any redirects). If that file exist, the server should respond with the contents of that file (without any redirects).

- The server should not list directory content.

- Avoid clever client caching. There's no build in cache invalidation logic (except for file changes), and request recurrency is expected to be weak. Performance is best achieved through network compression, resource minification, and delivery distribution. Here are three suggestions for client caching:

    1. No caching:

            cache-control: no-store

    2. A short and static cache that's easy to understand:

            cache-control: public, max-age=3600

    3. A longer cache that's invalidated on file change through an ETag:

            cache-control: public, max-age=86400
            ETag: W/"22b6d046870a8db69794472c1ada0ea4"

