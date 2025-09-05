# TypeScript + Vite + Lit Template

[![CI](https://github.com/YuJM/typescript-vite-lit-template/workflows/CI/badge.svg)](https://github.com/YuJM/typescript-vite-lit-template/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

모던 웹 컴포넌트 개발을 위한 TypeScript, Vite, Lit 템플릿입니다.

## 🚀 이 템플릿 사용하기

[Use this template](https://github.com/YuJM/typescript-vite-lit-template/generate) 버튼을 클릭하여 이 템플릿을 기반으로 새 리포지토리를 생성하세요.

## 기능

- ⚡️ **Vite** - 빠른 개발 서버와 빌드
- 🔷 **TypeScript** - 타입 안정성
- 🎨 **Lit** - 웹 컴포넌트 프레임워크
- 🎯 **예제 컴포넌트** 포함:
  - Counter 컴포넌트
  - Todo List 컴포넌트

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속

### 프로덕션 빌드

```bash
npm run build
```

### 빌드 프리뷰

```bash
npm run preview
```

### 타입 체크

```bash
npm run typecheck
```

## 프로젝트 구조

```
typescript-vite-lit-template/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── my-element.ts    # Counter 예제 컴포넌트
│   │   └── todo-list.ts     # Todo List 예제 컴포넌트
│   ├── index.ts             # 컴포넌트 export
│   ├── main.ts              # 앱 엔트리 포인트
│   └── style.css            # 글로벌 스타일
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 컴포넌트 사용 예제

### Counter 컴포넌트

```html
<my-element name="World"></my-element>
```

### Todo List 컴포넌트

```html
<todo-list></todo-list>
```

## 새 컴포넌트 만들기

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('new-component')
export class NewComponent extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
  `;

  @property({ type: String })
  message = 'Hello';

  render() {
    return html`
      <div>${this.message}</div>
    `;
  }
}
```

## 라이선스

MIT