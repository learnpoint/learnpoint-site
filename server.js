import { path, sideServe } from "./deps.js";

const rootPath = Deno.cwd();
const sourcePath = path.join(rootPath, 'src');
const targetPath = path.join(rootPath, 'docs');
const componentsPath = path.join(sourcePath, 'components');

sideServe(sourcePath, targetPath, componentsPath);
