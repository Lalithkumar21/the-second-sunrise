const SPREADSHEET_ID = "1k8vLoBumAOsdCOVc8MhMqgPl7VT7N-XIK9_KlcnfNiM";
const SHEET_NAME = "Sheet1";
const RATE_LIMIT_SECONDS = 600;

const SUPPORT_OPTIONS = [
  "Individual Counseling",
  "Adolescent Guidance",
  "Behaviour Addiction",
  "Substance Use Disorder",
  "Pre-Marital and Marital Counseling",
  "Exam Fear, Study Smart",
  "Positive Parenting Program",
  "Help me decide",
];

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const data = validatePayload_(payload);

    if (data.website) {
      return json_({ ok: true });
    }

    enforceRateLimit_(data.phone, data.name);

    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      const sheet = getSheet_();
      ensureHeader_(sheet);
      sheet.appendRow([
        new Date(),
        protectCell_(data.name),
        protectCell_(data.phone),
        protectCell_(data.support),
        protectCell_(data.message),
        protectCell_(data.source),
      ]);
    } finally {
      lock.releaseLock();
    }

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error.message || error) });
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  const raw = e.postData.contents;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return e.parameter || {};
  }
}

function validatePayload_(payload) {
  const data = {
    name: clean_(payload.name, 80),
    phone: clean_(payload.phone, 20),
    support: clean_(payload.support, 80),
    message: clean_(payload.message, 1000),
    source: clean_(payload.source, 200),
    website: clean_(payload.website, 120),
  };

  if (!data.name) throw new Error("Name is required.");
  if (!/^[0-9+()\-\s]{7,20}$/.test(data.phone)) throw new Error("Valid phone is required.");
  if (SUPPORT_OPTIONS.indexOf(data.support) === -1) throw new Error("Valid support option is required.");
  if (!data.message) throw new Error("Message is required.");

  return data;
}

function clean_(value, maxLength) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, maxLength);
}

function protectCell_(value) {
  const text = clean_(value, 1000);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function enforceRateLimit_(phone, name) {
  const cache = CacheService.getScriptCache();
  const key = "lead_" + digest_(phone + "|" + name.toLowerCase());
  if (cache.get(key)) throw new Error("Please wait before submitting again.");
  cache.put(key, "1", RATE_LIMIT_SECONDS);
}

function digest_(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value);
  return bytes
    .map(function (byte) {
      const normalized = byte < 0 ? byte + 256 : byte;
      return ("0" + normalized.toString(16)).slice(-2);
    })
    .join("");
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow(["Timestamp", "Name", "Phone", "Preferred Support", "Message", "Source Page"]);
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
