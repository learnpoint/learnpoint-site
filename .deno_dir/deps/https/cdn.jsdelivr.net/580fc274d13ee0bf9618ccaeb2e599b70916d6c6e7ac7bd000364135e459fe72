import { path } from "./deps.js";
import { build } from "./build.js";
import { serve } from "./serve.js";

export async function dev(options) {
    const defaults = {
        sourcePath: path.join(Deno.cwd(), 'src'),
        buildPath: path.join(Deno.cwd(), 'docs'),
        snippetsPath: path.join(Deno.cwd(), 'src', 'snippets'),
        forceRebuild: false,
        buildWatch: true,
        firstBuildDoneCallback: () => serve(path.join(Deno.cwd(), 'docs'))
    };

    options = { ...defaults, ...options };

    build(options);
}
