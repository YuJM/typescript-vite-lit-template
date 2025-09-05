import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import '../../../src/components/todo-list';
import { TodoList } from '../../../src/components/todo-list';
import { todoListFixtures, testData, eventFixtures } from '../../fixtures/component-data';
import { 
  createFixture, 
  waitForUpdate, 
  clickElement, 
  getTextFromShadowDOM,
  typeIntoInput,
  hasClassInShadowDOM 
} from '../../utils/test-helpers';
import '../../setup/custom-matchers';

describe('TodoList', () => {
  let element: TodoList;

  beforeEach(async () => {
    element = await fixture<TodoList>(html`<todo-list></todo-list>`);
  });

  describe('Initialization', () => {
    it('should render with default empty state', () => {
      expect(element).toBeDefined();
      expect(element).toHaveValidLitElement();
    });

    it('should display empty state message when no todos', () => {
      const statsText = getTextFromShadowDOM(element, '.stats');
      expect(statsText).toContain('No todos yet');
    });

    it('should have input field and add button', () => {
      const input = element.shadowRoot?.querySelector('input[type="text"]');
      const addButton = element.shadowRoot?.querySelector('button');
      
      expect(input).toBeTruthy();
      expect(addButton).toBeTruthy();
      expect(addButton?.textContent).toContain('Add');
    });
  });

  describe('Adding Todos', () => {
    it('should add a new todo when add button is clicked', async () => {
      await typeIntoInput(element, 'input[type="text"]', 'Test todo');
      await clickElement(element, 'button');
      
      const todoItems = element.shadowRoot?.querySelectorAll('li');
      expect(todoItems?.length).toBe(1);
      
      const todoText = getTextFromShadowDOM(element, 'li span');
      expect(todoText).toBe('Test todo');
    });

    it('should add todo when Enter key is pressed', async () => {
      await typeIntoInput(element, 'input[type="text"]', 'Test todo');
      
      const input = element.shadowRoot?.querySelector('input[type="text"]') as HTMLInputElement;
      
      // Simulate keypress event that the component listens for
      const keypressEvent = new KeyboardEvent('keypress', { 
        key: 'Enter', 
        bubbles: true,
        cancelable: true 
      });
      input.dispatchEvent(keypressEvent);
      await waitForUpdate(element);
      
      const todoItems = element.shadowRoot?.querySelectorAll('li');
      expect(todoItems?.length).toBe(1);
    });

    it('should clear input field after adding todo', async () => {
      await typeIntoInput(element, 'input[type="text"]', 'Test todo');
      await clickElement(element, 'button');
      
      const input = element.shadowRoot?.querySelector('input[type="text"]') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('should not add empty todos', async () => {
      await typeIntoInput(element, 'input[type="text"]', '   ');
      await clickElement(element, 'button');
      
      const todoItems = element.shadowRoot?.querySelectorAll('li');
      expect(todoItems?.length).toBe(0);
    });

    it('should trim whitespace from todo text', async () => {
      await typeIntoInput(element, 'input[type="text"]', '  Test todo  ');
      await clickElement(element, 'button');
      
      const todoText = getTextFromShadowDOM(element, 'li span');
      expect(todoText).toBe('Test todo');
    });

    it('should handle special characters in todo text', async () => {
      const specialText = testData.strings.special_characters;
      await typeIntoInput(element, 'input[type="text"]', specialText);
      await clickElement(element, 'button');
      
      const todoText = getTextFromShadowDOM(element, 'li span');
      expect(todoText).toBe(specialText);
    });

    it('should handle unicode characters in todo text', async () => {
      const unicodeText = testData.strings.unicode;
      await typeIntoInput(element, 'input[type="text"]', unicodeText);
      await clickElement(element, 'button');
      
      const todoText = getTextFromShadowDOM(element, 'li span');
      expect(todoText).toBe(unicodeText);
    });
  });

  describe('Todo Interactions', () => {
    beforeEach(async () => {
      // Add a test todo
      await typeIntoInput(element, 'input[type="text"]', 'Test todo');
      await clickElement(element, 'button');
    });

    it('should toggle todo completion when checkbox is clicked', async () => {
      const checkbox = element.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement;
      
      expect(checkbox.checked).toBe(false);
      
      checkbox.click();
      await waitForUpdate(element);
      
      expect(checkbox.checked).toBe(true);
      expect(hasClassInShadowDOM(element, 'li', 'completed')).toBe(true);
    });

    it('should delete todo when delete button is clicked', async () => {
      await clickElement(element, '.delete-btn');
      
      const todoItems = element.shadowRoot?.querySelectorAll('li');
      expect(todoItems?.length).toBe(0);
      
      const statsText = getTextFromShadowDOM(element, '.stats');
      expect(statsText).toContain('No todos yet');
    });

    it('should update completion stats when todos are toggled', async () => {
      // Add another todo
      await typeIntoInput(element, 'input[type="text"]', 'Second todo');
      await clickElement(element, 'button');
      
      // Toggle first todo
      const firstCheckbox = element.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement;
      firstCheckbox.click();
      await waitForUpdate(element);
      
      const statsText = getTextFromShadowDOM(element, '.stats');
      expect(statsText).toContain('1 of 2 completed');
    });
  });

  describe('Multiple Todos Management', () => {
    beforeEach(async () => {
      // Add multiple todos
      for (let i = 1; i <= 3; i++) {
        await typeIntoInput(element, 'input[type="text"]', `Todo ${i}`);
        await clickElement(element, 'button');
      }
    });

    it('should display all todos in order', () => {
      const todoItems = element.shadowRoot?.querySelectorAll('li');
      expect(todoItems?.length).toBe(3);
      
      const todoTexts = Array.from(todoItems || []).map(item => 
        item.querySelector('span')?.textContent
      );
      
      expect(todoTexts).toEqual(['Todo 1', 'Todo 2', 'Todo 3']);
    });

    it('should handle toggling multiple todos', async () => {
      const checkboxes = element.shadowRoot?.querySelectorAll('input[type="checkbox"]');
      
      // Toggle first and third todos
      (checkboxes?.[0] as HTMLInputElement)?.click();
      (checkboxes?.[2] as HTMLInputElement)?.click();
      await waitForUpdate(element);
      
      const statsText = getTextFromShadowDOM(element, '.stats');
      expect(statsText).toContain('2 of 3 completed');
    });

    it('should handle deleting todos from the middle', async () => {
      const deleteButtons = element.shadowRoot?.querySelectorAll('.delete-btn');
      
      // Delete middle todo
      (deleteButtons?.[1] as HTMLButtonElement)?.click();
      await waitForUpdate(element);
      
      const todoItems = element.shadowRoot?.querySelectorAll('li');
      expect(todoItems?.length).toBe(2);
      
      const remainingTexts = Array.from(todoItems || []).map(item => 
        item.querySelector('span')?.textContent
      );
      expect(remainingTexts).toEqual(['Todo 1', 'Todo 3']);
    });

    it('should maintain correct stats when all todos are completed', async () => {
      const checkboxes = element.shadowRoot?.querySelectorAll('input[type="checkbox"]');
      
      // Complete all todos
      checkboxes?.forEach(checkbox => {
        (checkbox as HTMLInputElement).click();
      });
      await waitForUpdate(element);
      
      const statsText = getTextFromShadowDOM(element, '.stats');
      expect(statsText).toContain('3 of 3 completed');
    });

    it('should maintain correct stats when all todos are deleted', async () => {
      const deleteButtons = element.shadowRoot?.querySelectorAll('.delete-btn');
      
      // Delete all todos
      for (let i = deleteButtons.length - 1; i >= 0; i--) {
        (deleteButtons[i] as HTMLButtonElement).click();
        await waitForUpdate(element);
      }
      
      const statsText = getTextFromShadowDOM(element, '.stats');
      expect(statsText).toContain('No todos yet');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long todo text', async () => {
      const longText = testData.strings.long;
      await typeIntoInput(element, 'input[type="text"]', longText);
      await clickElement(element, 'button');
      
      const todoText = getTextFromShadowDOM(element, 'li span');
      expect(todoText).toBe(longText);
    });

    it('should handle rapid todo additions', async () => {
      const todoCount = 10;
      
      for (let i = 0; i < todoCount; i++) {
        await typeIntoInput(element, 'input[type="text"]', `Rapid todo ${i}`);
        await clickElement(element, 'button');
      }
      
      const todoItems = element.shadowRoot?.querySelectorAll('li');
      expect(todoItems?.length).toBe(todoCount);
    });

    it('should handle rapid checkbox toggles', async () => {
      await typeIntoInput(element, 'input[type="text"]', 'Toggle test');
      await clickElement(element, 'button');
      
      const checkbox = element.shadowRoot?.querySelector('input[type="checkbox"]') as HTMLInputElement;
      
      // Rapid toggle
      for (let i = 0; i < 10; i++) {
        checkbox.click();
        await waitForUpdate(element);
      }
      
      // Should end up unchecked (even number of clicks)
      expect(checkbox.checked).toBe(false);
      expect(hasClassInShadowDOM(element, 'li', 'completed')).toBe(false);
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      await typeIntoInput(element, 'input[type="text"]', 'Accessibility test');
      await clickElement(element, 'button');
    });

    it('should have accessible form elements', () => {
      const input = element.shadowRoot?.querySelector('input[type="text"]');
      const button = element.shadowRoot?.querySelector('button');
      
      expect(input).toBeAccessible();
      expect(button).toBeAccessible();
    });

    it('should have accessible checkbox elements', () => {
      const checkbox = element.shadowRoot?.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeTruthy();
    });

    it('should support keyboard navigation', async () => {
      const input = element.shadowRoot?.querySelector('input[type="text"]') as HTMLInputElement;
      input.focus();
      
      // Type and press Enter
      input.value = 'Keyboard test';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      const keypressEvent = new KeyboardEvent('keypress', { 
        key: 'Enter', 
        bubbles: true,
        cancelable: true 
      });
      input.dispatchEvent(keypressEvent);
      await waitForUpdate(element);
      
      const todoItems = element.shadowRoot?.querySelectorAll('li');
      expect(todoItems?.length).toBe(2); // Original + new
    });

    it('should have proper semantic structure', () => {
      const heading = element.shadowRoot?.querySelector('h2');
      const list = element.shadowRoot?.querySelector('ul');
      
      expect(heading).toBeTruthy();
      expect(list).toBeTruthy();
      expect(heading?.textContent).toBe('Todo List');
    });
  });
});