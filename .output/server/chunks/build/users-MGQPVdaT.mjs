import { defineComponent, withAsyncContext, computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderTeleport, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { u as useAsyncData } from './asyncData-1o0-ILe1.mjs';
import { _ as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "users",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-users", () => $fetch("/api/admin/users"))), __temp = await __temp, __restore(), __temp);
    const users2 = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.users) || [];
    });
    const showCreateForm = ref(false);
    const creating = ref(false);
    const createError = ref("");
    const togglingId = ref(null);
    const deletingId = ref(null);
    const deleteTarget = ref(null);
    const search = ref("");
    const selectedIds = ref(/* @__PURE__ */ new Set());
    const editTarget = ref(null);
    const editForm = ref({ name: "", email: "", phone: "", role: "user" });
    const editError = ref("");
    const saving = ref(false);
    const bulkConfirm = ref(null);
    const bulkLoading = ref(false);
    const newUser = ref({ name: "", email: "", phone: "", password: "" });
    const filteredUsers = computed(() => {
      if (!search.value.trim()) return users2.value;
      const q = search.value.toLowerCase();
      return users2.value.filter(
        (u) => {
          var _a, _b, _c;
          return ((_a = u.name) == null ? void 0 : _a.toLowerCase().includes(q)) || ((_b = u.email) == null ? void 0 : _b.toLowerCase().includes(q)) || ((_c = u.phone) == null ? void 0 : _c.includes(q));
        }
      );
    });
    const allSelected = computed(() => {
      const selectable = filteredUsers.value.filter((u) => u.role !== "admin");
      return selectable.length > 0 && selectable.every((u) => selectedIds.value.has(u.id));
    });
    function avatarColor(name) {
      const colors = ["#6366f1", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];
      let hash = 0;
      for (let i = 0; i < ((name == null ? void 0 : name.length) || 0); i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
      return colors[Math.abs(hash) % colors.length];
    }
    function formatDate(d) {
      if (!d) return "\u2014";
      return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "users-page" }, _attrs))} data-v-43096ac6><div class="page-header" data-v-43096ac6><div data-v-43096ac6><h1 class="page-title" data-v-43096ac6>Gebruikersbeheer</h1><p class="page-sub" data-v-43096ac6>${ssrInterpolate(unref(users2).length)} geregistreerde accounts</p></div><div class="header-actions" data-v-43096ac6><a href="/api/admin/users/export" class="btn btn-ghost" target="_blank" data-v-43096ac6><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" data-v-43096ac6><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-v-43096ac6></path><polyline points="7 10 12 15 17 10" data-v-43096ac6></polyline><line x1="12" y1="15" x2="12" y2="3" data-v-43096ac6></line></svg> CSV </a><button class="btn btn-primary" data-v-43096ac6><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" data-v-43096ac6>`);
      if (!unref(showCreateForm)) {
        _push(`<line x1="12" y1="5" x2="12" y2="19" data-v-43096ac6></line>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<line x1="5" y1="12" x2="19" y2="12" data-v-43096ac6></line></svg> ${ssrInterpolate(unref(showCreateForm) ? "Annuleren" : "Nieuw account")}</button></div></div>`);
      if (unref(showCreateForm)) {
        _push(`<div class="create-card" data-v-43096ac6><h3 data-v-43096ac6>Nieuw account aanmaken</h3><form class="create-form" data-v-43096ac6><div class="form-row" data-v-43096ac6><div class="form-group" data-v-43096ac6><label data-v-43096ac6>Naam</label><input${ssrRenderAttr("value", unref(newUser).name)} type="text" placeholder="Volledige naam" required data-v-43096ac6></div><div class="form-group" data-v-43096ac6><label data-v-43096ac6>E-mail</label><input${ssrRenderAttr("value", unref(newUser).email)} type="email" placeholder="email@voorbeeld.nl" required data-v-43096ac6></div></div><div class="form-row" data-v-43096ac6><div class="form-group" data-v-43096ac6><label data-v-43096ac6>Telefoon</label><input${ssrRenderAttr("value", unref(newUser).phone)} type="tel" placeholder="+31 6 12345678" data-v-43096ac6></div><div class="form-group" data-v-43096ac6><label data-v-43096ac6>Wachtwoord</label><input${ssrRenderAttr("value", unref(newUser).password)} type="password" placeholder="Min. 8 tekens" required data-v-43096ac6></div></div>`);
        if (unref(createError)) {
          _push(`<p class="error-msg" data-v-43096ac6>${ssrInterpolate(unref(createError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit" class="btn btn-primary"${ssrIncludeBooleanAttr(unref(creating)) ? " disabled" : ""} data-v-43096ac6>${ssrInterpolate(unref(creating) ? "Bezig..." : "Account aanmaken")}</button></form></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="toolbar" data-v-43096ac6><div class="search-bar" data-v-43096ac6><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" data-v-43096ac6><circle cx="11" cy="11" r="8" data-v-43096ac6></circle><line x1="21" y1="21" x2="16.65" y2="16.65" data-v-43096ac6></line></svg><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Zoek op naam, e-mail of telefoon..." data-v-43096ac6></div>`);
      if (unref(selectedIds).size > 0) {
        _push(`<div class="bulk-bar" data-v-43096ac6><span class="bulk-count" data-v-43096ac6>${ssrInterpolate(unref(selectedIds).size)} geselecteerd</span><button class="btn-sm btn-bulk" data-v-43096ac6>Blokkeren</button><button class="btn-sm btn-bulk" data-v-43096ac6>Deblokkeren</button><button class="btn-sm btn-bulk btn-bulk--danger" data-v-43096ac6>Verwijderen</button><button class="btn-sm btn-bulk--clear" data-v-43096ac6>Deselecteren</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="table-card" data-v-43096ac6><div class="table-wrapper" data-v-43096ac6><table data-v-43096ac6><thead data-v-43096ac6><tr data-v-43096ac6><th class="th-check" data-v-43096ac6><input type="checkbox"${ssrIncludeBooleanAttr(unref(allSelected)) ? " checked" : ""} data-v-43096ac6></th><th data-v-43096ac6>Gebruiker</th><th data-v-43096ac6>Rol</th><th data-v-43096ac6>Status</th><th data-v-43096ac6>Privacy</th><th data-v-43096ac6>Aangemeld</th><th class="th-actions" data-v-43096ac6>Acties</th></tr></thead><tbody data-v-43096ac6><!--[-->`);
      ssrRenderList(unref(filteredUsers), (user) => {
        var _a, _b;
        _push(`<tr class="${ssrRenderClass({ "row-selected": unref(selectedIds).has(user.id) })}" data-v-43096ac6><td class="td-check" data-v-43096ac6>`);
        if (user.role !== "admin") {
          _push(`<input type="checkbox"${ssrIncludeBooleanAttr(unref(selectedIds).has(user.id)) ? " checked" : ""} data-v-43096ac6>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</td><td data-v-43096ac6><div class="user-cell" data-v-43096ac6><div class="user-avatar" style="${ssrRenderStyle({ background: avatarColor(user.name) })}" data-v-43096ac6>${ssrInterpolate((_b = (_a = user.name) == null ? void 0 : _a.charAt(0)) == null ? void 0 : _b.toUpperCase())}</div><div class="user-details" data-v-43096ac6><span class="user-name" data-v-43096ac6>${ssrInterpolate(user.name)}</span><span class="user-email" data-v-43096ac6>${ssrInterpolate(user.email || user.phone || "\u2014")}</span></div></div></td><td data-v-43096ac6><span class="${ssrRenderClass([user.role === "admin" ? "role-admin" : "role-user", "role-badge"])}" data-v-43096ac6>${ssrInterpolate(user.role === "admin" ? "Admin" : "Gebruiker")}</span></td><td data-v-43096ac6><span class="${ssrRenderClass([user.blocked ? "dot-blocked" : "dot-active", "status-dot"])}" data-v-43096ac6></span> ${ssrInterpolate(user.blocked ? "Geblokkeerd" : "Actief")}</td><td data-v-43096ac6><span class="${ssrRenderClass(user.privacyAcceptedAt ? "privacy-yes" : "privacy-no")}" data-v-43096ac6>${ssrInterpolate(user.privacyAcceptedAt ? "Geaccepteerd" : "Open")}</span></td><td class="td-date" data-v-43096ac6>${ssrInterpolate(formatDate(user.createdAt))}</td><td data-v-43096ac6>`);
        if (user.role !== "admin") {
          _push(`<div class="action-btns" data-v-43096ac6><button class="action-btn action-edit" title="Bewerken" data-v-43096ac6><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" data-v-43096ac6><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" data-v-43096ac6></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" data-v-43096ac6></path></svg></button><button class="${ssrRenderClass([user.blocked ? "action-unblock" : "action-block", "action-btn"])}"${ssrIncludeBooleanAttr(unref(togglingId) === user.id) ? " disabled" : ""}${ssrRenderAttr("title", user.blocked ? "Deblokkeren" : "Blokkeren")} data-v-43096ac6>`);
          if (!user.blocked) {
            _push(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" data-v-43096ac6><circle cx="12" cy="12" r="10" data-v-43096ac6></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" data-v-43096ac6></line></svg>`);
          } else {
            _push(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" data-v-43096ac6><polyline points="20 6 9 17 4 12" data-v-43096ac6></polyline></svg>`);
          }
          _push(`</button><button class="action-btn action-delete"${ssrIncludeBooleanAttr(unref(deletingId) === user.id) ? " disabled" : ""} title="Verwijderen" data-v-43096ac6><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" data-v-43096ac6><polyline points="3 6 5 6 21 6" data-v-43096ac6></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" data-v-43096ac6></path></svg></button></div>`);
        } else {
          _push(`<span class="admin-label" data-v-43096ac6>\u2014</span>`);
        }
        _push(`</td></tr>`);
      });
      _push(`<!--]-->`);
      if (unref(filteredUsers).length === 0) {
        _push(`<tr data-v-43096ac6><td colspan="7" class="empty-row" data-v-43096ac6>Geen gebruikers gevonden</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div><div class="table-footer" data-v-43096ac6><span data-v-43096ac6>${ssrInterpolate(unref(filteredUsers).length)} van ${ssrInterpolate(unref(users2).length)} gebruikers</span></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(deleteTarget)) {
          _push2(`<div class="modal-overlay" data-v-43096ac6><div class="modal" data-v-43096ac6><h3 data-v-43096ac6>Gebruiker verwijderen</h3><p data-v-43096ac6>Weet je zeker dat je <strong data-v-43096ac6>${ssrInterpolate(unref(deleteTarget).name)}</strong> wilt verwijderen? Dit kan niet ongedaan worden gemaakt.</p><div class="modal-actions" data-v-43096ac6><button class="btn btn-ghost" data-v-43096ac6>Annuleren</button><button class="btn btn-danger"${ssrIncludeBooleanAttr(unref(deletingId) === unref(deleteTarget).id) ? " disabled" : ""} data-v-43096ac6>${ssrInterpolate(unref(deletingId) ? "Verwijderen..." : "Verwijderen")}</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(editTarget)) {
          _push2(`<div class="modal-overlay" data-v-43096ac6><div class="modal modal--edit" data-v-43096ac6><h3 data-v-43096ac6>Gebruiker bewerken</h3><form data-v-43096ac6><div class="form-group" data-v-43096ac6><label data-v-43096ac6>Naam</label><input${ssrRenderAttr("value", unref(editForm).name)} type="text" required data-v-43096ac6></div><div class="form-group" data-v-43096ac6><label data-v-43096ac6>E-mail</label><input${ssrRenderAttr("value", unref(editForm).email)} type="email" data-v-43096ac6></div><div class="form-group" data-v-43096ac6><label data-v-43096ac6>Telefoon</label><input${ssrRenderAttr("value", unref(editForm).phone)} type="tel" data-v-43096ac6></div><div class="form-group" data-v-43096ac6><label data-v-43096ac6>Rol</label><select data-v-43096ac6><option value="user" data-v-43096ac6${ssrIncludeBooleanAttr(Array.isArray(unref(editForm).role) ? ssrLooseContain(unref(editForm).role, "user") : ssrLooseEqual(unref(editForm).role, "user")) ? " selected" : ""}>Gebruiker</option><option value="admin" data-v-43096ac6${ssrIncludeBooleanAttr(Array.isArray(unref(editForm).role) ? ssrLooseContain(unref(editForm).role, "admin") : ssrLooseEqual(unref(editForm).role, "admin")) ? " selected" : ""}>Admin</option></select></div>`);
          if (unref(editError)) {
            _push2(`<p class="error-msg" data-v-43096ac6>${ssrInterpolate(unref(editError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="modal-actions" data-v-43096ac6><button type="button" class="btn btn-ghost" data-v-43096ac6>Annuleren</button><button type="submit" class="btn btn-primary"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} data-v-43096ac6>${ssrInterpolate(unref(saving) ? "Opslaan..." : "Opslaan")}</button></div></form></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(bulkConfirm)) {
          _push2(`<div class="modal-overlay" data-v-43096ac6><div class="modal" data-v-43096ac6><h3 data-v-43096ac6>${ssrInterpolate(unref(bulkConfirm).title)}</h3><p data-v-43096ac6>${ssrInterpolate(unref(bulkConfirm).message)}</p><div class="modal-actions" data-v-43096ac6><button class="btn btn-ghost" data-v-43096ac6>Annuleren</button><button class="btn btn-danger"${ssrIncludeBooleanAttr(unref(bulkLoading)) ? " disabled" : ""} data-v-43096ac6>${ssrInterpolate(unref(bulkLoading) ? "Bezig..." : "Bevestigen")}</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/users.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const users = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-43096ac6"]]);

export { users as default };
//# sourceMappingURL=users-MGQPVdaT.mjs.map
