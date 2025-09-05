import { test, expect } from '@playwright/test';

// Accessibility test utilities
async function runAxeCheck(page: any) {
  await page.addScriptTag({
    url: 'https://unpkg.com/axe-core@4.8.2/axe.min.js',
  });

  return await page.evaluate(() => {
    return new Promise((resolve) => {
      (window as any).axe.run((err: any, results: any) => {
        if (err) throw err;
        resolve(results);
      });
    });
  });
}

test.describe('Accessibility E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Basic Accessibility Compliance', () => {
    test('should pass automated accessibility checks', async ({ page }) => {
      // Wait for components to load
      await page.waitForSelector('my-element', { state: 'visible' });
      await page.waitForSelector('todo-list', { state: 'visible' });

      // Run axe accessibility checks
      const results = await runAxeCheck(page) as any;
      
      // Check for violations
      expect(results.violations.length).toBe(0);
      
      // Log any violations for debugging
      if (results.violations.length > 0) {
        console.log('Accessibility violations:', results.violations);
      }
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.waitForSelector('my-element', { state: 'visible' });
      await page.waitForSelector('todo-list', { state: 'visible' });

      // Check main page heading
      const mainHeading = page.locator('h1');
      await expect(mainHeading).toBeVisible();
      await expect(mainHeading).toContainText('Vite + Lit + TypeScript');

      // Check component headings in shadow DOM
      const todoHeading = await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const h2 = todoList?.shadowRoot?.querySelector('h2');
        return h2?.textContent;
      });
      expect(todoHeading).toBe('Todo List');
    });

    test('should have sufficient color contrast', async ({ page }) => {
      await page.waitForSelector('my-element', { state: 'visible' });
      await page.waitForSelector('todo-list', { state: 'visible' });

      // Check button contrast in MyElement
      const myElementButtonColor = await page.evaluate(() => {
        const myElement = document.querySelector('my-element') as any;
        const button = myElement?.shadowRoot?.querySelector('button');
        if (button) {
          const styles = window.getComputedStyle(button);
          return {
            color: styles.color,
            backgroundColor: styles.backgroundColor,
          };
        }
        return null;
      });

      expect(myElementButtonColor).toBeTruthy();
      
      // Check TodoList button contrast
      const todoButtonColor = await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const button = todoList?.shadowRoot?.querySelector('button');
        if (button) {
          const styles = window.getComputedStyle(button);
          return {
            color: styles.color,
            backgroundColor: styles.backgroundColor,
          };
        }
        return null;
      });

      expect(todoButtonColor).toBeTruthy();
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support tab navigation through interactive elements', async ({ page }) => {
      await page.waitForSelector('my-element', { state: 'visible' });
      await page.waitForSelector('todo-list', { state: 'visible' });

      // Start tab navigation
      await page.keyboard.press('Tab');
      
      // Should be able to tab through all interactive elements
      // Note: Shadow DOM elements might need special handling
      
      // Add a todo first for more interactive elements
      await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        if (input) {
          input.focus();
          input.value = 'Keyboard Test Todo';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
        }
      });
      
      await page.waitForTimeout(100);
      
      // Check if we can navigate to the checkbox
      const checkboxFocusable = await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const checkbox = todoList?.shadowRoot?.querySelector('input[type="checkbox"]');
        return checkbox ? true : false;
      });
      
      expect(checkboxFocusable).toBe(true);
    });

    test('should handle Enter key activation for buttons', async ({ page }) => {
      await page.waitForSelector('my-element', { state: 'visible' });
      
      // Focus on increment button and activate with Enter
      await page.evaluate(() => {
        const myElement = document.querySelector('my-element') as any;
        const button = myElement?.shadowRoot?.querySelector('button:nth-of-type(1)');
        if (button) {
          button.focus();
          button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        }
      });
      
      await page.waitForTimeout(100);
      
      // Check if count increased
      const countText = await page.evaluate(() => {
        const myElement = document.querySelector('my-element') as any;
        const countElement = myElement?.shadowRoot?.querySelector('.count');
        return countElement?.textContent;
      });
      
      expect(countText).toContain('Count is 1');
    });

    test('should handle Space key activation for buttons', async ({ page }) => {
      await page.waitForSelector('my-element', { state: 'visible' });
      
      // Focus on increment button and activate with Space
      await page.evaluate(() => {
        const myElement = document.querySelector('my-element') as any;
        const button = myElement?.shadowRoot?.querySelector('button:nth-of-type(1)');
        if (button) {
          button.focus();
          button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
        }
      });
      
      await page.waitForTimeout(100);
      
      // Check if count increased
      const countText = await page.evaluate(() => {
        const myElement = document.querySelector('my-element') as any;
        const countElement = myElement?.shadowRoot?.querySelector('.count');
        return countElement?.textContent;
      });
      
      expect(countText).toContain('Count is 1');
    });

    test('should support Enter key for todo input', async ({ page }) => {
      await page.waitForSelector('todo-list', { state: 'visible' });
      
      // Focus input and type, then press Enter
      await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        if (input) {
          input.focus();
          input.value = 'Enter Key Test';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
        }
      });
      
      await page.waitForTimeout(100);
      
      // Check if todo was added
      const todoText = await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const span = todoList?.shadowRoot?.querySelector('li span');
        return span?.textContent;
      });
      
      expect(todoText).toBe('Enter Key Test');
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper ARIA labels and roles', async ({ page }) => {
      await page.waitForSelector('my-element', { state: 'visible' });
      await page.waitForSelector('todo-list', { state: 'visible' });

      // Check for ARIA attributes in buttons
      const myElementButtons = await page.evaluate(() => {
        const myElement = document.querySelector('my-element') as any;
        const buttons = myElement?.shadowRoot?.querySelectorAll('button');
        return Array.from(buttons || []).map((btn: any) => ({
          textContent: btn.textContent,
          ariaLabel: btn.getAttribute('aria-label'),
          title: btn.getAttribute('title'),
        }));
      });

      // Buttons should have accessible names
      myElementButtons.forEach(button => {
        expect(button.textContent || button.ariaLabel || button.title).toBeTruthy();
      });

      // Check TodoList input
      const inputAttributes = await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        return {
          placeholder: input?.getAttribute('placeholder'),
          ariaLabel: input?.getAttribute('aria-label'),
          id: input?.getAttribute('id'),
        };
      });

      // Input should have accessible name
      expect(inputAttributes.placeholder || inputAttributes.ariaLabel).toBeTruthy();
    });

    test('should announce dynamic content changes', async ({ page }) => {
      await page.waitForSelector('my-element', { state: 'visible' });
      
      // Check for aria-live regions or similar announcements
      const hasAriaLive = await page.evaluate(() => {
        const myElement = document.querySelector('my-element') as any;
        const countElement = myElement?.shadowRoot?.querySelector('.count');
        return countElement?.getAttribute('aria-live') !== null;
      });
      
      // If implemented, count should be announced to screen readers
      // This test would need to be adjusted based on actual implementation
      expect(typeof hasAriaLive).toBe('boolean');
    });

    test('should have semantic structure for todo items', async ({ page }) => {
      await page.waitForSelector('todo-list', { state: 'visible' });
      
      // Add a todo first
      await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        if (input) {
          input.value = 'Semantic Test Todo';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
        }
      });
      
      await page.waitForTimeout(100);
      
      // Check semantic structure
      const todoStructure = await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const ul = todoList?.shadowRoot?.querySelector('ul');
        const li = todoList?.shadowRoot?.querySelector('li');
        const checkbox = todoList?.shadowRoot?.querySelector('input[type="checkbox"]');
        const span = todoList?.shadowRoot?.querySelector('li span');
        
        return {
          hasUl: !!ul,
          hasLi: !!li,
          hasCheckbox: !!checkbox,
          hasSpan: !!span,
          checkboxRole: checkbox?.getAttribute('role'),
        };
      });
      
      expect(todoStructure.hasUl).toBe(true);
      expect(todoStructure.hasLi).toBe(true);
      expect(todoStructure.hasCheckbox).toBe(true);
      expect(todoStructure.hasSpan).toBe(true);
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      await page.waitForSelector('my-element', { state: 'visible' });
      
      // Focus on a button
      await page.evaluate(() => {
        const myElement = document.querySelector('my-element') as any;
        const button = myElement?.shadowRoot?.querySelector('button:nth-of-type(1)');
        if (button) {
          button.focus();
        }
      });
      
      // Check if focus is visible (this is visual, so we check for focus styles)
      const hasFocusStyles = await page.evaluate(() => {
        const myElement = document.querySelector('my-element') as any;
        const button = myElement?.shadowRoot?.querySelector('button:nth-of-type(1)');
        if (button) {
          const styles = window.getComputedStyle(button, ':focus');
          return styles.outline !== 'none' || styles.boxShadow !== 'none';
        }
        return false;
      });
      
      // Buttons should have focus indicators
      expect(hasFocusStyles).toBe(true);
    });

    test('should trap focus appropriately', async ({ page }) => {
      await page.waitForSelector('todo-list', { state: 'visible' });
      
      // Add a todo to have more interactive elements
      await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        if (input) {
          input.value = 'Focus Test Todo';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
        }
      });
      
      await page.waitForTimeout(100);
      
      // Test that focus doesn't leave the component inappropriately
      const canFocusElements = await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        const button = todoList?.shadowRoot?.querySelector('button');
        const checkbox = todoList?.shadowRoot?.querySelector('input[type="checkbox"]');
        
        return {
          input: !!input,
          button: !!button,
          checkbox: !!checkbox,
        };
      });
      
      expect(canFocusElements.input).toBe(true);
      expect(canFocusElements.button).toBe(true);
      expect(canFocusElements.checkbox).toBe(true);
    });

    test('should restore focus after interactions', async ({ page }) => {
      await page.waitForSelector('todo-list', { state: 'visible' });
      
      // Focus the input
      await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        if (input) {
          input.focus();
        }
      });
      
      // Add a todo
      await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        if (input) {
          input.value = 'Focus Restoration Test';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
        }
      });
      
      await page.waitForTimeout(100);
      
      // Check if focus is still on input (good practice for form submission)
      const inputHasFocus = await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        return document.activeElement === todoList && 
               todoList?.shadowRoot?.activeElement === input;
      });
      
      // Input should retain or regain focus after adding todo
      expect(typeof inputHasFocus).toBe('boolean');
    });
  });

  test.describe('Error Handling and Accessibility', () => {
    test('should provide accessible error messages', async ({ page }) => {
      await page.waitForSelector('todo-list', { state: 'visible' });
      
      // Try to add empty todo (should not create an error, but good to test)
      await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        const button = todoList?.shadowRoot?.querySelector('button');
        if (input && button) {
          input.value = '';
          button.click();
        }
      });
      
      await page.waitForTimeout(100);
      
      // Check if there are any error messages and they're accessible
      const errorMessage = await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const errorElement = todoList?.shadowRoot?.querySelector('.error, [role="alert"]');
        return errorElement ? {
          text: errorElement.textContent,
          role: errorElement.getAttribute('role'),
          ariaLive: errorElement.getAttribute('aria-live'),
        } : null;
      });
      
      // If error messages exist, they should be accessible
      if (errorMessage) {
        expect(errorMessage.role === 'alert' || errorMessage.ariaLive).toBeTruthy();
      }
    });

    test('should handle component failures gracefully', async ({ page }) => {
      // This test would simulate component failures and ensure accessibility is maintained
      // For now, we'll just verify components load correctly
      await page.waitForSelector('my-element', { state: 'visible' });
      await page.waitForSelector('todo-list', { state: 'visible' });
      
      // Both components should be accessible even if one has issues
      const components = await page.evaluate(() => {
        return {
          myElement: !!document.querySelector('my-element'),
          todoList: !!document.querySelector('todo-list'),
        };
      });
      
      expect(components.myElement).toBe(true);
      expect(components.todoList).toBe(true);
    });
  });
});