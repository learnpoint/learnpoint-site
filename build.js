import { path, sideBuild } from "./deps.js";

const rootPath = Deno.cwd();
const sourcePath = path.join(rootPath, 'src');
const targetPath = path.join(rootPath, 'docs');
const componentsPath = path.join(sourcePath, 'components');

sideBuild(sourcePath, targetPath, componentsPath, false);
