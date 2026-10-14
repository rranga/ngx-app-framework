import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Design System/Themes',
};

export default meta;

type Story = StoryObj;

export const DarkTheme: Story = {
  render: () => ({
    template: `
      <section
        data-ngx-theme="dark"
        style="
          font-family: var(--ngx-font-family-base);
          color: var(--ngx-color-text);
          background: var(--ngx-color-background);
          padding: var(--ngx-space-6);
          border-radius: var(--ngx-radius-lg);
        "
      >
        <h2>Dark Theme</h2>
        <p>Background and text colors from the dark theme tokens.</p>

        <div
          style="
            background: var(--ngx-color-surface);
            border: var(--ngx-border-width) solid var(--ngx-color-border);
            padding: var(--ngx-space-4);
            border-radius: var(--ngx-radius-md);
          "
        >
          Surface
        </div>

        <button
          style="
            margin-top: var(--ngx-space-4);
            background: var(--ngx-color-primary);
            color: var(--ngx-color-background);
            border: 0;
            border-radius: var(--ngx-radius-md);
            padding: var(--ngx-space-3) var(--ngx-space-4);
          "
        >
          Primary action
        </button>
      </section>
    `,
  }),
};
