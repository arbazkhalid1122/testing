import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Type definitions for SVG path utilities
interface SVGPathEditor {
  normalize: (d: string) => string;
  reverseNormalized: (normalized: string) => string;
  reverse: (path: string, subpath?: number) => string;
}

function normalizePath(d: string): string {
  // preprocess "d" so that we have spaces between values
  d = d
    .replace(/,/g, " ")
    .replace(/([^eE])-/g, "$1 -")
    .replace(/\s*([achlmqstvzACHLMQSTVZ])\s*/g, " $1 ")
    .replace(/\s+/g, " ")
    .replace(
      /(\d*\.\d+([eE]-?\d+)?)((\.\d+)+)/g,
      (_: string, g1: string, g2: string, g3: string) =>
        g1 + g3.replaceAll(".", " ."),
    );

  // set up the variables used in this function
  const instructions = d
    .replace(/([achlmqstvzACHLMQSTVZ])\s?/g, "|$1")
    .split("|");
  const instructionLength = instructions.length;
  let i: number;
  let instruction: string;
  let op: string;
  let lop: string;
  let prevop: string | undefined;
  let args: number[] = [];
  let oargs: string[] = [];
  let alen: number;
  let a: number;
  let sx = 0,
    sy = 0,
    x = 0,
    y = 0;
  let cx = 0,
    cy = 0,
    cx2 = 0,
    cy2 = 0;
  let rx = 0,
    ry = 0,
    xrot = 0,
    lflag: string | number = 0,
    sweep: string | number = 0;
  let normalized = "";

  // we run through the instruction list starting at 1, not 0,
  // because we split up "|M x y ...." so the first element will
  // always be an empty string. By design.
  for (i = 1; i < instructionLength; i++) {
    // which instruction is this?
    instruction = instructions[i];
    op = instruction.substring(0, 1);
    lop = op.toLowerCase();

    // what are the arguments? note that we need to convert
    // all strings into numbers, or + will do silly things.
    oargs = instruction
      .replace(op, "")
      .trim()
      .split(" ")
      .filter((v: string) => v !== "");
    args = oargs.map(parseFloat);
    alen = args.length;

    // moveto command (plus possible lineto)
    if (lop === "m") {
      normalized += "M ";
      if (op === "m") {
        x += args[0];
        y += args[1];
      } else {
        x = args[0];
        y = args[1];
      }
      // records start position, for dealing
      // with the shape close operator ('Z')
      sx = x;
      sy = y;
      normalized += x + " " + y + " ";
      if (alen > 2) {
        for (a = 2; a < alen; a += 2) {
          if (op === "m") {
            x += args[a];
            y += args[a + 1];
          } else {
            x = args[a];
            y = args[a + 1];
          }
          normalized += "L " + x + " " + y + " ";
        }
      }
    }
    // lineto commands
    else if (lop === "l") {
      for (a = 0; a < alen; a += 2) {
        if (op === "l") {
          x += args[a];
          y += args[a + 1];
        } else {
          x = args[a];
          y = args[a + 1];
        }
        normalized += "L " + x + " " + y + " ";
      }
    } else if (lop === "h") {
      for (a = 0; a < alen; a++) {
        if (op === "h") {
          x += args[a];
        } else {
          x = args[a];
        }
        normalized += "L " + x + " " + y + " ";
      }
    } else if (lop === "v") {
      for (a = 0; a < alen; a++) {
        if (op === "v") {
          y += args[a];
        } else {
          y = args[a];
        }
        normalized += "L " + x + " " + y + " ";
      }
    }
    // quadratic curveto commands
    else if (lop === "q") {
      for (a = 0; a < alen; a += 4) {
        if (op === "q") {
          cx = x + args[a];
          cy = y + args[a + 1];
          x += args[a + 2];
          y += args[a + 3];
        } else {
          cx = args[a];
          cy = args[a + 1];
          x = args[a + 2];
          y = args[a + 3];
        }
        normalized += "Q " + cx + " " + cy + " " + x + " " + y + " ";
      }
    } else if (lop === "t") {
      for (a = 0; a < alen; a += 2) {
        if (["t", "q"].indexOf(prevop || "") > -1) {
          // reflect previous cx/cy over x/y
          cx = x + (x - cx);
          cy = y + (y - cy);
        } else {
          cx = x;
          cy = y;
        }
        // then get real end point
        if (op === "t") {
          x += args[a];
          y += args[a + 1];
        } else {
          x = args[a];
          y = args[a + 1];
        }
        normalized += "Q " + cx + " " + cy + " " + x + " " + y + " ";
        prevop = lop;
      }
    }
    // cubic curveto commands
    else if (lop === "c") {
      for (a = 0; a < alen; a += 6) {
        if (op === "c") {
          cx = x + args[a];
          cy = y + args[a + 1];
          cx2 = x + args[a + 2];
          cy2 = y + args[a + 3];
          x += args[a + 4];
          y += args[a + 5];
        } else {
          cx = args[a];
          cy = args[a + 1];
          cx2 = args[a + 2];
          cy2 = args[a + 3];
          x = args[a + 4];
          y = args[a + 5];
        }
        normalized +=
          "C " +
          cx +
          " " +
          cy +
          " " +
          cx2 +
          " " +
          cy2 +
          " " +
          x +
          " " +
          y +
          " ";
      }
    } else if (lop === "s") {
      for (a = 0; a < alen; a += 4) {
        cx = x;
        cy = y;
        if (["s", "c"].indexOf(prevop || "") > -1) {
          cx += x - cx2;
          cy += y - cy2;
        }
        // then get real control and end point
        if (op === "s") {
          cx2 = x + args[a];
          cy2 = y + args[a + 1];
          x += args[a + 2];
          y += args[a + 3];
        } else {
          cx2 = args[a];
          cy2 = args[a + 1];
          x = args[a + 2];
          y = args[a + 3];
        }
        normalized +=
          "C " +
          cx +
          " " +
          cy +
          " " +
          cx2 +
          " " +
          cy2 +
          " " +
          x +
          " " +
          y +
          " ";
      }
    }
    // arc command
    else if (lop === "a") {
      for (a = 0; a < alen; a += 7) {
        rx = args[a];
        ry = args[a + 1];
        xrot = args[a + 2];
        lflag = oargs[a + 3]; // we need the original string to deal with leading zeroes
        let fixed = false;
        if (typeof lflag === "string" && lflag.length > 1) {
          const b1 = parseInt(lflag[0]);
          const b2 = parseInt(lflag[1]);
          let rest: number | undefined = undefined;
          if (lflag.length > 2) rest = parseFloat(lflag.substring(2));
          args[a + 3] = b1;
          args.splice(a + 4, 0, b2);
          oargs.splice(a + 4, 0, "+");
          if (rest !== undefined) args.splice(a + 5, 0, rest);
          fixed = true;
        }
        lflag = args[a + 3];
        sweep = fixed ? args[a + 4] : oargs[a + 4]; // we need the original string to deal with leading zeroes
        if (!fixed && typeof sweep === "string" && sweep.length > 1) {
          args[a + 4] = parseInt(sweep[0]);
          args.splice(a + 5, 0, parseFloat(sweep.substring(1)));
        }
        sweep = args[a + 4];
        if (op === "a") {
          x += args[a + 5];
          y += args[a + 6];
        } else {
          x = args[a + 5];
          y = args[a + 6];
        }
        normalized +=
          "A " +
          rx +
          " " +
          ry +
          " " +
          xrot +
          " " +
          lflag +
          " " +
          sweep +
          " " +
          x +
          " " +
          y +
          " ";
      }
    } else if (lop === "z") {
      normalized += "Z ";
      // not unimportant: path closing changes the current x/y coordinate
      x = sx;
      y = sy;
    }
    prevop = lop;
  }
  return normalized.trim();
}

