import { Node, chainCommands, exitCode, mergeAttributes } from '@tiptap/core';

export interface ConditionRuleOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    conditionRule: {
      setConditionRule: () => ReturnType;
    };
  }
}

export const ConditionRule = Node.create<ConditionRuleOptions>({
  name: 'conditionRule',
  group: 'block',
  content: 'text*',
  marks: '',
  defining: true,
  draggable: false,
  parseHTML() {
    return [
      { tag: 'p' },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
  addCommands() {
    return {
      setCondition: () => ({ commands }: { commands: any; }) => {
        return commands.toggleNode(this.name)
      },
    }
  },
  // addCommands() {
  //   return {
  //     setHorizontalRule:
  //       () => ({ chain, state }) => {
  //         const { $to: $originTo } = state.selection

  //         const currentChain = chain()

  //         if ($originTo.parentOffset === 0) {
  //           currentChain.insertContentAt(Math.max($originTo.pos - 2, 0), { type: this.name })
  //         } else {
  //           currentChain.insertContent({ type: this.name })
  //         }

  //         return (
  //           currentChain
  //             // set cursor after horizontal rule
  //             .command(({ tr, dispatch }) => {
  //               if (dispatch) {
  //                 const { $to } = tr.selection
  //                 const posAfter = $to.end()

  //                 if ($to.nodeAfter) {
  //                   if ($to.nodeAfter.isTextblock) {
  //                     tr.setSelection(TextSelection.create(tr.doc, $to.pos + 1))
  //                   } else if ($to.nodeAfter.isBlock) {
  //                     tr.setSelection(NodeSelection.create(tr.doc, $to.pos))
  //                   } else {
  //                     tr.setSelection(TextSelection.create(tr.doc, $to.pos))
  //                   }
  //                 } else {
  //                   // add node after horizontal rule if it’s the end of the document
  //                   const node = $to.parent.type.contentMatch.defaultType?.create()

  //                   if (node) {
  //                     tr.insert(posAfter, node)
  //                     tr.setSelection(TextSelection.create(tr.doc, posAfter + 1))
  //                   }
  //                 }

  //                 tr.scrollIntoView()
  //               }

  //               return true
  //             })
  //             .run()
  //         )
  //       },
  //   }
  // },
});
