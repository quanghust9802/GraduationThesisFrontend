<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white w-11/12 md:w-1/2 p-6 rounded shadow-lg">
        <slot></slot>
        <button @click="$emit('close')" class="mt-4 bg-gray-500 text-white py-2 px-4 rounded">Đóng</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    emits: ['close']
  };
  </script>
  
  <style scoped>
  </style>
  