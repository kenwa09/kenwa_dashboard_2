<script setup lang="ts">
definePageMeta({ middleware: ['admin'] })
await navigateTo('/admin', { redirectCode: 301 })
</script>
