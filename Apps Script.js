const SHEET_NAME = "Sheet1";
const DRIVE_UPLOAD_FOLDER_URL = "https://drive.google.com/drive/folders/1XT-w5OcueQxoR9XJz8iq5GTcc1DyyMcc";
const NOTIFY_EMAIL = "clemensound@naver.com";
const SCRIPT_VERSION = "direct-drive-upload-v1-20260425";

function parseRequestData(e) {
  if (e && e.parameter && Object.keys(e.parameter).length > 0) {
    if (e.parameter.payload) {
      const payload = JSON.parse(e.parameter.payload);
      return Object.assign({}, e.parameter, payload);
    }
    return e.parameter;
  }

  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("No data received");
  }

  const raw = e.postData.contents;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
  } catch (error) {
    // Fall through to urlencoded parsing below.
  }

  const formData = raw.split("&").reduce(function (data, pair) {
    const parts = pair.split("=");
    if (!parts[0]) return data;

    const key = decodeURIComponent(parts[0].replace(/\+/g, " "));
    const value = decodeURIComponent(parts.slice(1).join("=").replace(/\+/g, " "));
    data[key] = value;
    return data;
  }, {});

  if (formData.payload) {
    const payload = JSON.parse(formData.payload);
    return Object.assign({}, formData, payload);
  }

  return formData;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return jsonResponse({
    result: "ok",
    script_version: SCRIPT_VERSION,
    drive_upload_folder_url: DRIVE_UPLOAD_FOLDER_URL
  });
}

function doPost(e) {
  try {
    const data = parseRequestData(e);
    Logger.log(JSON.stringify(data));

    const hasFormData = [
      "name",
      "phone",
      "email",
      "request_type",
      "venue_type",
      "message"
    ].some(function (key) {
      return data[key];
    });

    if (!hasFormData) {
      throw new Error("No form fields parsed");
    }

    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error("Sheet not found: " + SHEET_NAME);
    }

    data.attachment_name = DRIVE_UPLOAD_FOLDER_URL;

    sheet.appendRow([
      data.created_at ? new Date(data.created_at) : new Date(),
      data.name || "",
      data.phone || "",
      data.email || "",
      data.request_type || "",
      data.event_date || "",
      data.venue_type || "",
      data.audience_count || "",
      data.address || "",
      data.address_detail || "",
      data.mic_count || "",
      data.has_system || "",
      data.needs || "",
      data.message || "",
      data.attachment_name
    ]);

    sheet.sort(1, false);

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: "새 문의 접수 - " + (data.name || "이름 없음"),
      body:
        "새 문의가 접수되었습니다.\n\n" +
        "이름: " + (data.name || "") + "\n" +
        "연락처: " + (data.phone || "") + "\n" +
        "이메일: " + (data.email || "") + "\n" +
        "문의 유형: " + (data.request_type || "") + "\n" +
        "행사/방문 희망일: " + (data.event_date || "") + "\n" +
        "주소: " + (data.address || "") + "\n\n" +
        "내용:\n" + (data.message || "") + "\n\n" +
        "고객 직접 업로드 폴더: " + DRIVE_UPLOAD_FOLDER_URL
    });

    return jsonResponse({
      result: "success",
      script_version: SCRIPT_VERSION,
      attachment_name: data.attachment_name
    });
  } catch (error) {
    console.error(error);

    return jsonResponse({
      result: "error",
      script_version: SCRIPT_VERSION,
      error: error.message
    });
  }
}
