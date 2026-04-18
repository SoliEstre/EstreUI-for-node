# AGENTS.md — EstreUI for Node

> 이 파일은 `.npmignore` 로 제외되어 npm 배포 아티팩트에 포함되지 않는다. 내부 조율 전용.

이 워크스페이스는 EstreUI.js 생태계의 **Node 포팅 (`node`)** 파트이다.
파트 간 조율은 별도 워크스페이스인 **"EstreUI.js common workspace"** 에서 관리된다.

## 허브 진입

허브는 VS Code 의 별개 워크스페이스로 등록돼 있다.
- 허브 이름: `EstreUI.js common workspace`
- 읽을 파일:
  - 허브 AGENTS.md (허브 루트)
  - 이 파트의 메타: `.agent/parts/node.md` (허브 내)
  - 현재 작업 보드: `.agent/_coordination/STATE.md` (허브 내)

## 허브에 위임하는 것

- 파트 간 인터페이스 계약 (`_contracts/`)
- 동시 작업 조율 (`_coordination/`)
- 파트 간 비동기 질의 (`_questions/`)
- 파트 공통 교훈 (`_lessons/`)

## 이 워크스페이스에서 관리

- Node 환경용 코드 (`bin/`, `lib/`)
- 패키지 메타 (`package.json`, `package-lock.json`)
- 외부 의존 (`node_modules/` — gitignore 됨)
- 이 워크스페이스 자체 문서 (`README.md`, `README_KR.md`)

## 언어

대화·문서는 한국어. 허브 규약은 허브 AGENTS.md 참조.

## 커밋 규약

이 워크스페이스는 자체 git 리포를 보유한다. 커밋 시 `[Node][태그] 제목` 형식 권장.
