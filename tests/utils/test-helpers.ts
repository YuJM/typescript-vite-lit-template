/**
 * Utility functions for testing Lit components
 */
import { fixture, html, TemplateResult } from '@open-wc/testing';
import { LitElement } from 'lit';

/**
 * Create a test fixture for a Lit component with custom properties
 */
export async function createFixture<T extends LitElement>(
  tagName: string,
  properties: Record<string, any> = {}
): Promise<T> {
  // Create element using document.createElement instead of template literal
  const element = document.createElement(tagName) as T;
  
  // Set properties
  Object.entries(properties).forEach(([key, value]) => {
    (element as any)[key] = value;
  });
  
  // Add to DOM and wait for updates
  document.body.appendChild(element);
  await element.updateComplete;
  
  return element;
}

/**
 * Wait for a component to complete all updates
 */
export async function waitForUpdate(element: LitElement): Promise<void> {
  await element.updateComplete;
  // Give additional time for any async operations
  await new Promise(resolve => setTimeout(resolve, 0));
}

/**
 * Simulate user click on an element within shadow DOM
 */
export async function clickElement(
  host: LitElement,
  selector: string
): Promise<void> {
  const element = host.shadowRoot?.querySelector(selector) as HTMLElement;
  if (!element) {
    throw new Error(`Element with selector "${selector}" not found in shadow DOM`);
  }
  
  element.click();
  await waitForUpdate(host);
}

/**
 * Get text content from shadow DOM element
 */
export function getTextFromShadowDOM(
  host: LitElement,
  selector: string
): string | null {
  const element = host.shadowRoot?.querySelector(selector);
  return element?.textContent?.trim() || null;
}

/**
 * Type text into an input element within shadow DOM
 */
export async function typeIntoInput(
  host: LitElement,
  selector: string,
  text: string
): Promise<void> {
  const input = host.shadowRoot?.querySelector(selector) as HTMLInputElement;
  if (!input) {
    throw new Error(`Input with selector "${selector}" not found in shadow DOM`);
  }
  
  input.value = text;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await waitForUpdate(host);
}

/**
 * Check if element has specific CSS class in shadow DOM
 */
export function hasClassInShadowDOM(
  host: LitElement,
  selector: string,
  className: string
): boolean {
  const element = host.shadowRoot?.querySelector(selector);
  return element?.classList.contains(className) || false;
}

/**
 * Create a mock component for testing
 */
export function createMockComponent(
  tagName: string,
  properties: Record<string, any> = {}
): LitElement {
  class MockComponent extends LitElement {
    constructor() {
      super();
      Object.assign(this, properties);
    }

    render() {
      return html`<div>Mock ${tagName}</div>`;
    }
  }

  customElements.define(tagName, MockComponent);
  return new MockComponent();
}