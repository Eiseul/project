// 전역 변수 (필요 시 유지)
let starEffectEnabled = false;
let petalsSpawnedThisSession = false;
let pageHasLoaded = false;

/**
 * todos 배열 기준으로 완료한 목표 개수 계산 및 성장 이미지 업데이트
 */
function updateGrowth() {
  // todos 배열이 전역으로 정의되어 있다고 가정
  if (typeof todos === 'undefined' || !Array.isArray(todos)) {
    console.warn('todos 배열이 정의되어 있지 않습니다.');
    return;
  }

  // 완료한 목표 개수 계산
  const completedCount = todos.filter(todo => todo.checked).length;

  // 이미지 엘리먼트와 완료 개수 텍스트 가져오기
  const image = document.getElementById("growth-image");
  const countText = document.getElementById("completed-count");

  // 이전에 추가한 클래스가 있으면 제거
  image.classList.remove("large");

  // 완료 개수에 따른 이미지 변경 및 효과 제어
  if (completedCount >= 10) {
    image.src = "img/벚나무.png";
    starEffectEnabled = true;

    // 꽃잎 효과 1회 실행 (필요하면 spawnPetals 함수 호출)
    if (!petalsSpawnedThisSession && pageHasLoaded) {
      spawnPetals(30);
      petalsSpawnedThisSession = true;
    }
  } else if (completedCount >= 5) {
    image.src = "img/나무기둥.png";
    starEffectEnabled = false;
  } else {
    image.src = "img/새싹.png";
    starEffectEnabled = false;
  }

  // 완료 개수 텍스트 업데이트
  if (countText) {
    countText.textContent = `🌸완료한 목표 : ${completedCount}개🌸`;
  }
}
