import { Editor, MarkdownView, Plugin } from 'obsidian'
import { MDXPreviewState, MDX_PREVIEW, mdxPreview } from './mdxPreview'

export default class ObsidianMDX extends Plugin {
  async onload() {
    this.registerView(MDX_PREVIEW, (leaf) => new mdxPreview(leaf))

    this.addCommand({
      id: 'preview',
      name: 'Preview',
      editorCheckCallback: (
        checking: boolean,
        _editor: Editor,
        view: MarkdownView
      ) => {
        if (['mdx', 'md'].includes(view.file.extension)) {
          if (!checking) {
            this.app.workspace.detachLeavesOfType(MDX_PREVIEW)
            const leaf = this.app.workspace.getLeaf('tab')
            const viewState: MDXPreviewState = {
              data: view.data,
              basename: view.file.basename,
            }
            leaf.setViewState({
              type: MDX_PREVIEW,
              state: viewState,
              active: true,
            })
            this.app.workspace.revealLeaf(leaf)
          }
          return true
        }
        return false
      },
    })
  }
}
