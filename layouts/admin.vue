<template>
  <div class="admin-shell" :class="{ 'sidebar-collapsed': collapsed, 'mobile-open': mobileOpen }">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="url(#sb-grad)" />
            <path d="M20 10C15.58 10 12 13.58 12 18C12 24.5 20 32 20 32C20 32 28 24.5 28 18C28 13.58 24.42 10 20 10ZM20 21C18.34 21 17 19.66 17 18C17 16.34 18.34 15 20 15C21.66 15 23 16.34 23 18C23 19.66 21.66 21 20 21Z" fill="white" />
            <defs>
              <linearGradient id="sb-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#6366f1" />
                <stop offset="1" stop-color="#2563eb" />
              </linearGradient>
            </defs>
          </svg>
          <span class="brand-text">
            <span class="brand-name">Kenwa</span>
            <span class="brand-tag">Admin</span>
          </span>
        </div>
        <button class="collapse-btn" :title="collapsed ? 'Uitklappen' : 'Inklappen'" @click="collapsed = !collapsed">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline :points="collapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6'" />
          </svg>
        </button>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <span class="nav-label">Overzicht</span>
          <NuxtLink to="/admin" class="nav-item" exact>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>Dashboard</span>
          </NuxtLink>
          <NuxtLink to="/admin/logs" class="nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span>Logs</span>
          </NuxtLink>
        </div>

        <div class="nav-section">
          <span class="nav-label">Gebruikers</span>
          <NuxtLink to="/admin/users" class="nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Gebruikers</span>
          </NuxtLink>
          <NuxtLink to="/admin/shares" class="nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>Shares</span>
          </NuxtLink>
        </div>

        <div class="nav-section">
          <span class="nav-label">Content</span>
          <NuxtLink to="/admin/blog" class="nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span>Blog</span>
          </NuxtLink>
          <NuxtLink to="/admin/ai-blog" class="nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
              <path d="M8.5 8.5a5 5 0 0 1 7.07 0" />
              <path d="M15.5 15.5a5 5 0 0 1-7.07 0" />
              <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0" />
            </svg>
            <span>AI Blog</span>
            <span class="nav-badge">AI</span>
          </NuxtLink>
          <NuxtLink to="/admin/banners" class="nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
            </svg>
            <span>Banners</span>
          </NuxtLink>
        </div>

        <div class="nav-section">
          <span class="nav-label">Commerce</span>
          <NuxtLink to="/admin/orders" class="nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>Bestellingen</span>
          </NuxtLink>
          <NuxtLink to="/admin/products" class="nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            <span>Producten</span>
          </NuxtLink>
          <NuxtLink to="/admin/invoices" class="nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Facturen</span>
          </NuxtLink>
          <NuxtLink to="/admin/accounting" class="nav-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Boekhouding</span>
          </NuxtLink>
        </div>
      </nav>

      <!-- User block -->
      <div class="sidebar-user">
        <div class="user-avatar">{{ userInitial }}</div>
        <div class="user-info">
          <span class="user-name">{{ authStore.user?.name || 'Admin' }}</span>
          <span class="user-role">Beheerder</span>
        </div>
        <button class="logout-btn" title="Uitloggen" :disabled="loggingOut" @click="handleLogout">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>

    <!-- Main area -->
    <div class="main-area">
      <!-- Top bar -->
      <header class="topbar">
        <button class="mobile-menu-btn" @click="mobileOpen = !mobileOpen">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div class="topbar-breadcrumb">
          <span class="topbar-title">{{ pageTitle }}</span>
        </div>
        <div class="topbar-actions">
          <span class="topbar-user">{{ authStore.user?.email }}</span>
        </div>
      </header>

      <!-- Page content -->
      <main class="page-content">
        <slot />
      </main>
    </div>

    <!-- Mobile overlay -->
    <div v-if="mobileOpen" class="mobile-overlay" @click="mobileOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const authStore = useAuthStore()
const route = useRoute()
const loggingOut = ref(false)
const collapsed = ref(false)
const mobileOpen = ref(false)

const userInitial = computed(() => {
  const name = authStore.user?.name || authStore.user?.email || 'A'
  return name.charAt(0).toUpperCase()
})

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/users': 'Gebruikers',
  '/admin/logs': 'Systeemlogboek',
  '/admin/shares': 'Shares',
  '/admin/blog': 'Blog',
  '/admin/blog/create': 'Nieuw bericht',
  '/admin/ai-blog': 'AI Blog',
  '/admin/banners': 'Banners',
  '/admin/orders': 'Bestellingen',
  '/admin/products': 'Producten',
  '/admin/invoices': 'Facturen',
  '/admin/accounting': 'Boekhouding'
}

const pageTitle = computed(() => {
  const path = route.path
  if (pageTitles[path]) return pageTitles[path]
  if (path.startsWith('/admin/blog/')) return 'Bericht bewerken'
  if (path.startsWith('/admin/orders/')) return 'Bestelling details'
  return 'Admin'
})

