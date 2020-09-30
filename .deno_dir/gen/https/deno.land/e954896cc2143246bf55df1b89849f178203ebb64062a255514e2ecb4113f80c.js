import { NATIVE_OS } from "./_constants.ts";
import { join, normalize } from "./mod.ts";
import { SEP, SEP_PATTERN } from "./separator.ts";
export function globToRegExp(glob, { extended = true, globstar: globstarOption = true, os = NATIVE_OS } = {}) {
    const sep = os == "windows" ? `(?:\\\\|\\/)+` : `\\/+`;
    const sepMaybe = os == "windows" ? `(?:\\\\|\\/)*` : `\\/*`;
    const seps = os == "windows" ? ["\\", "/"] : ["/"];
    const sepRaw = os == "windows" ? `\\` : `/`;
    const globstar = os == "windows"
        ? `(?:[^\\\\/]*(?:\\\\|\\/|$)+)*`
        : `(?:[^/]*(?:\\/|$)+)*`;
    const wildcard = os == "windows" ? `[^\\\\/]*` : `[^/]*`;
    const extStack = [];
    let inGroup = false;
    let inRange = false;
    let regExpString = "";
    let newLength = glob.length;
    for (; newLength > 0 && seps.includes(glob[newLength - 1]); newLength--)
        ;
    glob = glob.slice(0, newLength);
    let c, n;
    for (let i = 0; i < glob.length; i++) {
        c = glob[i];
        n = glob[i + 1];
        if (seps.includes(c)) {
            regExpString += sep;
            while (seps.includes(glob[i + 1]))
                i++;
            continue;
        }
        if (c == "[") {
            if (inRange && n == ":") {
                i++;
                let value = "";
                while (glob[++i] !== ":")
                    value += glob[i];
                if (value == "alnum")
                    regExpString += "\\w\\d";
                else if (value == "space")
                    regExpString += "\\s";
                else if (value == "digit")
                    regExpString += "\\d";
                i++;
                continue;
            }
            inRange = true;
            regExpString += c;
            continue;
        }
        if (c == "]") {
            inRange = false;
            regExpString += c;
            continue;
        }
        if (c == "!") {
            if (inRange) {
                if (glob[i - 1] == "[") {
                    regExpString += "^";
                    continue;
                }
            }
            else if (extended) {
                if (n == "(") {
                    extStack.push(c);
                    regExpString += "(?!";
                    i++;
                    continue;
                }
                regExpString += `\\${c}`;
                continue;
            }
            else {
                regExpString += `\\${c}`;
                continue;
            }
        }
        if (inRange) {
            if (c == "\\" || c == "^" && glob[i - 1] == "[")
                regExpString += `\\${c}`;
            else
                regExpString += c;
            continue;
        }
        if (["\\", "$", "^", ".", "="].includes(c)) {
            regExpString += `\\${c}`;
            continue;
        }
        if (c == "(") {
            if (extStack.length) {
                regExpString += `${c}?:`;
                continue;
            }
            regExpString += `\\${c}`;
            continue;
        }
        if (c == ")") {
            if (extStack.length) {
                regExpString += c;
                const type = extStack.pop();
                if (type == "@") {
                    regExpString += "{1}";
                }
                else if (type == "!") {
                    regExpString += wildcard;
                }
                else {
                    regExpString += type;
                }
                continue;
            }
            regExpString += `\\${c}`;
            continue;
        }
        if (c == "|") {
            if (extStack.length) {
                regExpString += c;
                continue;
            }
            regExpString += `\\${c}`;
            continue;
        }
        if (c == "+") {
            if (n == "(" && extended) {
                extStack.push(c);
                continue;
            }
            regExpString += `\\${c}`;
            continue;
        }
        if (c == "@" && extended) {
            if (n == "(") {
                extStack.push(c);
                continue;
            }
        }
        if (c == "?") {
            if (extended) {
                if (n == "(") {
                    extStack.push(c);
                }
                continue;
            }
            else {
                regExpString += ".";
                continue;
            }
        }
        if (c == "{") {
            inGroup = true;
            regExpString += "(?:";
            continue;
        }
        if (c == "}") {
            inGroup = false;
            regExpString += ")";
            continue;
        }
        if (c == ",") {
            if (inGroup) {
                regExpString += "|";
                continue;
            }
            regExpString += `\\${c}`;
            continue;
        }
        if (c == "*") {
            if (n == "(" && extended) {
                extStack.push(c);
                continue;
            }
            const prevChar = glob[i - 1];
            let starCount = 1;
            while (glob[i + 1] == "*") {
                starCount++;
                i++;
            }
            const nextChar = glob[i + 1];
            const isGlobstar = globstarOption && starCount > 1 &&
                [sepRaw, "/", undefined].includes(prevChar) &&
                [sepRaw, "/", undefined].includes(nextChar);
            if (isGlobstar) {
                regExpString += globstar;
                while (seps.includes(glob[i + 1]))
                    i++;
            }
            else {
                regExpString += wildcard;
            }
            continue;
        }
        regExpString += c;
    }
    regExpString = `^${regExpString}${regExpString != "" ? sepMaybe : ""}$`;
    return new RegExp(regExpString);
}
export function isGlob(str) {
    const chars = { "{": "}", "(": ")", "[": "]" };
    const regex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
    if (str === "") {
        return false;
    }
    let match;
    while ((match = regex.exec(str))) {
        if (match[2])
            return true;
        let idx = match.index + match[0].length;
        const open = match[1];
        const close = open ? chars[open] : null;
        if (open && close) {
            const n = str.indexOf(close, idx);
            if (n !== -1) {
                idx = n + 1;
            }
        }
        str = str.slice(idx);
    }
    return false;
}
export function normalizeGlob(glob, { globstar = false } = {}) {
    if (glob.match(/\0/g)) {
        throw new Error(`Glob contains invalid characters: "${glob}"`);
    }
    if (!globstar) {
        return normalize(glob);
    }
    const s = SEP_PATTERN.source;
    const badParentPattern = new RegExp(`(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`, "g");
    return normalize(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
}
export function joinGlobs(globs, { extended = false, globstar = false } = {}) {
    if (!globstar || globs.length == 0) {
        return join(...globs);
    }
    if (globs.length === 0)
        return ".";
    let joined;
    for (const glob of globs) {
        const path = glob;
        if (path.length > 0) {
            if (!joined)
                joined = path;
            else
                joined += `${SEP}${path}`;
        }
    }
    if (!joined)
        return ".";
    return normalizeGlob(joined, { extended, globstar });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdsb2IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0EsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUErQmxELE1BQU0sVUFBVSxZQUFZLENBQzFCLElBQVksRUFDWixFQUFFLFFBQVEsR0FBRyxJQUFJLEVBQUUsUUFBUSxFQUFFLGNBQWMsR0FBRyxJQUFJLEVBQUUsRUFBRSxHQUFHLFNBQVMsS0FDMUMsRUFBRTtJQUUxQixNQUFNLEdBQUcsR0FBRyxFQUFFLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN2RCxNQUFNLFFBQVEsR0FBRyxFQUFFLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUM1RCxNQUFNLElBQUksR0FBRyxFQUFFLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNuRCxNQUFNLE1BQU0sR0FBRyxFQUFFLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUM1QyxNQUFNLFFBQVEsR0FBRyxFQUFFLElBQUksU0FBUztRQUM5QixDQUFDLENBQUMsK0JBQStCO1FBQ2pDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQztJQUMzQixNQUFNLFFBQVEsR0FBRyxFQUFFLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUd6RCxNQUFNLFFBQVEsR0FBRyxF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