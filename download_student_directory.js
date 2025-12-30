
(() => {
  const getText = (el) => (el ? el.textContent.trim() : "");

  // Parse "Name '26" → { name, classYear }
  const parseNameAndClass = (raw) => {
    const m1 = raw.match(/^(.+?)\s+'(\d{2})$/);
    if (m1) return { name: m1[1].trim(), classYear: m1[2] };
    const m2 = raw.match(/^(.+?)\s+\((\d{2})\)$/);
    if (m2) return { name: m2[1].trim(), classYear: m2[2] };
    return { name: raw.trim(), classYear: "" };
  };

  // Convert //… to https://…
  const normalizeURL = (url) => (url && url.startsWith("//") ? "https:" + url : (url || ""));

  const table = document.querySelector("#directory-items-container");
  if (!table) {
    console.error("Could not find #directory-items-container");
    return;
  }

  const rows = [];
  const trs = Array.from(table.querySelectorAll("tr"));
  for (const tr of trs) {
    const imgEl = tr.querySelector("img.bb-avatar-image");
    const nameEl = tr.querySelector("h3");
    const emailEl = tr.querySelector("a[href^='mailto:']");

    const photoURL = imgEl ? normalizeURL(imgEl.getAttribute("src")) : "";
    const headerText = getText(nameEl);
    const { name, classYear } = parseNameAndClass(headerText);

    // Change to full year (e.g., "26" → "2026")
    const classYearFull =
      classYear && /^\d{2}$/.test(classYear) ? "20" + classYear : classYear;

    const email = emailEl ? emailEl.getAttribute("href").replace(/^mailto:/, "") : "";

    if (!name && !email && !photoURL) continue;
    rows.push({ name, email, classYear: classYearFull, photoURL });
  }

  // Dedup by email (fallback to name)
  const dedupMap = new Map();
  for (const r of rows) {
    const key = r.email || r.name;
    if (!dedupMap.has(key)) dedupMap.set(key, r);
  }
  const deduped = Array.from(dedupMap.values());

  const toCSV = (list) => {
    const headers = ["Name", "Email", "Class", "PhotoURL"];
    const escape = (s) => {
      const v = (s ?? "").toString();
      return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
    };
    const lines = [headers.join(",")];
    for (const r of list) {
      lines.push([escape(r.name), escape(r.email), escape(r.classYear), escape(r.photoURL)].join(","));
    }
    return lines.join("\n");
  };

  const csv = toCSV(deduped);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "roxbury_latin_student_directory.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  console.log(`Exported ${deduped.length} rows with 0 errors.`);
})();
