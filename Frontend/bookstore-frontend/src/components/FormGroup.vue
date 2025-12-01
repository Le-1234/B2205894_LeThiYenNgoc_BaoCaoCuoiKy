<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  label: String
});
</script>

<style scoped>
.form-group {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

label {
  font-weight: 600;
}
</style>
