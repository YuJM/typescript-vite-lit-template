/**
 * Custom matchers for Lit component testing
 */
import { expect } from 'vitest';
import { LitElement } from 'lit';

// Custom matcher for accessibility testing
expect.extend({
  toBeAccessible(received: Element) {
    const hasAriaLabel = received.getAttribute('aria-label');
    const hasRole = received.getAttribute('role');
    const hasTabIndex = received.hasAttribute('tabindex');
    
    const isAccessible = !!(hasAriaLabel || hasRole || hasTabIndex);
    
    return {
      pass: isAccessible,
      message: () => 
        isAccessible
          ? `Expected element not to be accessible`
          : `Expected element to be accessible (missing aria-label, role, or tabindex)`,
    };
  },

  toHaveValidLitElement(received: any) {
    const isLitElement = received instanceof LitElement;
    const hasUpdateComplete = typeof received.updateComplete === 'object';
    const hasShadowRoot = !!received.shadowRoot;
    
    const isValid = isLitElement && hasUpdateComplete && hasShadowRoot;
    
    return {
      pass: isValid,
      message: () => 
        isValid
          ? `Expected not to be a valid Lit element`
          : `Expected to be a valid Lit element with shadowRoot and updateComplete`,
    };
  },
});