function reverseNormalizedPath(normalized: string): string {
  const terms = normalized.trim().split(" ");
  let term: string;
  const tlen = terms.length;
  const tlen1 = tlen - 1;
  let t: number;
  const reversed: string[] = [];
  let x: string, y: string;
  let pair: number, pairs: number, shift: number;
  const matcher = new RegExp("[QAZLCM]", "");
  const closed = terms.slice(-1)[0].toUpperCase() === "Z";

  for (t = 0; t < tlen; t++) {
    term = terms[t];
    // Is this an operator? If it is, run through its
    // argument list, which we know is fixed length.
    if (matcher.test(term)) {
      // Arc processing relies on not-just-coordinates
      if (term === "A") {
        reversed.push(terms[t + 5] === "0" ? "1" : "0");
        reversed.push(terms[t + 4]);
        reversed.push(terms[t + 3]);
        reversed.push(terms[t + 2]);
        reversed.push(terms[t + 1]);
        reversed.push(term);
        reversed.push(terms[t + 7]);
        reversed.push(terms[t + 6]);
        t += 7;
        continue;
      } else if (term === "C") {
        pairs = 3;
        shift = 2;
      } else if (term === "Q") {
        pairs = 2;
        shift = 1;
      } else if (term === "L") {
        pairs = 1;
        shift = 1;
      } else if (term === "M") {
        pairs = 1;
        shift = 0;
      } else {
        continue;
      }
      // do the argument reading and operator shifting
      if (pairs === shift) {
        reversed.push(term);
      }
      for (pair = 0; pair < pairs; pair++) {
        if (pair === shift) {
          reversed.push(term);
        }
        x = terms[++t];
        y = terms[++t];
        reversed.push(y);
        reversed.push(x);
      }
    } else {
      const pre = terms.slice(Math.max(t - 3, 0), t).join(" ");
      const post = terms.slice(t + 1, Math.min(t + 4, tlen1)).join(" ");
      const range = pre + " [" + term + "] " + post;
      throw new Error(
        "Error while trying to reverse normalized SVG path, at position " +
          t +
          " (" +
          range +
          ").\n" +
          "Either the path is not normalised, or it's malformed.",
      );
    }
  }
  reversed.push("M");
  // generating the reversed path string involves
  // running through our transformed terms in reverse.
  let revstring = "",
    r: number;
  const rlen1 = reversed.length - 1;
  for (r = rlen1; r > 0; r--) {
    revstring += reversed[r] + " ";
  }
  if (closed) revstring += "Z";
  revstring = revstring.replace(/M M/g, "Z M");
  return revstring;
}

function reverseSubPath(path: string, subpath?: number): string {
  const normalizedPath = normalizePath(path);
  let paths = normalizedPath.replace(/M/g, "|M").split("|");
  let revpath: string;
  paths.splice(0, 1);
  if (typeof subpath === "number" && subpath >= paths.length) {
    return normalizedPath;
  }
  if (typeof subpath !== "number") {
    paths = paths.map((spath: string) => reverseNormalizedPath(spath.trim()));
  } else {
    const spath = paths[subpath];
    if (spath) {
      revpath = reverseNormalizedPath(spath.trim());
      paths[subpath] = revpath;
    }
  }
  return paths.reverse().join(" ").replace(/ +/g, " ").trim();
}

// Our return object
export const SVGPathEditor: SVGPathEditor = {
  normalize: normalizePath,
  reverseNormalized: reverseNormalizedPath,
  reverse: reverseSubPath,
};

export const generatePreviewImageName = (file: File) => {
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join("");
  return `${randomName}-${file.name}`;
};
