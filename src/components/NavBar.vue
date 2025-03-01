<template>
  <nav class="bg-white dark:bg-gray-800 shadow mb-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <router-link 
            to="/" 
            class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            :class="{ 'text-indigo-600 dark:text-indigo-400': $route.path === '/' }"
          >
            <span class="text-sm font-medium">Tasks</span>
          </router-link>
          
          <router-link 
            to="/dashboard" 
            class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            :class="{ 'text-indigo-600 dark:text-indigo-400': $route.path === '/dashboard' }"
          >
            <span class="text-sm font-medium">Dashboard</span>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>