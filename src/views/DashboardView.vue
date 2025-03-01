<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Your task overview and statistics</p>
    </div>

    <!-- Dashboard Content -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Task Summary Card -->
      <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Task Summary</h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Total Tasks</span>
            <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ taskStats.total }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Completed</span>
            <span class="text-lg font-semibold text-green-600 dark:text-green-400">{{ taskStats.completed }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Pending</span>
            <span class="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{{ taskStats.pending }}</span>
          </div>
        </div>
      </div>

      <!-- Priority Distribution Card -->
      <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Priority Distribution</h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">High Priority</span>
            <span class="text-lg font-semibold text-red-600 dark:text-red-400">{{ priorityStats.high }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Medium Priority</span>
            <span class="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{{ priorityStats.medium }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Low Priority</span>
            <span class="text-lg font-semibold text-green-600 dark:text-green-400">{{ priorityStats.low }}</span>
          </div>
        </div>
      </div>

      <!-- Due Date Overview Card -->
      <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Due Date Overview</h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Overdue</span>
            <span class="text-lg font-semibold text-red-600 dark:text-red-400">{{ dueDateStats.overdue }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Due Today</span>
            <span class="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{{ dueDateStats.dueToday }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">Upcoming</span>
            <span class="text-lg font-semibold text-blue-600 dark:text-blue-400">{{ dueDateStats.upcoming }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore'

const auth = getAuth()
const db = getFirestore()

const taskStats = ref({ total: 0, completed: 0, pending: 0 })
const priorityStats = ref({ high: 0, medium: 0, low: 0 })
const dueDateStats = ref({ overdue: 0, dueToday: 0, upcoming: 0 })

let unsubscribe = null

onMounted(async () => {
  const user = auth.currentUser
  if (!user) return

  // Corregir la referencia a la colección de tareas
  const tasksRef = collection(db, 'users', user.uid, 'tasks')
  const userTasksQuery = query(tasksRef, orderBy('order', 'asc'))

  unsubscribe = onSnapshot(userTasksQuery, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // Reset all counters
    taskStats.value = { total: tasks.length, completed: 0, pending: 0 }
    priorityStats.value = { high: 0, medium: 0, low: 0 }
    dueDateStats.value = { overdue: 0, dueToday: 0, upcoming: 0 }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    tasks.forEach(task => {
      // Task completion stats
      if (task.completed) {
        taskStats.value.completed++
      } else {
        taskStats.value.pending++
      }

      // Priority stats
      priorityStats.value[task.priority.toLowerCase()]++

      // Due date stats
      if (!task.completed && task.dueDate) {
        const dueDate = new Date(task.dueDate)
        dueDate.setHours(0, 0, 0, 0)

        if (dueDate < today) {
          dueDateStats.value.overdue++
        } else if (dueDate.getTime() === today.getTime()) {
          dueDateStats.value.dueToday++
        } else {
          dueDateStats.value.upcoming++
        }
      }
    })
  })
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>