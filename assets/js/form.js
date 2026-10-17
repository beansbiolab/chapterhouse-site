(function () {
    // 구글 Apps Script 웹 앱 URL을 여기에 붙여넣으세요
    const ENDPOINT = "https://script.google.com/macros/s/AKfycbzs2kdRJsjg630EPhdNe56IgZRA-6Ycgg45NeY432nusrsr55pCEOSi0OWNkC3MbZZh/exec";
  
    const form = document.getElementById("consultForm");
    const btn = document.getElementById("submitBtn");
    const msg = document.getElementById("formMessage");
    if (!form) return;
  
    function show(text, type) {
      msg.textContent = text;
      msg.className = "form-message " + (type || "");
    }
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const fd = new FormData(form);
      const childName = (fd.get("childName") || "").trim();
      const grade = fd.get("grade");
      const phone = (fd.get("phone") || "").trim();
  
      // 입력값 검사
      if (!childName) return show("자녀 이름을 입력해 주세요.", "error");
      if (!grade) return show("자녀 학년을 선택해 주세요.", "error");
      if (!phone) return show("학부모 연락처를 입력해 주세요.", "error");
      if (!/^[0-9\-\s+]{9,20}$/.test(phone)) {
        return show("연락처는 숫자와 하이픈(-)만 입력해 주세요.", "error");
      }
      if (!form.agree.checked) {
        return show("개인정보 수집·이용에 동의해 주세요.", "error");
      }
  
      // 스팸 함정 칸 (봇이면 전송하지 않고 성공처럼 보이게 처리)
      if (fd.get("website")) {
        form.reset();
        return show("신청이 접수되었습니다. 확인 후 연락드리겠습니다.", "ok");
      }
  
      if (ENDPOINT.indexOf("http") !== 0) {
        return show("전송 주소가 설정되지 않았습니다. 관리자에게 문의해 주세요.", "error");
      }
  
      // 중복 클릭 방지
      btn.disabled = true;
      btn.textContent = "전송 중...";
      show("", "");
  
      // 구글 Apps Script는 CORS 응답이 제한되어 no-cors로 전송
      fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams(fd)
      })
        .then(function () {
          form.reset();
          show("신청이 접수되었습니다. 확인 후 연락드리겠습니다.", "ok");
        })
        .catch(function () {
          show("전송에 실패했습니다. 잠시 후 다시 시도하거나 chapterhouse2027@gmail.com으로 문의해 주세요.", "error");
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = "신청하기";
        });
    });
  })();
  