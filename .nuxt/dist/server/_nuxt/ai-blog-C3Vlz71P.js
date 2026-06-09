import { defineComponent, withAsyncContext, computed, ref, watch, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrInterpolate, ssrLooseEqual, ssrRenderClass, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/hookable/dist/index.mjs";
import { u as useAsyncData } from "./asyncData-1o0-ILe1.js";
import { _ as _export_sfc } from "../server.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/perfect-debounce/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/unctx/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/defu/dist/defu.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/ufo/dist/index.mjs";
import "C:/Users/ser_s/Desktop/Projecten/kenwa_dashboard/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ai-blog",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: settingsData, refresh: refreshSettings } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "ai-blog-settings",
      () => $fetch("/api/admin/ai-blog/settings")
    )), __temp = await __temp, __restore(), __temp);
    const { data: topicsData, refresh: refreshTopics } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "ai-blog-topics",
      () => $fetch("/api/admin/ai-blog/topics")
    )), __temp = await __temp, __restore(), __temp);
    const settings = computed(() => settingsData.value);
    const topics = computed(() => topicsData.value?.topics || []);
    const form = ref({
      enabled: settings.value?.enabled ?? false,
      frequency: settings.value?.frequency ?? "weekly",
      language: settings.value?.language ?? "nl",
      openaiApiKey: "",
      pexelsApiKey: ""
    });
    watch(settingsData, (val) => {
      if (val) {
        form.value.enabled = val.enabled;
        form.value.frequency = val.frequency;
        form.value.language = val.language;
      }
    });
    const savingSettings = ref(false);
    const settingsError = ref("");
    const settingsSuccess = ref("");
    const newTopic = ref("");
    const addingTopic = ref(false);
    const topicError = ref("");
    const generating = ref(false);
    const generateError = ref("");
    const generateSuccess = ref("");
    function formatDate(value) {
      try {
        return new Date(value).toLocaleString("nl-NL", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      } catch {
        return value;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-27ed3b7f><div class="page-header" data-v-27ed3b7f><h1 data-v-27ed3b7f>AI Blog Automatisering</h1><p class="subtitle" data-v-27ed3b7f>Laat Claude automatisch blogartikelen schrijven op basis van uw onderwerpen.</p></div><div class="card section" data-v-27ed3b7f><h2 data-v-27ed3b7f>Instellingen</h2><form data-v-27ed3b7f><div class="form-row" data-v-27ed3b7f><div class="form-group" data-v-27ed3b7f><label data-v-27ed3b7f>Status</label><div class="toggle-wrap" data-v-27ed3b7f><label class="toggle" data-v-27ed3b7f><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).enabled) ? ssrLooseContain(unref(form).enabled, null) : unref(form).enabled) ? " checked" : ""} type="checkbox" data-v-27ed3b7f><span class="slider" data-v-27ed3b7f></span></label><span data-v-27ed3b7f>${ssrInterpolate(unref(form).enabled ? "Ingeschakeld" : "Uitgeschakeld")}</span></div></div><div class="form-group" data-v-27ed3b7f><label data-v-27ed3b7f>Frequentie</label><select data-v-27ed3b7f><option value="daily" data-v-27ed3b7f${ssrIncludeBooleanAttr(Array.isArray(unref(form).frequency) ? ssrLooseContain(unref(form).frequency, "daily") : ssrLooseEqual(unref(form).frequency, "daily")) ? " selected" : ""}>Dagelijks</option><option value="weekly" data-v-27ed3b7f${ssrIncludeBooleanAttr(Array.isArray(unref(form).frequency) ? ssrLooseContain(unref(form).frequency, "weekly") : ssrLooseEqual(unref(form).frequency, "weekly")) ? " selected" : ""}>Wekelijks</option><option value="biweekly" data-v-27ed3b7f${ssrIncludeBooleanAttr(Array.isArray(unref(form).frequency) ? ssrLooseContain(unref(form).frequency, "biweekly") : ssrLooseEqual(unref(form).frequency, "biweekly")) ? " selected" : ""}>Tweewekelijks</option><option value="monthly" data-v-27ed3b7f${ssrIncludeBooleanAttr(Array.isArray(unref(form).frequency) ? ssrLooseContain(unref(form).frequency, "monthly") : ssrLooseEqual(unref(form).frequency, "monthly")) ? " selected" : ""}>Maandelijks</option></select></div><div class="form-group" data-v-27ed3b7f><label data-v-27ed3b7f>Taal</label><select data-v-27ed3b7f><option value="nl" data-v-27ed3b7f${ssrIncludeBooleanAttr(Array.isArray(unref(form).language) ? ssrLooseContain(unref(form).language, "nl") : ssrLooseEqual(unref(form).language, "nl")) ? " selected" : ""}>Nederlands</option><option value="en" data-v-27ed3b7f${ssrIncludeBooleanAttr(Array.isArray(unref(form).language) ? ssrLooseContain(unref(form).language, "en") : ssrLooseEqual(unref(form).language, "en")) ? " selected" : ""}>Engels</option><option value="de" data-v-27ed3b7f${ssrIncludeBooleanAttr(Array.isArray(unref(form).language) ? ssrLooseContain(unref(form).language, "de") : ssrLooseEqual(unref(form).language, "de")) ? " selected" : ""}>Duits</option><option value="fr" data-v-27ed3b7f${ssrIncludeBooleanAttr(Array.isArray(unref(form).language) ? ssrLooseContain(unref(form).language, "fr") : ssrLooseEqual(unref(form).language, "fr")) ? " selected" : ""}>Frans</option></select></div></div><div class="img-section" data-v-27ed3b7f><h3 class="img-section-title" data-v-27ed3b7f>Afbeeldingen</h3><div class="img-badge-row" data-v-27ed3b7f><span class="${ssrRenderClass(["img-badge", unref(form).openaiApiKey ? "img-badge--active" : "img-badge--off"])}" data-v-27ed3b7f> DALL-E 3 ${ssrInterpolate(unref(form).openaiApiKey ? "✓ Actief" : "— Niet ingesteld")}</span>`);
      if (!unref(form).openaiApiKey) {
        _push(`<span class="${ssrRenderClass(["img-badge", unref(form).pexelsApiKey ? "img-badge--active" : "img-badge--off"])}" data-v-27ed3b7f> Pexels ${ssrInterpolate(unref(form).pexelsApiKey ? "✓ Fallback" : "— Niet ingesteld")}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(form).openaiApiKey && !unref(form).pexelsApiKey) {
        _push(`<span class="img-badge img-badge--none" data-v-27ed3b7f> Geen afbeeldingen </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="form-group" data-v-27ed3b7f><label data-v-27ed3b7f> OpenAI API-sleutel (DALL-E 3) <span class="hint" data-v-27ed3b7f>— AI genereert unieke afbeeldingen per blog · platform.openai.com/api-keys</span></label><input${ssrRenderAttr("value", unref(form).openaiApiKey)} type="password" placeholder="sk-... (aanbevolen)" autocomplete="off" data-v-27ed3b7f></div><div class="form-group" data-v-27ed3b7f><label data-v-27ed3b7f> Pexels API-sleutel <span class="hint" data-v-27ed3b7f>— Gratis stockfoto&#39;s als fallback · pexels.com/api</span></label><input${ssrRenderAttr("value", unref(form).pexelsApiKey)} type="password" placeholder="Optioneel" autocomplete="off" data-v-27ed3b7f></div></div>`);
      if (unref(settings)) {
        _push(`<div class="info-row" data-v-27ed3b7f>`);
        if (unref(settings).lastRun) {
          _push(`<span data-v-27ed3b7f>Laatste generatie: <strong data-v-27ed3b7f>${ssrInterpolate(formatDate(unref(settings).lastRun))}</strong></span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(settings).nextRun) {
          _push(`<span data-v-27ed3b7f>Volgende generatie: <strong data-v-27ed3b7f>${ssrInterpolate(formatDate(unref(settings).nextRun))}</strong></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(settingsError)) {
        _push(`<p class="error" data-v-27ed3b7f>${ssrInterpolate(unref(settingsError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(settingsSuccess)) {
        _push(`<p class="success" data-v-27ed3b7f>${ssrInterpolate(unref(settingsSuccess))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="form-actions" data-v-27ed3b7f><button type="submit" class="btn btn-primary"${ssrIncludeBooleanAttr(unref(savingSettings)) ? " disabled" : ""} data-v-27ed3b7f>${ssrInterpolate(unref(savingSettings) ? "Opslaan..." : "Instellingen opslaan")}</button></div></form></div><div class="card section" data-v-27ed3b7f><h2 data-v-27ed3b7f>Onderwerpen</h2><p class="hint-text" data-v-27ed3b7f>Voeg onderwerpen toe waarover Claude blogs moet schrijven. Het minst gebruikte onderwerp wordt als eerste gekozen.</p><form class="topic-form" data-v-27ed3b7f><input${ssrRenderAttr("value", unref(newTopic))} type="text" placeholder="Bijv. Digitale veiligheid voor bedrijven"${ssrIncludeBooleanAttr(unref(addingTopic)) ? " disabled" : ""} data-v-27ed3b7f><button type="submit" class="btn btn-primary"${ssrIncludeBooleanAttr(unref(addingTopic) || !unref(newTopic).trim()) ? " disabled" : ""} data-v-27ed3b7f>${ssrInterpolate(unref(addingTopic) ? "Toevoegen..." : "Toevoegen")}</button></form>`);
      if (unref(topicError)) {
        _push(`<p class="error" data-v-27ed3b7f>${ssrInterpolate(unref(topicError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(topics).length) {
        _push(`<div class="topic-list" data-v-27ed3b7f><!--[-->`);
        ssrRenderList(unref(topics), (topic) => {
          _push(`<div class="topic-item" data-v-27ed3b7f><div class="topic-info" data-v-27ed3b7f><span class="topic-name" data-v-27ed3b7f>${ssrInterpolate(topic.topic)}</span><span class="topic-meta" data-v-27ed3b7f>${ssrInterpolate(topic.usedCount)}x gebruikt `);
          if (topic.lastUsed) {
            _push(`<!--[--> · Laatst: ${ssrInterpolate(formatDate(topic.lastUsed))}<!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</span></div><div class="topic-actions" data-v-27ed3b7f><button class="btn btn-sm btn-secondary"${ssrIncludeBooleanAttr(unref(generating)) ? " disabled" : ""} data-v-27ed3b7f> Nu genereren </button><button class="btn btn-sm btn-danger" data-v-27ed3b7f> Verwijderen </button></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="empty" data-v-27ed3b7f>Nog geen onderwerpen toegevoegd.</p>`);
      }
      _push(`</div><div class="card section" data-v-27ed3b7f><h2 data-v-27ed3b7f>Handmatig genereren</h2><p class="hint-text" data-v-27ed3b7f>Genereer direct een blog op basis van het minst gebruikte onderwerp.</p>`);
      if (unref(generateError)) {
        _push(`<p class="error" data-v-27ed3b7f>${ssrInterpolate(unref(generateError))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(generateSuccess)) {
        _push(`<p class="success" data-v-27ed3b7f>${ssrInterpolate(unref(generateSuccess))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="btn btn-primary"${ssrIncludeBooleanAttr(unref(generating) || !unref(topics).length) ? " disabled" : ""} data-v-27ed3b7f>${ssrInterpolate(unref(generating) ? "Genereren... (kan even duren)" : "Genereer blog nu")}</button>`);
      if (!unref(topics).length) {
        _push(`<span class="hint" data-v-27ed3b7f> — Voeg eerst onderwerpen toe</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/ai-blog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const aiBlog = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-27ed3b7f"]]);
export {
  aiBlog as default
};
//# sourceMappingURL=ai-blog-C3Vlz71P.js.map
