import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
  title: 'Getting Started/Welcome',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Welcome: Story = {
  render: () => ({
    template: `
      <main style="font-family: Arial, sans-serif; padding: 24px;">
        <h1>NGX App Framework</h1>
        <p>Reusable Angular components, built with accessibility
        and maintainability in mind.</p>
      </main>
    `,
  }),
};
