import type { Meta, StoryObj } from '@storybook/react-vite'
import { reactRouterParameters, withRouter } from 'storybook-addon-remix-react-router'

import Login from './Login'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/Login',
  component: Login,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'full'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof Login>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const LoginPage: Story = {
  // render: () => (
  //   <RegisterLayout>
  //     <Login />
  //   </RegisterLayout>
  // ),
  decorators: [withRouter],
  parameters: {
    reactRouter: reactRouterParameters({
      routing: { path: '/login' }
    })
  }
}
