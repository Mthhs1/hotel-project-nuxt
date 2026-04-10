<template>
    <div>Employee Dashboard</div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["role-check"],
})
</script>
