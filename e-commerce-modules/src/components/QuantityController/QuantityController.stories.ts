import type { Meta, StoryObj } from '@storybook/react-vite'

import { fn } from 'storybook/test'

import QuantityController from './QuantityController'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/QuantityController', //nhóm Components
  component: QuantityController,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],

  args: { onClick: fn() },

  argTypes: {
    max: { control: 'number' },
    value: { control: 'number' },
    disabled: { control: 'boolean' },
    onIncrease: { action: 'increased' },
    onDecrease: { action: 'decreased' },
    onType: { action: 'typed' },
    onFocusOut: { action: 'focusOut' }
  }
} satisfies Meta<typeof QuantityController>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    value: 1,
    max: 10
  }
}

export const WithMaxLimit: Story = {
  args: {
    value: 5,
    max: 5
  }
}

export const Disabled: Story = {
  args: {
    value: 2,
    max: 10,
    disabled: true
  }
}
