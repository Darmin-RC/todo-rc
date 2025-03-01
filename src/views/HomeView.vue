<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your tasks and stay organized</p>
    </div>

    <!-- Task Input Form -->
    <div class="mb-8 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-4">
      <form @submit.prevent="addTask" class="space-y-4">
        <div>
          <label for="taskTitle" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Task Title</label>
          <input
            type="text"
            id="taskTitle"
            v-model="newTask.title"
            required
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="What needs to be done?"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="taskCategory" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              id="taskCategory"
              v-model="newTask.category"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">No Category</option>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              <option value="new">+ Add New Category</option>
            </select>
          </div>

          <div v-if="newTask.category === 'new'">
            <label for="newCategory" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Category</label>
            <input
              type="text"
              id="newCategory"
              v-model="newCategoryName"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Enter new category name"
            />
          </div>

          <div>
            <label for="taskDueDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
            <input
              type="date"
              id="taskDueDate"
              v-model="newTask.dueDate"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label for="taskPriority" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
            <select
              id="taskPriority"
              v-model="newTask.priority"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label for="taskDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
          <textarea
            id="taskDescription"
            v-model="newTask.description"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Add details about this task"
          ></textarea>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-4">
        <div>
          <label for="filterStatus" class="sr-only">Filter by Status</label>
          <select
            id="filterStatus"
            v-model="filters.status"
            class="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="active">Active</option>
          </select>
        </div>

        <div>
          <label for="filterCategory" class="sr-only">Filter by Category</label>
          <select
            id="filterCategory"
            v-model="filters.category"
            class="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>

        <div>
          <label for="filterPriority" class="sr-only">Filter by Priority</label>
          <select
            id="filterPriority"
            v-model="filters.priority"
            class="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search tasks..."
          class="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm pl-10"
        />
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
    <!-- Task List -->
    <div v-if="filteredTasks.length > 0" class="space-y-4">
      <div v-for="task in filteredTasks" :key="task.id"
        :class="[
          'bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg transition-all duration-200',
          task.completed ? 'opacity-70' : '',
          {'border-l-4 border-red-500': task.priority === 'high' && !task.completed},
          {'border-l-4 border-yellow-500': task.priority === 'medium' && !task.completed},
          {'border-l-4 border-green-500': task.priority === 'low' && !task.completed},
        ]"
      >
        <div class="p-4 flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center">
              <input
                type="checkbox"
                :checked="task.completed"
                @change="toggleTaskStatus(task)"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <h3 
                class="ml-3 text-lg font-medium text-gray-900 dark:text-white"
                :class="{ 'line-through text-gray-500': task.completed }"
              >
                {{ task.title }}
              </h3>
              <span 
                v-if="task.category"
                class="ml-2 px-2 py-0.5 text-xs rounded-full"
                :class="{
                  'bg-blue-100 text-blue-800': !task.completed,
                  'bg-gray-100 text-gray-800': task.completed
                }"
              >
                {{ task.category }}
              </span>
            </div>
            
            <div class="mt-1">
              <button
                @click="toggleTaskDetails(task)"
                class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {{ task.showDetails ? 'Hide Details' : 'Show Details' }}
              </button>
            </div>
          
            <div v-if="task.showDetails" class="mt-2 space-y-2">
              <p v-if="task.description" class="text-sm text-gray-500 dark:text-gray-400">
                {{ task.description }}
              </p>
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                <span v-if="task.dueDate" :class="{ 'text-red-500': isOverdue(task) }">
                  Due: {{ formatDate(task.dueDate) }}
                </span>
                <span>Priority: {{ task.priority }}</span>
              </div>
            </div>
          </div>
          
          <!-- Task Actions -->
          <div class="ml-4 flex items-center space-x-2">
            <button
              @click="deleteTask(task)"
              class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">No tasks found. Add your first task above!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getFirestore } from 'firebase/firestore'
import { collection, doc, addDoc, deleteDoc, updateDoc, query, orderBy, onSnapshot } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import { useRouter } from 'vue-router'

// Initialize router
const router = useRouter()

// Initialize auth and user state
const auth = getAuth()
const db = getFirestore()
const currentUser = ref(null)
let tasksCollectionRef = null
let unsubscribeTasks = null

