# EstreUI

[🇺🇸 English](./README.md)

> 빌드 없이 사용하는 모던 JavaScript UI 프레임워크

EstreUI는 빌드 과정 없이 바로 사용할 수 있는 모던 JavaScript UI 프레임워크입니다. NPM 패키지를 통해 프로젝트 스캐폴딩과 PWA 개발을 위한 도구를 제공합니다.

## 🚀 30초 만에 시작

```bash
npm create estreui@latest my-app
cd my-app
npm run dev
```

`https://localhost:8080/` 에 HTTPS 로 열리며, PWA Service Worker 스캐폴드와 jQuery 4 + 헬퍼 라이브러리가 미리 연결된 상태. 빌드 도구·번들러 설정 불필요.

- **라이브 데모·문서**: https://estreui.mpsolutions.kr
- **프레임워크 저장소**: https://github.com/SoliEstre/EstreUI.js
- **튜토리얼**: [10분 안에 jQuery SPA 만들기](https://estreui.tistory.com)

## ✨ 특징

- 🚀 **No-Build**: 빌드 과정 없이 바로 실행
- 📦 **쉬운 설치**: NPM을 통한 간편한 프로젝트 초기화
- 🔒 **PWA 지원**: HTTPS 로컬 개발 서버 내장
- 🎨 **완전한 UI 프레임워크**: 컴포넌트, 라우팅, 상태 관리 등 포함
- 📱 **반응형**: 모바일 및 데스크톱 모두 지원
- 🛠️ **CLI 도구**: 프로젝트 관리를 위한 명령줄 도구

---

## 📦 설치

### NPM Create 사용 (권장)

```bash
npm create estreui [프로젝트명]
```

### 전역 설치

```bash
npm install -g create-estreui
estreui init [프로젝트명]
```

---

## 🚀 빠른 시작

### 1. 새 프로젝트 생성

```bash
npm create estreui my-estreui-app
```

프로젝트 이름을 입력하면 자동으로 설정됩니다. 생략 시 이름을 입력받는 프롬프트가 표시됩니다.
다음이 자동으로 설정됩니다:
- ✅ EstreUI 코어 파일 복사 (로컬 또는 글로벌 패키지에서)
- ✅ `package.json` 생성
- ✅ 필수 라이브러리 설치 (JCODD, Doctre, Modernism, Alienese, jQuery)
- ✅ `index.html` 자동 구성
- ✅ `.gitignore` 생성/업데이트 (`node_modules` 포함)

> **참고**: `estreui`가 전역으로 설치되어 있는 경우, CLI는 새 프로젝트에 로컬로 설치할지 여부를 묻습니다. 로컬 설치를 건너뛰고 전역 패키지 자산을 사용하도록 선택할 수 있습니다.

### 2. 개발 서버 실행

```bash
cd my-estreui-app
estreui dev
```

그러면 다음 주소에서 앱을 확인할 수 있습니다:
```
https://localhost:8080/
```

> **참고**: 자체 서명 인증서를 사용하므로 브라우저 보안 경고가 표시됩니다. "고급" → "안전하지 않음으로 이동"을 클릭하여 진행하세요.

---

## 📚 CLI 명령어

### `estreui init`

새로운 EstreUI 프로젝트를 초기화합니다.

```bash
estreui init [프로젝트명]
```

**생성되는 파일 구조:**
```
my-estreui-app/
├── package.json
├── index.html
├── serviceWorker.js
├── webmanifest.json
├── stockHandlePrototypes.html   # 코어 프레임워크 프로토타입
├── customHandlePrototypes.html  # 사용자 커스텀 프로토타입
├── fixedTop.html                # 상단 고정 섹션 템플릿
├── fixedBottom.html             # 하단 고정 섹션 템플릿
├── mainMenu.html                # 메인 메뉴 템플릿
├── managedOverlay.html          # 오버레이 템플릿
├── serviceLoader.html           # 서비스 로더 템플릿
├── staticDoc.html               # 정적 콘텐츠 템플릿
├── instantDoc.html              # 인스턴트 콘텐츠 템플릿
├── scripts/
│   ├── boot.js                  # 부트 로직
│   ├── lib/                     # npm으로 관리되는 라이브러리
│   │   ├── jcodd.js
│   │   ├── doctre.js
│   │   ├── modernism.js
│   │   ├── alienese.js
│   │   └── jquery.js
│   ├── estreUi.js               # EstreUI 코어
│   ├── estreU0EEOZ.js           # EstreUI 유틸리티
│   └── main.js                  # 사용자 코드
├── styles/
│   ├── estreUi*.css             # EstreUI 스타일
│   └── main.css                 # 사용자 스타일
├── images/
├── vectors/
└── ...
```

### `estreui update`

최신 `estreui` 코어 패키지에서 프로젝트 자산을 업데이트합니다.

```bash
estreui update
```

**기능:**
- 설치된 최신 `estreui` 버전에서 `scripts/`, `styles/` 및 템플릿을 업데이트합니다.
- `.estreuiignore` 파일을 통해 사용자 커스텀 파일 덮어쓰기를 방지합니다.
- 기본 사용자 편집 파일(`scripts/main.js`, `styles/main.css` 등)을 보존합니다.

### `estreui dev`

HTTPS 개발 서버를 시작합니다.

```bash
estreui dev
```

**사양:**
- 기본 포트: `8080`
- HTTPS 지원 (PWA 테스트용)
- 자체 서명 인증서 자동 생성

### `estreui add <패키지명>`

프론트엔드 패키지를 추가합니다.

```bash
estreui add lodash
```

**자동으로 수행되는 작업:**
1. `npm install <패키지>` 실행
2. 브라우저용 JS 파일을 `scripts/lib/`로 복사
3. `index.html`에 `<script>` 태그 자동 추가

**예시:**
```bash
# Lodash 추가
estreui add lodash

# Moment.js 추가
estreui add moment

# Axios 추가
estreui add axios
```

### `estreui remove <패키지명>`

설치된 패키지를 제거합니다.

```bash
estreui remove lodash
```

**자동으로 수행되는 작업:**
1. `npm uninstall <패키지>` 실행
2. `scripts/lib/`에서 파일 삭제
3. `index.html`에서 `<script>` 태그 제거

---

## 🎯 포함된 라이브러리

EstreUI 프로젝트는 다음 라이브러리들과 함께 제공됩니다:

### jQuery (v4.0.0)
DOM 조작 및 이벤트 처리 라이브러리

### JCODD (v0.9.0)
JSON Characterized Object Data Definition - JSON 기반 경량 데이터 포맷

### Doctre (v1.1.1)
Document Object Cold Taste Refrigeration Effortlessness - HTML/JSON DOM 파서 및 직렬화

### Modernism (v0.7.0)
JavaScript 기능 감지 및 폴리필 관리

### Alienese (v0.7.0)
EstreUI JavaScript 패치 및 유틸리티

---

## 📖 프레임워크 사용법

### Service Worker (PWA)

EstreUI는 기본적으로 Service Worker를 포함하여 PWA를 지원합니다:

- 오프라인 캐싱
- 백그라운드 동기화
- 푸시 알림 지원

`serviceWorker.js` 파일을 커스터마이징하여 캐싱 전략을 변경할 수 있습니다.

### 커스터마이징

#### 스타일

`styles/main.css` 파일을 수정하여 앱의 스타일을 커스터마이징할 수 있습니다.

#### 로직

`scripts/main.js` 파일에 앱의 주요 로직을 작성합니다.

```javascript
// scripts/main.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('EstreUI 앱이 준비되었습니다!');
    
    // 앱 초기화 코드
});
```

---

## 🔧 프로젝트 구조

```
EstreUI for node/
├── bin/
│   └── estreui.js           # CLI 진입점
├── lib/
│   ├── commands/
│   │   ├── init.js          # init 명령
│   │   ├── update.js        # update 명령
│   │   ├── dev.js           # dev 명령
│   │   ├── add.js           # add 명령
│   │   └── remove.js        # remove 명령
│   └── utils.js             # 유틸리티 함수
├── templates/               # 프로젝트 템플릿
│   ├── scripts/
│   ├── styles/
│   ├── images/
│   └── index.html
├── package.json
└── README.md
```

---

## 📝 라이선스

ISC License - 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

## 🔗 링크

- **GitHub Repository & Documentation**: [EstreUI](https://github.com/SoliEstre/EstreUI.js)
- **NPM Package**: [npmjs.com/package/estreui](https://www.npmjs.com/package/estreui)

---

## ❓ 자주 묻는 질문

### Q: 빌드 과정이 필요한가요?
A: 아니요! EstreUI는 "No-Build" 철학을 따릅니다. 브라우저에서 바로 실행됩니다.

### Q: TypeScript를 사용할 수 있나요?
A: 네, TypeScript를 사용하려면 직접 컴파일 설정을 추가하면 됩니다. 하지만 EstreUI는 기본적으로 순수 JavaScript를 사용합니다.

### Q: 프로덕션 배포는 어떻게 하나요?
A: 프로젝트 폴더를 정적 파일 호스팅 서비스(GitHub Pages, Netlify, Vercel 등)에 배포하면 됩니다. HTTPS가 필요합니다 (PWA 요구사항).

### Q: 브라우저 호환성은?
A: 모던 브라우저(Chrome, Firefox, Safari, Edge)를 지원합니다. IE는 지원하지 않습니다.

### Q: npm으로 관리되는 라이브러리는 어떻게 업데이트하나요?
A: 프로젝트 폴더에서 `npm update` 명령을 실행하면 됩니다. CLI를 통해 추가한 패키지도 일반 npm 패키지처럼 관리됩니다.
**참고:** `estreui update` 명령은 프로젝트 루트에 `.estreuiignore` 파일이 있으면 이를 참고합니다. 파일에 나열된 항목(또는 기본 제외 목록인 `scripts/boot.js`, `scripts/main.js`, `styles/main.css`, `README.md`, `README_KR.md`, 그리고 여러 HTML 템플릿)은 업데이트 시 덮어쓰지 않습니다.

### Q: 왜 scripts/lib 폴더가 따로 있나요?
A: `scripts/lib/`에는 npm으로 관리되는 외부 라이브러리들이 저장됩니다. 이를 통해 EstreUI 코어 파일과 외부 라이브러리를 명확히 분리하고, 의존성 관리를 효율적으로 할 수 있습니다.

---

**Made with ❤️ by Estre Soliette**  
**Built with 🤖 Antigravity AI**

