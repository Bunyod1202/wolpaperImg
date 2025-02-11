<template>
  <div>
    <input type="file" multiple @change="handleFileUpload" />
    <button @click="loadFiles">Load Images</button>

    <div class="image-container">
      <img v-for="(url, index) in imageURLs" :key="index" :src="url" alt="Stored Image" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { saveToIndexedDB, getAllFromIndexedDB } from '../utils/indexedDB'

const imageURLs = ref([])

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    saveToIndexedDB(file)
  }
}

// Load all stored images
const loadFiles = async () => {
  try {
    imageURLs.value = await getAllFromIndexedDB()
  } catch (error) {
    console.error('Error loading files:', error)
  }
}
</script>

<style>
.image-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
