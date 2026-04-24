# Fonts

웹에서 `Century Gothic`과 `HY태백`을 모든 방문자에게 동일하게 보이게 하려면 폰트 파일을 이 폴더에 넣고 `styles.css`의 `@font-face`로 연결해야 합니다.

현재 CSS는 먼저 방문자 기기에 설치된 폰트를 사용합니다.

```css
"Century Gothic", "HY태백", "HYTaebaek", "Noto Sans KR", "Malgun Gothic", system-ui, sans-serif
```

권장 파일명:

- `century-gothic.woff2`
- `hy-taebaek.woff2`

폰트 파일을 웹사이트에 배포할 때는 반드시 웹 사용 및 재배포 라이선스를 확인하세요.
