/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const workflowRouter = {
  path: '/workflows',
  component: Layout,
  redirect: 'noRedirect',
  name: 'WokrFlows',
  meta: {
    title: 'Work Flows',
    icon: 'chart'
  },
  children: [
    {
      path: 'recepies',
      component: () => import('@/views/project'),
      name: 'Recepies',
      meta: { title: 'Recepies', noCache: true , icon:'osi' }
    },
    {
      path: 'flow',
      component: () => import('@/components/workflowEditors/flow/index.vue'),
      name: 'FlowEditor',
      meta: { title: 'Flow Editor', noCache: true }
    },
    {
      path: 'node',
      component: () => import('@/components/workflowEditors/koni'),
      name: 'NodeEditor',
      meta: { title: 'NodeEditor', noCache: true, icon:'resolving' }
    },
    {
      path: 'xflow',
      component: () => import('@/views/xflow'),
      name: 'XFlow',
      meta: { title: 'XFlow', noCache: true }
    },
      {
      path: 'map',
      component: () => import('@/components/workflowEditors/mind'),
      name: 'MindMap',
      meta: { title: 'MindMap', noCache: true }
    },
    {
      path: 'gojs',
      component: () => import('@/views/gojs'),
      name: 'm3diagram',
      meta: { title: 'DiagramM3',noCache: true }
    },
    {
      path: 'flowchart',
      component: () => import('@/components/flowchart/flowchart/index'),
      name: 'flowCharts',
      meta: { title: 'flowCharts',noCache: true }
    },
    {
      path: 'diagrams_mermaid',
      component: () => import('@/views/mermaid'),
      name: 'Mermaid',
      meta: { title: 'Mermaid',noCache: true }
    },
    {
      path: 'drag',
      component: () => import('@/components/jsplumb/views/my-demos/MyDrag.vue'),
      name: 'drag',
      meta: { title: 'Drag',noCache: true }
    },
    {
      path: 'groups',
      component: () => import('@/components/jsplumb/views/my-demos/MyGroups.vue'),
      name: 'groups',
      meta: { title: 'groups',noCache: true }
    },
    {
      path: 'hello',
      component: () => import('@/components/jsplumb/views/my-demos/MyHello.vue'),
      name: 'myHello',
      meta: { title: 'MyHello',noCache: true }
    },
    {
      path: 'overlay',
      component: () => import('@/components/jsplumb/views/my-demos/MyOverlay.vue'),
      name: 'Overlay',
      meta: { title: 'Overlay',noCache: true }
    },
    {
      path: 'source',
      component: () => import('@/components/jsplumb/views/my-demos/MySource.vue'),
      name: 'MySource',
      meta: { title: 'Source',noCache: true }
    },
    {
      path: 'charts',
      component: () => import('@/components/jsplumb/views/official-demos/Chart.vue'),
      name: 'Charts',
      meta: { title: 'Charts',noCache: true }
    },
    {
      path: 'dragndrop',
      component: () => import('@/components/jsplumb/views/official-demos/DragAndDrop.vue'),
      name: 'DragNDrop',
      meta: { title: 'DragNDrop',noCache: true }
    },

    {
      path: 'dynamic',
      component: () => import('@/components/jsplumb/views/official-demos/DynamicAnchors.vue'),
      name: 'Dynamic',
      meta: { title: 'Dynamic',noCache: true }
    },

    {
      path: 'flowcharts',
      component: () => import('@/components/jsplumb/views/official-demos/FlowChart.vue'),
      name: 'FlowChart',
      meta: { title: 'FlowChart',noCache: true }
    },
    {
      path: 'grouping',
      component: () => import('@/components/jsplumb/views/official-demos/Groups.vue'),
      name: 'Grouping',
      meta: { title: 'Grouping',noCache: true }
    },
    {
      path: 'perimeter',
      component: () => import('@/components/jsplumb/views/official-demos/PerimeterAnchors.vue'),
      name: 'Perimeter',
      meta: { title: 'Perimeter',noCache: true }
    },
    {
      path: 'sources-targets',
      component: () => import('@/components/jsplumb/views/official-demos/SourcesAndTargets.vue'),
      name: 'source',
      meta: { title: 'Sources',noCache: true }
    },
    {
      path: 'statemachines',
      component: () => import('@/components/jsplumb/views/official-demos/StateMachine.vue'),
      name: 'Perimeter',
      meta: { title: 'Perimeter',noCache: true }
    },
    {
      path: 'demo-chart',
      component: () => import('@/components/jsplumb/views/DemoChart.vue'),
      name: 'DemoCharts',
      meta: { title: 'DemoCharts',noCache: true }
    },
    {
      path: 'demo-drag',
      component: () => import('@/components/jsplumb/views/DemoDrag.vue'),
      name: 'DemoDrag',
      meta: { title: 'DempDrag',noCache: true }
    },
    {
      path: 'work-chart',
      component: () => import('@/components/jsplumb/views/DragToWorkplace.vue'),
      name: 'WorkPLace',
      meta: { title: 'WorkPlace',noCache: true }
    }






  ]
}

export default workflowRouter
