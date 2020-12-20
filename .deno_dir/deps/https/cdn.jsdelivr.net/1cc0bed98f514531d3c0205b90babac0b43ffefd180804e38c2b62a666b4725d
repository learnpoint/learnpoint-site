import { path, bold, yellow } from "./deps.js";
import * as marked from "./marked.esm.js";
import { defaults } from "./defaults.js";

const markdown = marked.default;
markdown.setOptions({
    headerIds: false
});

const buildArgs = {};

export async function build(options) {
    options = { ...defaults(), ...options };

    buildArgs.componentsPath = options.componentsPath;
    buildArgs.forceRebuild = options.forceRebuild;
    buildArgs.componentsMTime = await getComponentsMTime();

    recursiveBuild(options.sourcePath, options.targetPath);
}

async function recursiveBuild(sourcePath, targetPath) {
    await Deno.mkdir(targetPath, { recursive: true });

    for await (const dirEntry of Deno.readDir(sourcePath)) {
        const sPath = path.join(sourcePath, dirEntry.name);
        const tPath = path.join(targetPath, dirEntry.name);

        if (sPath === buildArgs.componentsPath) {
            continue;
        }

        if (dirEntry.isDirectory) {
            recursiveBuild(sPath, tPath);
            continue;
        }

        const [buildNeeded, buildReason] = await isBuildNeeded(sPath, tPath)
        if (buildNeeded) {
            console.log('Building', path.relative(Deno.cwd(), tPath), '-', buildReason);
            buildFile(sPath, tPath);
        }
    }
}

async function getComponentsMTime() {
    let componentsMTime = new Date(0);

    for await (const item of Deno.readDir(buildArgs.componentsPath)) {
        const itemPath = path.join(buildArgs.componentsPath, item.name);
        const itemInfo = await Deno.lstat(itemPath);

        if (itemInfo.mtime > componentsMTime) {
            componentsMTime = itemInfo.mtime;
        }
    }
    return componentsMTime;
}

async function isBuildNeeded(sourceFilePath, targetFilePath) {
    if (buildArgs.forceRebuild) {
        return [true, 'Build forced'];
    }

    if (isMarkdownFile(sourceFilePath)) {
        targetFilePath = targetFilePath.slice(0, -2) + 'html';
    }

    try {
        const [sourceFileInfo, targetFileInfo] = await Promise.all([
            Deno.stat(sourceFilePath),
            Deno.stat(targetFilePath),
        ]);

        if (sourceFileInfo.mtime > targetFileInfo.mtime) {
            return [true, 'File modified'];
        }

        if ((isHtmlFile(sourceFilePath) || isMarkdownFile(sourceFilePath)) && buildArgs.componentsMTime > targetFileInfo.mtime) {
            return [true, 'Components modified'];
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

async function buildFile(sourceFilePath, targetFilePath) {
    if (isHtmlFile(sourceFilePath)) {
        const sourceContent = await Deno.readTextFile(sourceFilePath);
        Deno.writeTextFile(targetFilePath, renderHtmlFile(sourceContent, sourceFilePath, sourceContent));
    } else if (isMarkdownFile(sourceFilePath)) {
        targetFilePath = targetFilePath.slice(0, -2) + 'html'; // Change suffix from .md to .html
        const sourceContent = await Deno.readTextFile(sourceFilePath);
        const markedupContent = markdown(sourceContent);
        Deno.writeTextFile(targetFilePath, renderHtmlFile(markedupContent, sourceFilePath, sourceContent));
    } else {
        Deno.copyFile(sourceFilePath, targetFilePath);
    }
}

const isHtmlFile = sourceFilePath => path.extname(sourceFilePath) === '.html';
const isMarkdownFile = sourceFilePath => path.extname(sourceFilePath) === '.md';

const renderHtmlFile = (data, sourceFilePath, originalSourceContent) => {
    const originalSourceContentString = originalSourceContent.toString();
    const dataString = data.toString();

    return dataString.replace(/<!--.*-->/g, (match, matchPos) => {
        const [error, renderedContent] = renderComponent(match.replace('<!--', '').replace('-->', ''));

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

const renderComponent = componentString => {
    let error = null;

    const componentName = componentString.split(',')[0].trim();

    let componentContent = '';
    try {
        componentContent = Deno.readTextFileSync(path.join(buildArgs.componentsPath, componentName));
    } catch {
        error = 'Component file not found: "' + componentName + '"';
    }

    let componentData = {};

    if (!error && componentString.includes(',')) {
        const componentDataString = componentString.substring(componentString.indexOf(',') + 1).trim();
        try {
            componentData = eval(`(${componentDataString})`);

            if (componentData === null || typeof componentData !== 'object') {
                error = 'Component data is not a valid javascript object: ' + componentDataString;
                componentData = {};
            }
        } catch (err) {
            error = 'Component data is not valid javascript: ' + componentDataString;
            componentData = {};
        }
    }

    return [error, componentContent.replace(/{{.*}}/g, match => renderComponentData(match.replace('{{', '').replace('}}', ''), componentData))];
};

const renderComponentData = (componentDataString, componentData) => {
    let dataKey = componentDataString.split('||')[0].trim();

    if (componentData[dataKey]) {
        return componentData[dataKey];
    }

    if (componentDataString.includes('||')) {
        return componentDataString.substring(componentDataString.indexOf('||') + 2).trim();
    }

    return '';
};
