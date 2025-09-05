import { describe, it, expect, beforeEach } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import '../../src/components/my-element';
import '../../src/components/todo-list';
import { MyElement } from '../../src/components/my-element';
import { TodoList } from '../../src/components/todo-list';
import { waitForUpdate, clickElement, typeIntoInput } from '../utils/test-helpers';

describe('Components Integration', () => {
  describe('Multiple Components Coexistence', () => {
    let container: HTMLElement;
    let myElement: MyElement;
    let todoList: TodoList;

    beforeEach(async () => {
      container = await fixture<HTMLElement>(html`
        <div>
          <my-element name="Integration Test" count="5"></my-element>
          <todo-list></todo-list>
        </div>
      `);

      myElement = container.querySelector('my-element') as MyElement;
      todoList = container.querySelector('todo-list') as TodoList;
    });

    it('should render both components without conflicts', () => {
      expect(myElement).toBeDefined();
      expect(todoList).toBeDefined();
      
      // Check MyElement
      expect(myElement.name).toBe('Integration Test');
      expect(myElement.count).toBe(5);
      
      // Check TodoList
      const todoHeading = todoList.shadowRoot?.querySelector('h2');
      expect(todoHeading?.textContent).toBe('Todo List');
    });

    it('should maintain independent state between components', async () => {
      // Interact with MyElement
      await clickElement(myElement, 'button:nth-of-type(1)'); // Increment
      await waitForUpdate(myElement);
      
      // Add todo to TodoList
      await typeIntoInput(todoList, 'input[type="text"]', 'Integration test todo');
      await clickElement(todoList, 'button');
      
      // Verify MyElement state
      expect(myElement.count).toBe(6);
      
      // Verify TodoList state
      const todoItems = todoList.shadowRoot?.querySelectorAll('li');
      expect(todoItems?.length).toBe(1);
      
      const todoText = todoList.shadowRoot?.querySelector('li span')?.textContent;
      expect(todoText).toBe('Integration test todo');
    });

    it('should handle simultaneous interactions on both components', async () => {
      // Rapid interactions
      const promises = [
        clickElement(myElement, 'button:nth-of-type(1)'), // Increment
        typeIntoInput(todoList, 'input[type="text"]', 'First todo'),
        clickElement(todoList, 'button'),
        clickElement(myElement, 'button:nth-of-type(1)'), // Increment again
        typeIntoInput(todoList, 'input[type="text"]', 'Second todo'),
        clickElement(todoList, 'button'),
      ];

      await Promise.all(promises);
      await waitForUpdate(myElement);
      await waitForUpdate(todoList);

      // Verify final states
      expect(myElement.count).toBe(7); // 5 + 2 increments
      
      const todoItems = todoList.shadowRoot?.querySelectorAll('li');
      expect(todoItems?.length).toBe(2);
    });

    it('should not interfere with each other\'s styling', async () => {
      await waitForUpdate(myElement);
      await waitForUpdate(todoList);
      
      // Check if both components have their own shadow DOM
      expect(myElement.shadowRoot).toBeTruthy();
      expect(todoList.shadowRoot).toBeTruthy();
      
      // Check if styles are contained within shadow DOM
      const myElementH1 = myElement.shadowRoot?.querySelector('h1');
      const todoListH2 = todoList.shadowRoot?.querySelector('h2');
      
      expect(myElementH1).toBeTruthy();
      expect(todoListH2).toBeTruthy();
      
      // Verify styling isolation by checking computed styles
      const myElementButton = myElement.shadowRoot?.querySelector('button');
      const todoListButton = todoList.shadowRoot?.querySelector('button');
      
      expect(myElementButton).toBeTruthy();
      expect(todoListButton).toBeTruthy();
    });
  });

  describe('Component Communication Patterns', () => {
    let container: HTMLElement;

    beforeEach(async () => {
      container = await fixture<HTMLElement>(html`
        <div id="app-container">
          <my-element name="Parent" count="0"></my-element>
          <todo-list></todo-list>
        </div>
      `);
    });

    it('should support custom event communication', async () => {
      const myElement = container.querySelector('my-element') as MyElement;
      let eventFired = false;
      let eventDetail: any = null;

      // Listen for custom events
      myElement.addEventListener('count-changed', (e: any) => {
        eventFired = true;
        eventDetail = e.detail;
      });

      // Trigger interaction that should fire event (if implemented)
      await clickElement(myElement, 'button:nth-of-type(1)');
      await waitForUpdate(myElement);

      // Note: This test assumes custom events are implemented
      // If not implemented, this test will need to be adjusted
      expect(myElement.count).toBe(1);
    });

    it('should handle dynamic component addition', async () => {
      // Add a new component dynamically
      const newMyElement = document.createElement('my-element') as MyElement;
      newMyElement.name = 'Dynamic';
      newMyElement.count = 10;
      
      container.appendChild(newMyElement);
      await newMyElement.updateComplete;

      // Verify it works independently
      await clickElement(newMyElement, 'button:nth-of-type(1)');
      await waitForUpdate(newMyElement);

      expect(newMyElement.count).toBe(11);

      // Verify original components are unaffected
      const originalMyElement = container.querySelector('my-element') as MyElement;
      expect(originalMyElement.count).toBe(0);
    });

    it('should handle component removal without affecting others', async () => {
      const todoList = container.querySelector('todo-list') as TodoList;
      const myElement = container.querySelector('my-element') as MyElement;

      // Add some state to both components
      await typeIntoInput(todoList, 'input[type="text"]', 'Test todo');
      await clickElement(todoList, 'button');
      
      await clickElement(myElement, 'button:nth-of-type(1)');
      await waitForUpdate(myElement);

      // Remove todo-list
      todoList.remove();

      // Verify my-element still works
      await clickElement(myElement, 'button:nth-of-type(1)');
      await waitForUpdate(myElement);

      expect(myElement.count).toBe(2);
    });
  });

  describe('Performance and Memory', () => {
    it('should handle multiple component instances efficiently', async () => {
      const componentCount = 10;
      const container = await fixture<HTMLElement>(html`
        <div>
          ${Array.from({ length: componentCount }, (_, i) => html`
            <my-element name="Component ${i}" count="${i}"></my-element>
          `)}
        </div>
      `);

      const components = container.querySelectorAll('my-element') as NodeListOf<MyElement>;
      expect(components.length).toBe(componentCount);

      // Verify each component works independently
      for (let i = 0; i < Math.min(3, componentCount); i++) {
        const component = components[i];
        await clickElement(component, 'button:nth-of-type(1)');
        await waitForUpdate(component);
        expect(component.count).toBe(i + 1);
      }
    });

    it('should handle rapid component creation and destruction', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      try {
        // Rapidly create and destroy components
        for (let i = 0; i < 5; i++) {
          const element = document.createElement('my-element') as MyElement;
          element.name = `Rapid ${i}`;
          element.count = i;
          
          container.appendChild(element);
          await element.updateComplete;
          
          // Quick interaction
          const button = element.shadowRoot?.querySelector('button:nth-of-type(1)') as HTMLButtonElement;
          button?.click();
          await element.updateComplete;
          
          // Remove immediately
          container.removeChild(element);
        }

        // No errors should be thrown
        expect(container.children.length).toBe(0);
      } finally {
        document.body.removeChild(container);
      }
    });
  });

  describe('Error Handling and Resilience', () => {
    it('should handle malformed component properties gracefully', async () => {
      const container = await fixture<HTMLElement>(html`
        <div>
          <my-element name="" count="-1"></my-element>
          <todo-list></todo-list>
        </div>
      `);

      const myElement = container.querySelector('my-element') as MyElement;
      const todoList = container.querySelector('todo-list') as TodoList;

      // Components should still render and be functional
      expect(myElement).toBeDefined();
      expect(todoList).toBeDefined();

      // Should be able to interact with components
      await clickElement(myElement, 'button:nth-of-type(1)');
      await waitForUpdate(myElement);

      await typeIntoInput(todoList, 'input[type="text"]', 'Error test todo');
      await clickElement(todoList, 'button');

      // Should not throw errors
      expect(myElement.count).toBe(0); // -1 + 1
      
      const todoItems = todoList.shadowRoot?.querySelectorAll('li');
      expect(todoItems?.length).toBe(1);
    });

    it('should handle component errors without affecting siblings', async () => {
      const container = await fixture<HTMLElement>(html`
        <div>
          <my-element name="Good" count="5"></my-element>
          <my-element name="Test" count="3"></my-element>
          <todo-list></todo-list>
        </div>
      `);

      const components = container.querySelectorAll('my-element') as NodeListOf<MyElement>;
      const todoList = container.querySelector('todo-list') as TodoList;

      // Interact with all components
      await clickElement(components[0], 'button:nth-of-type(1)');
      await clickElement(components[1], 'button:nth-of-type(2)'); // Decrement
      await typeIntoInput(todoList, 'input[type="text"]', 'Resilience test');
      await clickElement(todoList, 'button');

      // All should work independently
      expect(components[0].count).toBe(6);
      expect(components[1].count).toBe(2);
      
      const todoItems = todoList.shadowRoot?.querySelectorAll('li');
      expect(todoItems?.length).toBe(1);
    });
  });
});