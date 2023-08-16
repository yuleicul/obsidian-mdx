import { ItemView, ViewStateResult } from 'obsidian'
import React from 'react'
import * as runtime from 'react/jsx-runtime'
// @ts-ignore
import ReactDOM from 'react-dom/client'
import { evaluate } from '@mdx-js/mdx'
import { remarkCodeHike } from '@code-hike/mdx'
import { CH } from '@code-hike/mdx/components'
// @ts-ignore
import theme from 'shiki/themes/github-dark.json'

export const MDX_PREVIEW = 'mdx-preview'

export type MDXPreviewState = {
  data: string
  basename: string
}

export class mdxPreview extends ItemView {
  root: any
  state: MDXPreviewState = {
    data: '',
    basename: '',
  }

  setState(state: MDXPreviewState, _result: ViewStateResult): Promise<void> {
    this.state = state
    return this.render()
  }

  getState() {
    return this.state
  }

  clear(): void {}

  getDisplayText(): string {
    return 'MDX Preview'
  }

  getViewType(): string {
    return MDX_PREVIEW
  }

  async render() {
    const fileContent = this.state.data
    // @ts-ignore
    const { default: MDXContent } = await evaluate(fileContent, {
      ...runtime,
      remarkPlugins: [
        [
          remarkCodeHike,
          {
            theme,
            autoImport: false,
          },
        ],
      ],
      development: false,
    })

    this.root = ReactDOM.createRoot(this.containerEl.children[1])
    this.root.render(
      <React.StrictMode>
        <div className="yuleicul-obsidian-mdx">
          <MDXContent components={{ CH }} />
        </div>
      </React.StrictMode>
    )
  }

  async onClose() {
    this.root?.unmount()
  }
}