// Task management
const tasks = ref([])
const categories = ref(['Work', 'Personal', 'Shopping', 'Health'])
const newTask = ref({
  title: '',
  description: '',
  category: '',
  dueDate: '',
  priority: 'medium',
  completed: false
})
const newCategoryName = ref('')
const isEditing = ref(false)
const editingTaskId = ref(null)

// Filters and search
const filters = ref({
  status: 'all',
  category: '',
  priority: ''
})
const searchQuery = ref('')

// Declarar unsubscribeAuth en el scope correcto
let unsubscribeAuth = null;

// Setup authentication and tasks loading
onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user); // Verificar estado de autenticación
    currentUser.value = user
    
    if (user) {
      tasksCollectionRef = collection(db, 'users', user.uid, 'tasks');
      
      const q = query(tasksCollectionRef, orderBy('order', 'asc'));
      unsubscribeTasks = onSnapshot(q, (snapshot) => {
        console.log('Tasks snapshot:', snapshot.docs); // Verificar datos recibidos
        tasks.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          showDetails: false
        }));
        console.log('Processed tasks:', tasks.value); // Verificar datos procesados
      }, (error) => {
        console.error('Error al obtener tareas:', error);
      });
    } else {
      router.push('/login');
    }
  });
});

// Cleanup
onUnmounted(() => {
  if (unsubscribeAuth) unsubscribeAuth()
  if (unsubscribeTasks) unsubscribeTasks()
});

const matchesFilters = (task) => {
  if (!task) return false;
  
  const matchesStatus = filters.value.status === 'all' ||
    (filters.value.status === 'completed' && task.completed) ||
    (filters.value.status === 'active' && !task.completed);
  
  const matchesCategory = !filters.value.category || task.category === filters.value.category;
  const matchesPriority = !filters.value.priority || task.priority === filters.value.priority;
  
  const matchesSearch = !searchQuery.value ||
    (task.title && task.title.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.value.toLowerCase()));
  
  return matchesStatus && matchesCategory && matchesPriority && matchesSearch;
};

const filteredTasks = computed(() => {
  return tasks.value.filter(task => matchesFilters(task));
});

const addTask = async () => {
  try {
    if (!currentUser.value) {
      console.error('No user is authenticated');
      return;
    }
    
    if (!tasksCollectionRef) {
      tasksCollectionRef = collection(db, 'users', currentUser.value.uid, 'tasks');
    }
  
    if (newTask.value.category === 'new' && newCategoryName.value) {
      categories.value.push(newCategoryName.value);
      newTask.value.category = newCategoryName.value;
      newCategoryName.value = '';
    }
  
    const taskData = {
      ...newTask.value,
      createdAt: new Date().toISOString(),
      order: tasks.value.length,
      userId: currentUser.value.uid
    };
  
    const docRef = await addDoc(tasksCollectionRef, taskData);
  
    // Reset form
    newTask.value = {
      title: '',
      description: '',
      category: '',
      dueDate: '',
      priority: 'medium',
      completed: false
    };
  } catch (error) {
    console.error('Error adding task:', error.message);
  }
};

const deleteTask = async (task) => {
  if (!currentUser.value || !tasksCollectionRef) return;
  try {
    await deleteDoc(doc(tasksCollectionRef, task.id));
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

const toggleTaskStatus = async (task) => {
  if (!currentUser.value || !tasksCollectionRef) return;
  try {
    await updateDoc(doc(tasksCollectionRef, task.id), {
      completed: !task.completed
    });
  } catch (error) {
    console.error('Error toggling task status:', error);
  }
};

const toggleTaskDetails = (task) => {
  task.showDetails = !task.showDetails;
};

const startEditing = (task) => {
  isEditing.value = true;
  editingTaskId.value = task.id;
  Object.assign(newTask.value, task);
};

const saveTaskOrder = async () => {
  if (!currentUser.value || !tasksCollectionRef) return;
  try {
    const updates = tasks.value.map((task, index) => {
      return updateDoc(doc(tasksCollectionRef, task.id), { order: index });
    });
    await Promise.all(updates);
  } catch (error) {
    console.error('Error saving task order:', error);
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const isOverdue = (task) => {
  if (!task.dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.dueDate);
  return dueDate < today;
};
</script>
