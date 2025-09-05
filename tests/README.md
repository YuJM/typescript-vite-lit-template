# Test Architecture Documentation

이 문서는 프로젝트의 테스트 아키텍처와 구조에 대해 설명합니다.

## 📁 Test Directory Structure

```
tests/
├── unit/                   # 단위 테스트
│   └── components/         # 컴포넌트 단위 테스트
├── integration/            # 통합 테스트
├── e2e/                   # End-to-End 테스트
├── fixtures/              # 테스트 데이터 및 픽스처
├── mocks/                 # 목 데이터 및 가짜 구현
├── utils/                 # 테스트 유틸리티 함수
└── setup/                 # 테스트 설정 파일
```

## 🧪 Test Types

### Unit Tests (`tests/unit/`)
- **목적**: 개별 컴포넌트나 함수의 격리된 테스트
- **도구**: Vitest, @open-wc/testing
- **범위**: 컴포넌트 렌더링, 속성 변경, 이벤트 처리
- **실행**: `npm run test:unit`

### Integration Tests (`tests/integration/`)
- **목적**: 컴포넌트 간 상호작용 및 통합 시나리오 테스트
- **도구**: Vitest, @open-wc/testing
- **범위**: 컴포넌트 간 통신, 상태 관리, 복합 시나리오
- **실행**: `npm run test:integration`

### E2E Tests (`tests/e2e/`)
- **목적**: 실제 브라우저에서의 전체 사용자 흐름 테스트
- **도구**: Playwright
- **범위**: 브라우저 상호작용, 네비게이션, 접근성
- **실행**: `npm run e2e`

## 🛠️ Test Utilities

### Test Helpers (`tests/utils/test-helpers.ts`)
Lit 컴포넌트 테스트를 위한 유틸리티 함수들:

```typescript
// 컴포넌트 픽스처 생성
await createFixture<MyElement>('my-element', { name: 'Test', count: 5 });

// 컴포넌트 업데이트 대기
await waitForUpdate(element);

// Shadow DOM 내 요소 클릭
await clickElement(element, 'button:nth-of-type(1)');

// Shadow DOM 내 텍스트 가져오기
const text = getTextFromShadowDOM(element, '.count');
```

### Custom Matchers (`tests/setup/custom-matchers.ts`)
확장된 Vitest 매처들:

```typescript
expect(element).toBeAccessible();
expect(element).toHaveValidLitElement();
```

### DOM Mocks (`tests/mocks/dom-mocks.ts`)
테스트 환경용 DOM API 목:

```typescript
// 모든 DOM 목 설정
setupDOMMocks();

// 특정 목 사용
localStorageMock.getItem('key');
matchMediaMock('(min-width: 768px)');
```

## 📊 Test Data & Fixtures

### Component Data (`tests/fixtures/component-data.ts`)
컴포넌트 테스트용 데이터:

```typescript
// MyElement 픽스처
myElementFixtures.default
myElementFixtures.custom
myElementFixtures.edge_cases

// TodoList 픽스처
todoListFixtures.empty
todoListFixtures.multiple_items
```

### Event Fixtures
이벤트 시뮬레이션용 데이터:

```typescript
eventFixtures.click
eventFixtures.keypress.enter
eventFixtures.input('test value')
```

## ⚙️ Configuration

### Vitest Configuration (`vitest.config.ts`)
- **Environment**: happy-dom
- **Setup Files**: `tests/setup/test-setup.ts`
- **Coverage**: 80% threshold
- **Timeouts**: 10초

### Playwright Configuration (`playwright.config.ts`)
- **Test Directory**: `tests/e2e/`
- **Browsers**: Chromium, Firefox, WebKit
- **Base URL**: http://localhost:5173
- **Reports**: HTML, JSON, JUnit

## 📋 Available Scripts

```bash
# 모든 테스트 (watch 모드)
npm test

# 단위 테스트만 실행
npm run test:unit

# 통합 테스트만 실행
npm run test:integration

# 커버리지 포함 테스트
npm run test:coverage

# E2E 테스트
npm run e2e

# E2E 테스트 (UI 모드)
npm run e2e:ui

# E2E 테스트 (디버그 모드)
npm run e2e:debug

# 모든 테스트 실행 (CI용)
npm run test:all

# CI 파이프라인용 테스트
npm run test:ci
```

## 🎯 Testing Best Practices

### Unit Testing
1. **격리**: 각 테스트는 독립적이어야 함
2. **AAA 패턴**: Arrange, Act, Assert
3. **의미있는 테스트명**: 동작과 기대결과를 명확히 표현
4. **Edge Cases**: 경계값과 예외상황 테스트

### Integration Testing
1. **실제 시나리오**: 사용자 관점의 상호작용 테스트
2. **상태 관리**: 컴포넌트 간 상태 동기화 확인
3. **이벤트 전파**: 커스텀 이벤트와 DOM 이벤트 처리

### E2E Testing
1. **사용자 흐름**: 실제 사용자 시나리오 기반
2. **Cross-browser**: 다양한 브라우저 환경 테스트
3. **접근성**: 키보드 네비게이션, 스크린 리더 호환성
4. **성능**: 로딩 시간, 반응성 검증

## 🔧 Troubleshooting

### Shadow DOM 테스트 문제
```typescript
// Shadow DOM 요소에 접근할 때
const button = element.shadowRoot?.querySelector('button');

// Playwright에서 Shadow DOM 접근
const text = await page.evaluate(() => {
  const element = document.querySelector('my-element');
  return element.shadowRoot.querySelector('h1').textContent;
});
```

### 비동기 업데이트 처리
```typescript
// Lit 컴포넌트 업데이트 완료 대기
await element.updateComplete;

// 추가 비동기 작업 대기
await waitForUpdate(element);
```

### 커스텀 이벤트 테스트
```typescript
// 이벤트 리스너 설정
let eventFired = false;
element.addEventListener('custom-event', () => {
  eventFired = true;
});

// 이벤트 트리거 후 확인
expect(eventFired).toBe(true);
```

## 📈 Coverage Goals

- **Lines**: ≥80%
- **Functions**: ≥80%
- **Branches**: ≥80%
- **Statements**: ≥80%

커버리지 리포트는 `coverage/` 디렉토리에 생성됩니다.

## 🚀 CI/CD Integration

GitHub Actions나 다른 CI/CD 파이프라인에서는 다음 명령어를 사용하세요:

```bash
npm run test:ci
```

이 명령어는 다음을 순차적으로 실행합니다:
1. TypeScript 타입 검사
2. 커버리지를 포함한 단위/통합 테스트
3. E2E 테스트

## 🤝 Contributing

새로운 컴포넌트나 기능을 추가할 때:

1. **단위 테스트 작성** (`tests/unit/components/`)
2. **통합 테스트 추가** (필요시)
3. **E2E 시나리오 업데이트** (UI 변경시)
4. **테스트 데이터 업데이트** (`tests/fixtures/`)
5. **커버리지 확인** (최소 80% 유지)

테스트는 코드 품질과 안정성을 보장하는 핵심 요소입니다. 모든 변경사항은 적절한 테스트와 함께 제출해주세요.