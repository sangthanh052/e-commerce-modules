import type { Meta, StoryObj } from '@storybook/react-vite'
import { withRouter, reactRouterParameters } from 'storybook-addon-remix-react-router'

import ProductDetail from './ProductDetail'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Pages/ProductDetail',
  component: ProductDetail,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered'
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs']
} satisfies Meta<typeof ProductDetail>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  decorators: [withRouter],
  // render: () => (
  //   <MainLayout>
  //     <ProductDetail />
  //   </MainLayout>
  // ),
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: {
          nameId: 'Điện%20Thoại%20Vsmart%20Active%203%206GB64GB%20%20Hàng%20Chính%20Hãng-i.60afb2c76ef5b902180aacba'
        }
      },
      routing: { path: '/:nameId' }
    })
  }
}
