<template>
  <NodeViewWrapper class="vuevuevue">
    <span class="label">Vue Component</span>

    <div class="content">
      <button @click="increase" class='btn'>
        This button has been clicked {{ node.attrs.count }} times.
        <!-- This is test button -->
      </button>
    </div>

    <NodeViewContent class="nodeViewContent" />
  </NodeViewWrapper>
</template>

<!-- <script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

export default {
  components: {
    NodeViewWrapper,
  },

  props: nodeViewProps,

  methods: {
    increase() {
      this.updateAttributes({
        count: this.node.attrs.count + 1,
      })
      console.log(this)
      console.log(this.node)
      console.log(nodeViewProps.node)
      // console.trace(this);
    },
  },
}
</script> -->

<script setup lang="ts">
import { Editor } from '@tiptap/core';
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3';
import { PropType, ref } from 'vue';



const test = ref<number>(0);

// const { node, updateAttributes } = nodeViewProps;
// const { node, updateAttributes } = defineProps(nodeViewProps);
// const props = defineProps(nodeViewProps);
// const props = defineProps({
//   editor: {
//     type: Object as PropType<Editor>,
//     required: true,
//   },
// })
const props = defineProps({
  ...nodeViewProps,
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});

const increase = (e) => {
  props.updateAttributes({
    count: props.node.attrs.count + 1,
    // count: 10,
  });
  console.log("btn클릭")
  console.log(props.node)
  // console.log(NodeViewWrapper)
  // console.log(nodeViewProps)
  // console.log(nodeViewProps.node)
  // console.log(props.editor)
  // const position = props.editor.value?.view.posAtDOM(e.target, 0);
  // const node = position?.node;
  // console.log("노드",node);
};
</script>

<!-- <script>
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3';
import { ref } from 'vue';

export default {
  components: {
    NodeViewWrapper,
  },

  props: nodeViewProps,

  setup(props) {
    const increase = () => {
      props.updateAttributes({
        count: props.node.attrs.count + 1,
      });
    };

    return {
      increase,
    };
  },
};
</script> -->


<style lang="scss">
.vuevuevue {
  background: #FAF594;
  border: 3px solid #0D0D0D;
  border-radius: 0.5rem;
  margin: 1rem 0;
  position: relative;
}

.label {
  margin-left: 1rem;
  background-color: #0D0D0D;
  font-size: 0.6rem;
  letter-spacing: 1px;
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  position: absolute;
  top: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 0.5rem 0.5rem;
}

.content {
  margin-top: 1.5rem;
  padding: 1rem;
}

.btn {
  background-color: skyblue;
}

.nodeViewContent {
  margin: 2.5rem 1rem 1rem;
  padding: 0.5rem;
  border: 2px dashed #0D0D0D20;
  border-radius: 0.5rem;
}
</style>