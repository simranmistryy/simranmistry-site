/* Loads the design-system namespace: prefers the compiled _ds_bundle.js, falls back to fetching + transpiling the component sources with Babel. */
window.__loadDS = async function (root, files, names) {
  function find(name) {
    for (const k of Object.getOwnPropertyNames(window)) {
      try { const v = window[k]; if (v && typeof v === "object" && typeof v[name] === "function") return v; } catch (e) {}
    }
    return null;
  }
  await new Promise((res) => {
    const s = document.createElement("script");
    s.src = root + "_ds_bundle.js";
    s.onload = res; s.onerror = res;
    document.head.appendChild(s);
  });
  let ns = find(names[names.length - 1]);
  if (ns) return ns;
  let src = "";
  for (const f of files) {
    const t = await (await fetch(root + f)).text();
    src += t.replace(/^\s*import[^;]*;\s*$/gm, "").replace(/^export /gm, "") + "\n";
  }
  src += "\nwindow.__DSNS = {" + names.join(",") + "};";
  const code = Babel.transform(src, { presets: [["react", { runtime: "classic" }]] }).code;
  new Function("React", code)(window.React);
  return window.__DSNS;
};
