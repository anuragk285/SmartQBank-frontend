import { createRouter, createWebHistory } from 'vue-router'
import SubjectView from '@/components/SubjectView.vue'
import QuestionView from '@/components/QuestionView.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'subjects', component: SubjectView },
    {
      path: '/subjects/:subjectId/questions',
      name: 'questions',
      component: QuestionView
    }
  ]
})

export default router