async function handleLogout () {
  if (loggingOut.value) return
  loggingOut.value = true
  try {
    await authStore.logout()
    await navigateTo('/login')
  } finally {
    loggingOut.value = false
  }
}
</script>

<style scoped>
/* ── Layout ───────────────────────────────────────────── */
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: #f1f5f9;
  --sidebar-w: 228px;
  --sidebar-w-collapsed: 64px;
  --topbar-h: 56px;
}

/* ── Sidebar ──────────────────────────────────────────── */
.sidebar {
  width: var(--sidebar-w);
  flex-shrink: 0;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 200;
  transition: width 0.2s ease;
  overflow: hidden;
}

.sidebar-collapsed .sidebar {
  width: var(--sidebar-w-collapsed);
}

/* ── Sidebar header ───────────────────────────────────── */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: var(--topbar-h);
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  overflow: hidden;
  min-width: 0;
}

.brand-text {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.15s ease;
}

.sidebar-collapsed .brand-text {
  opacity: 0;
  pointer-events: none;
}

.brand-name {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
}

.brand-tag {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #6741ff;
  background: rgba(103, 65, 255, 0.1);
  border: 1px solid rgba(103, 65, 255, 0.2);
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
}

.collapse-btn {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.375rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  transition: all 0.15s;
}

.collapse-btn:hover {
  color: #6741ff;
  background: rgba(103, 65, 255, 0.08);
}

/* ── Nav ──────────────────────────────────────────────── */
.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.75rem 0.625rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(103, 65, 255, 0.15) transparent;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.nav-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  padding: 0 0.625rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 0.15s;
}

.sidebar-collapsed .nav-label {
  opacity: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.625rem;
  border-radius: 0.5rem;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.15s;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}

.nav-item svg {
  flex-shrink: 0;
  transition: color 0.15s;
}

.nav-item span:not(.nav-badge) {
  overflow: hidden;
  transition: opacity 0.15s, width 0.2s;
}

.sidebar-collapsed .nav-item span:not(.nav-badge) {
  opacity: 0;
  width: 0;
}

.nav-item:hover {
  color: #6741ff;
  background: rgba(103, 65, 255, 0.07);
}

.nav-item.router-link-active,
.nav-item.router-link-exact-active {
  color: #6741ff;
  background: rgba(103, 65, 255, 0.1);
  font-weight: 600;
}

.nav-item.router-link-active svg {
  color: #6741ff;
}

.nav-badge {
  margin-left: auto;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.1rem 0.375rem;
  border-radius: 999px;
  background: rgba(103, 65, 255, 0.1);
  border: 1px solid rgba(103, 65, 255, 0.2);
  color: #6741ff;
  flex-shrink: 0;
  transition: opacity 0.15s;
}

.sidebar-collapsed .nav-badge {
  opacity: 0;
}

/* ── Sidebar user ─────────────────────────────────────── */
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  border-top: 1px solid #f1f5f9;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #6741ff, #5533ee);
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  transition: opacity 0.15s;
}

.sidebar-collapsed .user-info {
  opacity: 0;
  width: 0;
}

.user-name {
  display: block;
  font-size: 0.825rem;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  display: block;
  font-size: 0.7rem;
  color: #9ca3af;
}

.logout-btn {
  flex-shrink: 0;
  background: none;
  border: none;
  color: rgba(220, 38, 38, 0.45);
  cursor: pointer;
  padding: 0.375rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  transition: all 0.15s;
}

.logout-btn:hover:not(:disabled) {
  color: #dc2626;
  background: #fef2f2;
}

.logout-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ── Main area ────────────────────────────────────────── */
.main-area {
  flex: 1;
  margin-left: var(--sidebar-w);
  transition: margin-left 0.2s ease;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidebar-collapsed .main-area {
  margin-left: var(--sidebar-w-collapsed);
}

/* ── Topbar ───────────────────────────────────────────── */
.topbar {
  height: var(--topbar-h);
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.375rem;
  border-radius: 0.375rem;
  transition: all 0.15s;
}

.mobile-menu-btn:hover {
  color: #6741ff;
  background: rgba(103, 65, 255, 0.07);
}

.topbar-breadcrumb {
  flex: 1;
}

.topbar-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.topbar-user {
  font-size: 0.8rem;
  color: #9ca3af;
  font-family: monospace;
}

/* ── Page content ─────────────────────────────────────── */
.page-content {
  flex: 1;
  padding: 1.5rem;
  background: #f1f5f9;
  min-height: calc(100vh - var(--topbar-h));
}

/* ── Mobile overlay ───────────────────────────────────── */
.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 199;
}

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.25s ease, width 0.2s ease;
  }

  .mobile-open .sidebar {
    transform: translateX(0);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.12);
  }

  .main-area {
    margin-left: 0 !important;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-overlay {
    display: block;
  }

  .topbar-user {
    display: none;
  }
}
</style>
