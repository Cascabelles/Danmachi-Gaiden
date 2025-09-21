import { withPluginApi } from "discourse/lib/plugin-api";

// Lee settings del theme
function parseUIDs(setting) {
  return String(setting || "")
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);
}

export default {
  name: "custom-home-ui",
  initialize() {
    withPluginApi("1.8.0", (api) => {
      // 1) Ruta de landing ya registrada en tu otro initializer (custom-homepage-route)
      // 2) Cargar últimos temas cuando estamos en /home
      api.onPageChange((url) => {
        if (url !== "/home") return;

        // Lista de últimos temas
        const list = document.querySelector("#latest-list");
        if (list) {
          fetch("/latest.json?per_page=5")
            .then((r) => r.json())
            .then((data) => {
              const topics = (data?.topic_list?.topics || []).slice(0, 5);
              list.innerHTML = "";
              if (!topics.length) {
                list.innerHTML = "<li>No hay temas aún.</li>";
                return;
              }
              topics.forEach((t) => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = `/t/${t.slug}/${t.id}`;
                a.textContent = t.fancy_title || t.title || "(sin título)";
                li.appendChild(a);
                list.appendChild(li);
              });
            })
            .catch(() => (list.innerHTML = "<li>Error cargando temas.</li>"));
        }

        // Cajón de tareas (visible solo a ciertos UIDs)
        const currentUser = api.getCurrentUser();
        const allowed = parseUIDs(settings.tasks_visible_to_uids); // ver settings.yml
        const tab = document.getElementById("tasks-tab");
        const drawer = document.getElementById("tasks-drawer");
        if (!tab || !drawer) return;

        const canSee = currentUser && (allowed.length === 0 || allowed.includes(currentUser.id));
        if (!canSee) {
          tab.style.display = "none";
          drawer.style.display = "none";
          return;
        }

        const KEY = `tasksDrawerUntil:${currentUser.id}`;
        const KEY_OPEN = `tasksDrawerOpen:${currentUser.id}`;
        const isOpen = () => drawer.classList.contains("tasks-drawer--open");
        const open = () => {
          drawer.classList.add("tasks-drawer--open");
          tab.setAttribute("aria-expanded", "true");
          setTimeout(() => document.getElementById("tasks-close")?.focus(), 0);
          try { localStorage.setItem(KEY_OPEN, "1"); } catch {}
        };
        const close = () => {
          drawer.classList.remove("tasks-drawer--open");
          tab.setAttribute("aria-expanded", "false");
          tab.focus();
          try { localStorage.setItem(KEY_OPEN, "0"); } catch {}
        };
        const now = Date.now();
        const until = parseInt(localStorage.getItem(KEY) || "0", 10) || 0;
        const autoOpen = settings.tasks_auto_open && now >= until;
        const savedOpen = localStorage.getItem(KEY_OPEN) === "1";
        if (savedOpen || autoOpen) open();

        tab.addEventListener("click", () => (isOpen() ? close() : open()));
        tab.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); isOpen() ? close() : open(); }
        });
        document.getElementById("tasks-close")?.addEventListener("click", close);
        document.getElementById("tasks-dont-show-today")?.addEventListener("click", () => {
          try { localStorage.setItem(KEY, String(Date.now() + 24 * 60 * 60 * 1000)); } catch {}
          close();
        });
        document.getElementById("tasks-open-index")?.addEventListener("click", () => {
          window.location.href = "/categories";
        });
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && isOpen()) close();
        });
      });
    });
  },
};
