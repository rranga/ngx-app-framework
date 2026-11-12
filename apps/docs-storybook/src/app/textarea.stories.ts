import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { Field, Textarea } from '@rranga/ngx-ui-components';
import { SHOWCASE_STYLES, validationMessage } from './story-helpers';

@Component({
  selector: 'ngx-docs-textarea-showcase',
  imports: [Field, Textarea],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: SHOWCASE_STYLES,
  template: `
    <ngx-field
      id="textarea-feedback"
      label="Feedback"
      [hint]="'Between 20 and 280 characters. ' + feedback().length + '/280'"
      [required]="true"
      [error]="feedbackError()"
    >
      <ngx-textarea
        #feedbackInput
        placeholder="What could we improve?"
        [rows]="4"
        [minLength]="20"
        [maxLength]="280"
        [(value)]="feedback"
        [(touched)]="feedbackTouched"
      />
    </ngx-field>

    <ngx-field id="textarea-notes" label="Notes (no resize)">
      <ngx-textarea resize="none" [rows]="3" placeholder="Fixed size" />
    </ngx-field>

    <ngx-field id="textarea-disabled" label="Disabled">
      <ngx-textarea [disabled]="true" value="This content cannot be edited." />
    </ngx-field>

    <ngx-field id="textarea-readonly" label="Read only">
      <ngx-textarea [readonly]="true" value="Selectable but not editable." />
    </ngx-field>
  `,
})
class TextareaShowcase {
  private readonly feedbackInput = viewChild.required<Textarea>('feedbackInput');

  readonly feedback = signal('');
  readonly feedbackTouched = signal(false);
  readonly feedbackError = computed(() =>
    this.feedbackTouched()
      ? validationMessage(this.feedbackInput().validity(), {
          valueMissing: 'Tell us what we could improve.',
          tooShort: 'Write at least 20 characters.',
        })
      : '',
  );
}

const meta: Meta = {
  title: 'Design System/Forms/Textarea',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

export const Examples: Story = {
  render: () => ({
    moduleMetadata: { imports: [TextareaShowcase] },
    template: '<ngx-docs-textarea-showcase />',
  }),
};
