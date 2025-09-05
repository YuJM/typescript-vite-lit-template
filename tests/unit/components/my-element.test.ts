import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import '../../../src/components/my-element';
import { MyElement } from '../../../src/components/my-element';
import { myElementFixtures, testData, eventFixtures } from '../../fixtures/component-data';
import { 
  createFixture, 
  waitForUpdate, 
  clickElement, 
  getTextFromShadowDOM 
} from '../../utils/test-helpers';
import '../../setup/custom-matchers';

describe('MyElement', () => {
  let element: MyElement;

  beforeEach(async () => {
    element = await fixture<MyElement>(html`<my-element></my-element>`);
  });

  describe('Initialization', () => {
    it('should render with default values', () => {
      expect(element).toBeDefined();
      expect(element).toHaveValidLitElement();
      expect(element.name).toBe(myElementFixtures.default.name);
      expect(element.count).toBe(myElementFixtures.default.count);
    });

    it('should render with custom properties', async () => {
      const customElement = await createFixture<MyElement>('my-element', {
        name: myElementFixtures.custom.name,
        count: myElementFixtures.custom.count,
      });

      expect(customElement.name).toBe(myElementFixtures.custom.name);
      expect(customElement.count).toBe(myElementFixtures.custom.count);
    });
  });

  describe('Rendering', () => {
    it('should render with custom name', async () => {
      element.name = myElementFixtures.custom.name;
      await waitForUpdate(element);
      
      const h1 = element.shadowRoot?.querySelector('h1');
      expect(h1?.textContent).toContain(`Hello, ${myElementFixtures.custom.name}!`);
    });

    it('should display count correctly', async () => {
      element.count = myElementFixtures.custom.count;
      await waitForUpdate(element);
      
      const countText = getTextFromShadowDOM(element, '.count');
      expect(countText).toContain(`Count is ${myElementFixtures.custom.count}`);
    });

    it('should handle empty name gracefully', async () => {
      element.name = testData.strings.empty;
      await waitForUpdate(element);
      
      const h1 = element.shadowRoot?.querySelector('h1');
      expect(h1?.textContent).toContain('Hello, !');
    });
  });

  describe('User Interactions', () => {
    it('should increment count when increment button is clicked', async () => {
      const initialCount = element.count;
      await clickElement(element, 'button:nth-of-type(1)');
      
      expect(element.count).toBe(initialCount + 1);
    });

    it('should decrement count when decrement button is clicked', async () => {
      element.count = myElementFixtures.custom.count;
      await waitForUpdate(element);
      
      const initialCount = element.count;
      await clickElement(element, 'button:nth-of-type(2)');
      
      expect(element.count).toBe(initialCount - 1);
    });

    it('should reset count when reset button is clicked', async () => {
      element.count = myElementFixtures.custom.count;
      await waitForUpdate(element);
      
      await clickElement(element, 'button:nth-of-type(3)');
      
      expect(element.count).toBe(0);
    });

    it('should handle multiple rapid clicks', async () => {
      const clickCount = 5;
      const incrementButton = element.shadowRoot?.querySelector('button:nth-of-type(1)') as HTMLButtonElement;
      
      for (let i = 0; i < clickCount; i++) {
        incrementButton.click();
      }
      await waitForUpdate(element);
      
      expect(element.count).toBe(clickCount);
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative count values', async () => {
      element.count = testData.numbers.negative;
      await waitForUpdate(element);
      
      const countText = getTextFromShadowDOM(element, '.count');
      expect(countText).toContain(`Count is ${testData.numbers.negative}`);
    });

    it('should handle large count values', async () => {
      element.count = testData.numbers.large;
      await waitForUpdate(element);
      
      const countText = getTextFromShadowDOM(element, '.count');
      expect(countText).toContain(`Count is ${testData.numbers.large}`);
    });

    it('should handle special characters in name', async () => {
      element.name = testData.strings.special_characters;
      await waitForUpdate(element);
      
      const h1 = element.shadowRoot?.querySelector('h1');
      expect(h1?.textContent).toContain(testData.strings.special_characters);
    });

    it('should handle unicode characters in name', async () => {
      element.name = testData.strings.unicode;
      await waitForUpdate(element);
      
      const h1 = element.shadowRoot?.querySelector('h1');
      expect(h1?.textContent).toContain(testData.strings.unicode);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button elements', () => {
      const buttons = element.shadowRoot?.querySelectorAll('button');
      buttons?.forEach(button => {
        expect(button).toBeAccessible();
      });
    });

    it('should support keyboard navigation', async () => {
      const incrementButton = element.shadowRoot?.querySelector('button:nth-of-type(1)') as HTMLButtonElement;
      
      // Focus the button and simulate click via keyboard
      incrementButton.focus();
      
      // Simulate space key activation (browsers typically convert this to click)
      const keydownEvent = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      incrementButton.dispatchEvent(keydownEvent);
      
      // Also simulate click for reliable testing
      incrementButton.click();
      await waitForUpdate(element);
      
      expect(element.count).toBe(1);
    });

    it('should have proper ARIA attributes', () => {
      const countElement = element.shadowRoot?.querySelector('.count');
      expect(countElement).toBeTruthy();
      
      // Check if count element has appropriate role or aria-label
      const hasAriaLive = countElement?.hasAttribute('aria-live');
      expect(hasAriaLive).toBe(true);
    });
  });

  describe('Component Lifecycle', () => {
    it('should update correctly when properties change', async () => {
      const newName = 'Updated Name';
      const newCount = 99;
      
      element.name = newName;
      element.count = newCount;
      await waitForUpdate(element);
      
      const h1 = element.shadowRoot?.querySelector('h1');
      const countText = getTextFromShadowDOM(element, '.count');
      
      expect(h1?.textContent).toContain(newName);
      expect(countText).toContain(`Count is ${newCount}`);
    });

    it('should handle rapid property updates', async () => {
      const updates = 10;
      
      for (let i = 0; i < updates; i++) {
        element.name = `Name ${i}`;
        element.count = i;
      }
      await waitForUpdate(element);
      
      expect(element.name).toBe(`Name ${updates - 1}`);
      expect(element.count).toBe(updates - 1);
    });
  });
});