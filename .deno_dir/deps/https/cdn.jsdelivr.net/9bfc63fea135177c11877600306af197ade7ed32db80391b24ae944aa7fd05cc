import { build } from "./build.js";
import { serve } from "./serve.js";
import { defaults } from "./defaults.js";

export async function buildAndServe(options) {
    options = { ...defaults(), ...options };

    buildAndWatch(options);

    // Give first build time to finish
    setTimeout(() => serve(options), 600);
}

async function buildAndWatch(options) {
    build(options);

    const watcher = Deno.watchFs(options.sourcePath);

    let lastBuild = 0;

    for await (const event of watcher) {
        if ((Date.now() - lastBuild) < 200) {
            continue;
        }

        lastBuild = Date.now();
        build(options);

        console.log();
        console.log("Rebuilding...");
        console.log();
    }
}
