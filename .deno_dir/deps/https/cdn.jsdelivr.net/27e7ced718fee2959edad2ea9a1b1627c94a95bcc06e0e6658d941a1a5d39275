import { path, bold, yellow, marked } from "./deps.js";
import { exists } from "./exists.js";

const markdown = marked.default;
markdown.setOptions({
    headerIds: false
});

const buildArgs = {};

export async function build(options) {
    const defaults = {
        sourcePath: path.join(Deno.cwd(), 'src'),
        buildPath: path.join(Deno.cwd(), 'docs'),
        snippetsPath: path.join(Deno.cwd(), 'src', 'snippets'),
        forceRebuild: false,
        buildWatch: false
    };

    options = { ...defaults, ...options };

    await ensureDirectories(options);

    buildArgs.snippetsPath = options.snippetsPath;
    buildArgs.forceRebuild = options.forceRebuild;
    buildArgs.snippetsLastModifiedTime = await getSnippetsLastModifiedTime();

    recursiveBuild(options.sourcePath, options.buildPath);

    if (options.buildWatch) {
        const watcher = Deno.watchFs(options.sourcePath);

        let lastBuild = 0;

        for await (const event of watcher) {
            if ((Date.now() - lastBuild) < 200) {
                continue;
            }

            lastBuild = Date.now();
            buildArgs.snippetsLastModifiedTime = await getSnippetsLastModifiedTime();
            recursiveBuild(options.sourcePath, options.buildPath);

            console.log();
            console.log("Rebuilding...");
            console.log();
        }
    }
}

async function ensureDirectories(options) {
    if (!await exists(options.sourcePath)) {
        console.log();
        console.error('Source folder not found:', options.sourcePath);
        console.log();
        console.log('Create the folder and try again.');
        console.log();
        Deno.exit(1);
    }

    if (!await exists(options.snippetsPath)) {
        console.log();
        console.error('Snippets folder not found:', options.snippetsPath);
        console.log();
        console.log('Create the folder and try again.');
        console.log();
        Deno.exit(1);
    }

    // Do not test build path. Will be created if not exists.
}

async function recursiveBuild(sourcePath, buildPath) {
    await Deno.mkdir(buildPath, { recursive: true });

    for await (const dirEntry of Deno.readDir(sourcePath)) {
        const sPath = path.join(sourcePath, dirEntry.name);
        let bPath = path.join(buildPath, dirEntry.name);

        if (sPath === buildArgs.snippetsPath) {
            continue;
        }

        if (dirEntry.isDirectory) {
            recursiveBuild(sPath, bPath);
            continue;
        }

        if (isMarkdownFile(bPath)) {
            // Change target file extension from .md to .html
            bPath = bPath.slice(0, -2) + 'html';
        }

        const [buildNeeded, buildReason] = await isBuildNeeded(sPath, bPath)
        if (buildNeeded) {
            console.log('Building', path.relative(Deno.cwd(), bPath), '--', buildReason);
            buildFile(sPath, bPath);
        }
    }
}

async function getSnippetsLastModifiedTime() {
    let snippetsLastModifiedTime = new Date(0);

    for await (const item of Deno.readDir(buildArgs.snippetsPath)) {
        const itemPath = path.join(buildArgs.snippetsPath, item.name);
        const itemInfo = await Deno.lstat(itemPath);

        if (itemInfo.mtime > snippetsLastModifiedTime) {
            snippetsLastModifiedTime = itemInfo.mtime;
        }
    }
    return snippetsLastModifiedTime;
}

async function isBuildNeeded(sourceFilePath, buildFilePath) {
    if (buildArgs.forceRebuild) {
        return [true, 'Build forced'];
    }

    try {
        const [sourceFileInfo, buildFileInfo] = await Promise.all([
            Deno.stat(sourceFilePath),
            Deno.stat(buildFilePath),
        ]);

        if (sourceFileInfo.mtime > buildFileInfo.mtime) {
            return [true, path.relative(Deno.cwd(), sourceFilePath) + ' was modified'];
        }

        if (isHtmlFile(buildFilePath) && buildArgs.snippetsLastModifiedTime > buildFileInfo.mtime) {
            return [true, 'Snippet(s) was modified'];
        }
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            return [true, 'New file'];
        } else {
            throw error;
        }
    }

    return [false, ''];
}

async function buildFile(sourceFilePath, buildFilePath) {
    if (isHtmlFile(sourceFilePath)) {
        const sourceContent = await Deno.readTextFile(sourceFilePath);
        Deno.writeTextFile(buildFilePath, renderHtmlFile(sourceContent, sourceFilePath, sourceContent));
    } else if (isMarkdownFile(sourceFilePath)) {
        const sourceContent = await Deno.readTextFile(sourceFilePath);
        const markedupContent = markdown(sourceContent);
        Deno.writeTextFile(buildFilePath, renderHtmlFile(markedupContent, sourceFilePath, sourceContent));
    } else {
        Deno.copyFile(sourceFilePath, buildFilePath);
    }
}

const isHtmlFile = sourceFilePath => path.extname(sourceFilePath) === '.html';
const isMarkdownFile = sourceFilePath => path.extname(sourceFilePath) === '.md';

const renderHtmlFile = (data, sourceFilePath, originalSourceContent) => {
    const originalSourceContentString = originalSourceContent.toString();
    const dataString = data.toString();

    return dataString.replace(/<!--.*-->/g, (match, matchPos) => {
        const [error, renderedContent] = renderSnippet(match.replace('<!--', '').replace('-->', ''));

        if (error) {
            console.log();
            console.log(bold(yellow('Error in:')), bold(yellow(path.relative(Deno.cwd(), sourceFilePath))), 'line', lineNumber(matchPos, originalSourceContentString));
            console.log(bold('=== >'), bold(error));
            console.log();
            return match; // Leave unchanged
        }

        return renderedContent;
    });
};

const lineNumber = (pos, str) => str.substring(0, pos).split('\n').length;

const renderSnippet = snippetString => {
    let error = null;

    const snippetName = snippetString.split(',')[0].trim();

    let snippetContent = '';
    try {
        snippetContent = Deno.readTextFileSync(path.join(buildArgs.snippetsPath, snippetName));
    } catch {
        error = 'Snippet file not found: "' + snippetName + '"';
    }

    let snippetData = {};

    if (!error && snippetString.includes(',')) {
        const snippetDataString = snippetString.substring(snippetString.indexOf(',') + 1).trim();
        try {
            snippetData = eval(`(${snippetDataString})`);

            if (snippetData === null || typeof snippetData !== 'object') {
                error = 'Snippet props is not a valid javascript object: ' + snippetDataString;
                snippetData = {};
            }
        } catch (err) {
            error = 'Snippet props is not a valid javascript object: ' + snippetDataString;
            snippetData = {};
        }
    }

    return [error, snippetContent.replace(/{{.*}}/g, match => renderSnippetData(match.replace('{{', '').replace('}}', ''), snippetData))];
};

const renderSnippetData = (snippetDataString, snippetData) => {
    let dataKey = snippetDataString.split('||')[0].trim();

    if (snippetData[dataKey]) {
        return snippetData[dataKey];
    }

    if (snippetDataString.includes('||')) {
        return snippetDataString.substring(snippetDataString.indexOf('||') + 2).trim();
    }

    return '';
};
