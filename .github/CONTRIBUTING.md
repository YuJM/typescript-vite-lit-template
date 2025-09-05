# 기여 가이드

이 프로젝트에 기여해주셔서 감사합니다! 다음은 기여를 위한 가이드라인입니다.

## 시작하기 전에

1. 이슈를 먼저 생성하여 작업하려는 내용을 논의해주세요
2. 기존 이슈를 확인하여 중복되지 않도록 해주세요
3. 프로젝트의 코드 스타일과 컨벤션을 따라주세요

## 개발 환경 설정

1. 저장소를 Fork합니다
2. Fork한 저장소를 로컬에 클론합니다
```bash
git clone https://github.com/[your-username]/typescript-vite-lit-template.git
```
3. 새로운 브랜치를 생성합니다
```bash
git checkout -b feature/your-feature-name
```
4. 의존성을 설치합니다
```bash
npm install
```

## 코드 스타일

- TypeScript를 사용합니다
- 들여쓰기는 2 스페이스를 사용합니다
- 세미콜론을 사용합니다
- 가능한 한 const를 사용합니다

## 커밋 메시지 컨벤션

- `feat:` 새로운 기능
- `fix:` 버그 수정
- `docs:` 문서 수정
- `style:` 코드 포맷팅, 세미콜론 누락 등
- `refactor:` 코드 리팩토링
- `test:` 테스트 추가 또는 수정
- `chore:` 빌드 프로세스 또는 도구 변경

예시:
```
feat: Add new counter component
fix: Resolve port conflict issue
docs: Update README with usage examples
```

## Pull Request 과정

1. 작업이 완료되면 커밋하고 푸시합니다
```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```
2. GitHub에서 Pull Request를 생성합니다
3. PR 템플릿을 작성합니다
4. 리뷰를 기다립니다
5. 요청된 변경사항이 있다면 수정합니다
6. 승인되면 머지됩니다

## 테스트

변경사항을 푸시하기 전에 다음을 확인해주세요:

```bash
# 타입 체크
npm run typecheck

# 빌드 테스트
npm run build

# 개발 서버 테스트
npm run dev
```

## 도움 요청

질문이나 도움이 필요하시면 이슈를 생성하거나 디스커션을 시작해주세요.

감사합니다! 🎉