<template>
  <div class="w-full">
    <div class="flex justify-between mb-1">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</span>
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ value }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
      <div 
        class="h-2.5 rounded-full transition-all duration-500 ease-out"
        :style="{ 
          width: `${value}%`, 
          backgroundColor: color || '#4f46e5'
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: Number,
    default: 0,
    validator: (val) => val >= 0 && val <= 100
  },
  label: {
    type: String,
    default: 'Progress'
  },
  color: {
    type: String,
    default: ''
  }
});
</script>