import { test, expect, Page } from '@playwright/test';

// Test utilities
async function waitForComponent(page: Page, selector: string) {
  await page.waitForSelector(selector, { state: 'visible' });
  await page.waitForFunction(
    (sel) => {
      const element = document.querySelector(sel);
      return element && element.shadowRoot;
    },
    selector
  );
}

async function getTextFromShadowDOM(page: Page, hostSelector: string, innerSelector: string) {
  return await page.evaluate(
    ({ host, inner }) => {
      const hostElement = document.querySelector(host) as any;
      const innerElement = hostElement?.shadowRoot?.querySelector(inner);
      return innerElement?.textContent?.trim() || null;
    },
    { host: hostSelector, inner: innerSelector }
  );
}

async function clickInShadowDOM(page: Page, hostSelector: string, innerSelector: string) {
  await page.evaluate(
    ({ host, inner }) => {
      const hostElement = document.querySelector(host) as any;
      const innerElement = hostElement?.shadowRoot?.querySelector(inner);
      if (innerElement) {
        innerElement.click();
      }
    },
    { host: hostSelector, inner: innerSelector }
  );
}

test.describe('Application E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Page Structure and Loading', () => {
    test('should load the main page correctly', async ({ page }) => {
      await expect(page).toHaveTitle(/Vite \+ Lit \+ TypeScript/);
      await expect(page.locator('h1')).toContainText('Vite + Lit + TypeScript');
    });

    test('should display both main components', async ({ page }) => {
      const myElement = page.locator('my-element');
      const todoList = page.locator('todo-list');
      
      await expect(myElement).toBeVisible();
      await expect(todoList).toBeVisible();
    });

    test('should have proper page structure', async ({ page }) => {
      // Check main container
      const mainContainer = page.locator('#app');
      await expect(mainContainer).toBeVisible();
      
      // Check components are properly nested
      await waitForComponent(page, 'my-element');
      await waitForComponent(page, 'todo-list');
    });
  });

  test.describe('MyElement E2E Functionality', () => {
    test('should display Hello World message', async ({ page }) => {
      await waitForComponent(page, 'my-element');
      
      const greeting = await getTextFromShadowDOM(page, 'my-element', 'h1');
      expect(greeting).toContain('Hello, World!');
    });

    test('should increment counter when button is clicked', async ({ page }) => {
      await waitForComponent(page, 'my-element');
      
      // Check initial count
      let countText = await getTextFromShadowDOM(page, 'my-element', '.count');
      expect(countText).toContain('Count is 0');
      
      // Click increment button
      await clickInShadowDOM(page, 'my-element', 'button:nth-of-type(1)');
      await page.waitForTimeout(100); // Small delay for update
      
      // Check updated count
      countText = await getTextFromShadowDOM(page, 'my-element', '.count');
      expect(countText).toContain('Count is 1');
    });

    test('should decrement counter', async ({ page }) => {
      await waitForComponent(page, 'my-element');
      
      // First increment to have something to decrement
      await clickInShadowDOM(page, 'my-element', 'button:nth-of-type(1)');
      await clickInShadowDOM(page, 'my-element', 'button:nth-of-type(1)');
      await page.waitForTimeout(100);
      
      let countText = await getTextFromShadowDOM(page, 'my-element', '.count');
      expect(countText).toContain('Count is 2');
      
      // Click decrement button
      await clickInShadowDOM(page, 'my-element', 'button:nth-of-type(2)');
      await page.waitForTimeout(100);
      
      countText = await getTextFromShadowDOM(page, 'my-element', '.count');
      expect(countText).toContain('Count is 1');
    });

    test('should reset counter to zero', async ({ page }) => {
      await waitForComponent(page, 'my-element');
      
      // Increment several times
      for (let i = 0; i < 5; i++) {
        await clickInShadowDOM(page, 'my-element', 'button:nth-of-type(1)');
      }
      await page.waitForTimeout(100);
      
      let countText = await getTextFromShadowDOM(page, 'my-element', '.count');
      expect(countText).toContain('Count is 5');
      
      // Click reset button
      await clickInShadowDOM(page, 'my-element', 'button:nth-of-type(3)');
      await page.waitForTimeout(100);
      
      countText = await getTextFromShadowDOM(page, 'my-element', '.count');
      expect(countText).toContain('Count is 0');
    });
  });

  test.describe('TodoList E2E Functionality', () => {
    test('should display todo list heading and input', async ({ page }) => {
      await waitForComponent(page, 'todo-list');
      
      const heading = await getTextFromShadowDOM(page, 'todo-list', 'h2');
      expect(heading).toBe('Todo List');
      
      // Check if input and button are present
      const hasInput = await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        return !!todoList?.shadowRoot?.querySelector('input[type="text"]');
      });
      expect(hasInput).toBe(true);
    });

    test('should add a new todo', async ({ page }) => {
      await waitForComponent(page, 'todo-list');
      
      // Type in the input field
      await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        if (input) {
          input.value = 'E2E Test Todo';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      
      // Click add button
      await clickInShadowDOM(page, 'todo-list', 'button');
      await page.waitForTimeout(100);
      
      // Check if todo was added
      const todoText = await getTextFromShadowDOM(page, 'todo-list', 'li span');
      expect(todoText).toBe('E2E Test Todo');
      
      const statsText = await getTextFromShadowDOM(page, 'todo-list', '.stats');
      expect(statsText).toContain('0 of 1 completed');
    });

    test('should add todo with Enter key', async ({ page }) => {
      await waitForComponent(page, 'todo-list');
      
      // Focus and type in input, then press Enter
      await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        if (input) {
          input.focus();
          input.value = 'Enter Key Todo';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
        }
      });
      
      await page.waitForTimeout(100);
      
      const todoText = await getTextFromShadowDOM(page, 'todo-list', 'li span');
      expect(todoText).toBe('Enter Key Todo');
    });

    test('should toggle todo completion', async ({ page }) => {
      await waitForComponent(page, 'todo-list');
      
      // Add a todo first
      await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        if (input) {
          input.value = 'Toggle Test Todo';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await clickInShadowDOM(page, 'todo-list', 'button');
      await page.waitForTimeout(100);
      
      // Toggle the checkbox
      await clickInShadowDOM(page, 'todo-list', 'input[type="checkbox"]');
      await page.waitForTimeout(100);
      
      // Check if todo is marked as completed
      const hasCompletedClass = await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const li = todoList?.shadowRoot?.querySelector('li');
        return li?.classList.contains('completed');
      });
      expect(hasCompletedClass).toBe(true);
      
      const statsText = await getTextFromShadowDOM(page, 'todo-list', '.stats');
      expect(statsText).toContain('1 of 1 completed');
    });

    test('should delete a todo', async ({ page }) => {
      await waitForComponent(page, 'todo-list');
      
      // Add a todo first
      await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        if (input) {
          input.value = 'Delete Test Todo';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await clickInShadowDOM(page, 'todo-list', 'button');
      await page.waitForTimeout(100);
      
      // Delete the todo
      await clickInShadowDOM(page, 'todo-list', '.delete-btn');
      await page.waitForTimeout(100);
      
      // Check if todo was deleted
      const todoItems = await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        return todoList?.shadowRoot?.querySelectorAll('li').length || 0;
      });
      expect(todoItems).toBe(0);
      
      const statsText = await getTextFromShadowDOM(page, 'todo-list', '.stats');
      expect(statsText).toContain('No todos yet');
    });
  });

  test.describe('Cross-Component Interactions', () => {
    test('should maintain component independence', async ({ page }) => {
      await waitForComponent(page, 'my-element');
      await waitForComponent(page, 'todo-list');
      
      // Interact with both components simultaneously
      await clickInShadowDOM(page, 'my-element', 'button:nth-of-type(1)'); // Increment
      
      await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
        if (input) {
          input.value = 'Independence Test';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await clickInShadowDOM(page, 'todo-list', 'button'); // Add todo
      
      await page.waitForTimeout(100);
      
      // Verify both components updated correctly
      const countText = await getTextFromShadowDOM(page, 'my-element', '.count');
      expect(countText).toContain('Count is 1');
      
      const todoText = await getTextFromShadowDOM(page, 'todo-list', 'li span');
      expect(todoText).toBe('Independence Test');
    });

    test('should handle multiple rapid interactions', async ({ page }) => {
      await waitForComponent(page, 'my-element');
      await waitForComponent(page, 'todo-list');
      
      // Rapid interactions
      for (let i = 0; i < 3; i++) {
        await clickInShadowDOM(page, 'my-element', 'button:nth-of-type(1)');
        
        await page.evaluate((index) => {
          const todoList = document.querySelector('todo-list') as any;
          const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
          if (input) {
            input.value = `Rapid Todo ${index}`;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }, i);
        await clickInShadowDOM(page, 'todo-list', 'button');
      }
      
      await page.waitForTimeout(200);
      
      // Verify final states
      const countText = await getTextFromShadowDOM(page, 'my-element', '.count');
      expect(countText).toContain('Count is 3');
      
      const todoItems = await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        return todoList?.shadowRoot?.querySelectorAll('li').length || 0;
      });
      expect(todoItems).toBe(3);
    });
  });

  test.describe('Performance and Responsiveness', () => {
    test('should handle stress testing', async ({ page }) => {
      await waitForComponent(page, 'my-element');
      await waitForComponent(page, 'todo-list');
      
      // Stress test with many interactions
      const startTime = Date.now();
      
      for (let i = 0; i < 10; i++) {
        await clickInShadowDOM(page, 'my-element', 'button:nth-of-type(1)');
        
        await page.evaluate((index) => {
          const todoList = document.querySelector('todo-list') as any;
          const input = todoList?.shadowRoot?.querySelector('input[type="text"]');
          if (input) {
            input.value = `Stress Todo ${index}`;
            input.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }, i);
        await clickInShadowDOM(page, 'todo-list', 'button');
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (5 seconds)
      expect(duration).toBeLessThan(5000);
      
      // Verify final state
      const countText = await getTextFromShadowDOM(page, 'my-element', '.count');
      expect(countText).toContain('Count is 10');
      
      const todoItems = await page.evaluate(() => {
        const todoList = document.querySelector('todo-list') as any;
        return todoList?.shadowRoot?.querySelectorAll('li').length || 0;
      });
      expect(todoItems).toBe(10);
    });

    test('should be responsive on different viewport sizes', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      
      await waitForComponent(page, 'my-element');
      await waitForComponent(page, 'todo-list');
      
      // Components should still be visible and functional
      await expect(page.locator('my-element')).toBeVisible();
      await expect(page.locator('todo-list')).toBeVisible();
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await expect(page.locator('my-element')).toBeVisible();
      await expect(page.locator('todo-list')).toBeVisible();
      
      // Components should still function
      await clickInShadowDOM(page, 'my-element', 'button:nth-of-type(1)');
      await page.waitForTimeout(100);
      
      const countText = await getTextFromShadowDOM(page, 'my-element', '.count');
      expect(countText).toContain('Count is 1');
    });
  });
});