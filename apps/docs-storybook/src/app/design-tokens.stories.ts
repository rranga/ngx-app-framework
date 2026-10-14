import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Design System/Design Tokens',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Colors: Story = {
  render: () => ({
    template: `
      <section style="
        font-family: var(--ngx-font-family-base);
        color: var(--ngx-color-text);
        background: var(--ngx-color-background);
        padding: var(--ngx-space-6);
      ">
        <h2>Color Tokens</h2>
        <div style="display: grid; gap: var(--ngx-space-3);">
          <div style="background: var(--ngx-color-primary); color: white; padding: var(--ngx-space-4);">
            Primary
          </div>
          <div style="background: var(--ngx-color-success); color: white; padding: var(--ngx-space-4);">
            Success
          </div>
          <div style="background: var(--ngx-color-warning); color: white; padding: var(--ngx-space-4);">
            Warning
          </div>
          <div style="background: var(--ngx-color-error); color: white; padding: var(--ngx-space-4);">
            Error
          </div>
          <div style="background: var(--ngx-color-surface); border: 1px solid var(--ngx-color-border); padding: var(--ngx-space-4);">
            Surface
          </div>
        </div>
      </section>
    `,
  }),
};
