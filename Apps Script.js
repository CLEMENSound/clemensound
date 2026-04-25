function doPost(e) {
  try {

    // =========================
    // 📌 1. 데이터 체크
    // =========================
    if (!e.postData || !e.postData.contents) {
      throw new Error("No data received");
    }

    let data;

    try {
      data = JSON.parse(e.postData.contents);
    } catch (e) {
      // 👉 JSON 아니면 fallback
      data = e.parameter;
    }
    Logger.log(data);
    
    // =========================
    // 📌 2. 시트 가져오기
    // =========================
    const sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("Sheet1");

    if (!sheet) {
      throw new Error("Sheet not found");
    }

    // =========================
    // 📁 3. 파일 업로드
    // =========================
    let fileUrl = "";

    if (data.file && data.file_name) {

      // 👉 용량 제한 체크 (약 10MB)
      if (data.file.length > 10 * 1024 * 1024) {
        throw new Error("파일 용량 초과");
      }

      const blob = Utilities.newBlob(
        Utilities.base64Decode(data.file),
        data.file_type,
        data.file_name
      );

      const folder = DriveApp.getFolderById("1XT-w5OcueQxoR9XJz8iq5GTcc1DyyMcc");

      const file = folder.createFile(blob).setName(
        (data.name || "unknown") + "_" +
        new Date().getTime() + "_" +
        data.file_name
      );

      // 👉 🔥 파일 공개 설정 (중요)
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      fileUrl = file.getUrl();
    }

    // =========================
    // 📊 4. 시트 저장
    // =========================
    sheet.appendRow([
      new Date(),
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
      fileUrl
    ]);

    // =========================
    // 📌 5. 정렬
    // =========================
    sheet.sort(1, false);

    // =========================
    // 📧 6. 이메일 알림
    // =========================
    MailApp.sendEmail({
      to: "clemensound@naver.com",
      subject: "📩 새 문의 - " + (data.name || ""),
      body:
        "📌 새 문의 접수\n\n" +
        "이름: " + (data.name || "") + "\n" +
        "연락처: " + (data.phone || "") + "\n" +
        "이메일: " + (data.email || "") + "\n" +
        "문의유형: " + (data.request_type || "") + "\n" +
        "행사일: " + (data.event_date || "") + "\n" +
        "주소: " + (data.address || "") + "\n\n" +
        "내용:\n" + (data.message || "") + "\n\n" +
        (fileUrl ? "📎 파일: " + fileUrl : "")
    });

    // =========================
    // ✅ 성공
    // =========================
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {

    // 👉 로그 남기기 (디버깅용)
    console.error(error);

    return ContentService
      .createTextOutput(JSON.stringify({
        result: "error",
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}