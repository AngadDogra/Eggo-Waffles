// dashboard.js

// ---------- Supabase client setup ----------
const SUPABASE_URL = "https://enjxhfxgblspbocvlnpw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVuanhoZnhnYmxzcGJvY3ZsbnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MzgxOTYsImV4cCI6MjA2MDIxNDE5Nn0.tM-auX85l4q5PW5EptdBTeapATzokVOhPpcb07CE3xg";

// `supabase` global comes from ../frontend/lib/supabase.js (UMD build)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper: extension-safe redirect URL for OAuth
function getRedirectURL() {
  try {
    if (typeof chrome !== "undefined" && chrome.runtime?.id) {
      // Redirect back to this dashboard page inside the extension
      return `chrome-extension://${chrome.runtime.id}/frontend/dashboard.html`;
    }
  } catch (_) {}
  // Fallback for web testing
  return window.location.origin + window.location.pathname;
}

// ---------- Auth ----------
async function signInWithGoogle() {
    const redirectUrl = await new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow(
            {
                url: "https://enjxhfxgblspbocvlnpw.supabase.co/auth/v1/authorize?provider=google&redirect_to=" + encodeURIComponent(chrome.identity.getRedirectURL()),
                interactive: true
            },
            (redirectUrl) => {
                if (chrome.runtime.lastError || !redirectUrl) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(redirectUrl);
                }
            }
        );
    });

    // Extract the access token
    const params = new URLSearchParams(redirectUrl.split('#')[1]);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token') || '';

    if (accessToken) {
        localStorage.setItem('jwt_token', accessToken);

        // Now you can safely await here
        await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
        });

        window.location.href = chrome.runtime.getURL('frontend/dashboard.html');
    }    
}


async function logout() {
  await supabaseClient.auth.signOut();
  localStorage.removeItem("jwt_token");
  // Reload the dashboard to reset UI state
  window.location.href = chrome.runtime.getURL("frontend/dashboard.html");
}

// Keep localStorage token in sync (optional, not strictly needed if you always use supabaseClient)
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (session?.access_token) {
    localStorage.setItem("jwt_token", session.access_token);
  } else {
    localStorage.removeItem("jwt_token");
  }
});

// ---------- Data ----------
async function getPomodoroHistory() {
  const { data: userData } = await supabaseClient.auth.getUser();
  const user = userData?.user;
  if (!user) {
    alert("You must be logged in to view your Pomodoros.");
    setUserUI(null);
    setPomodoroList([]);
    return;
  }

  const { data, error } = await supabaseClient
    .from("pomodoros")
    .select("*")
    .eq("user_id", user.id)
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Fetch error:", error);
    alert("Error fetching Pomodoro data.");
    return;
  }

  setUserUI(user);
  setPomodoroList(data || []);
}

async function logPomodoro(pomodoros, sessionName) {
  const { data: userData } = await supabaseClient.auth.getUser();
  const user = userData?.user;
  if (!user) {
    alert("You must be logged in to log Pomodoros.");
    return;
  }

  const { error } = await supabaseClient
    .from("pomodoros")
    .insert([{
      user_id: user.id,
      session_name: sessionName,
      pomodoros: pomodoros,
      timestamp: new Date().toISOString()
    }]);

  if (error) {
    console.error("Insert error:", error);
    alert("Error logging Pomodoro.");
    return;
  }

  alert("Pomodoro logged successfully!");
  getPomodoroHistory();
}

// ---------- UI helpers ----------
function setUserUI(user) {
  const nameEl = document.getElementById("user-name");
  const emailEl = document.getElementById("user-email");
  if (!user) {
    if (nameEl) nameEl.textContent = "Guest";
    if (emailEl) emailEl.textContent = "";
    const countEl = document.getElementById("pomodoroCountDisplay");
    if (countEl) countEl.textContent = "0";
    return;
  }
  if (nameEl) nameEl.textContent = user.user_metadata?.full_name || "User";
  if (emailEl) emailEl.textContent = user.email || "";
}

function setPomodoroList(rows) {
  const countEl = document.getElementById("pomodoroCountDisplay");
  const listEl = document.getElementById("pomodoroList");
  if (countEl) countEl.textContent = `Pomodoros Completed: ${rows.length}`;
  if (!listEl) return;

  listEl.innerHTML = "";
  rows.forEach((session) => {
    const li = document.createElement("li");
    li.textContent = `Session: ${session.session_name}, Pomodoros: ${session.pomodoros}, Completed at: ${new Date(session.timestamp).toLocaleString()}`;
    listEl.appendChild(li);
  });
}

function showSection(sectionId) {
  const sections = document.querySelectorAll(".tab-content");
  sections.forEach((s) => (s.style.display = "none"));

  const active = document.getElementById(sectionId);
  if (active) active.style.display = "block";

  const items = document.querySelectorAll(".sidebar li");
  items.forEach((li) => li.classList.remove("active"));

  const links = document.querySelectorAll('#sidebar-links a');
  links.forEach((a) => {
    if (a.dataset.section === sectionId) {
      a.parentElement.classList.add("active");
    }
  });
}

// ---------- DOM Ready ----------
document.addEventListener("DOMContentLoaded", async () => {
  // Wire sidebar links (no inline JS)
  const links = document.querySelectorAll('#sidebar-links a[data-section]');
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const section = a.dataset.section;
      showSection(section);
    });
  });

  // Default section
  showSection("home-section");

  // Wire buttons
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const startBtn = document.getElementById("start-timer");

  if (loginBtn) loginBtn.addEventListener("click", signInWithGoogle);
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      alert("Starting Pomodoro timer... (implement timer logic here)");
      // Example: when a pomodoro completes, call:
      // logPomodoro(1, "Focused Session");
    });
  }

  // If token came via URL (e.g., testing web flow)
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromURL = urlParams.get("token");
  if (tokenFromURL) {
    localStorage.setItem("jwt_token", tokenFromURL);
    window.history.replaceState({}, document.title, "/frontend/dashboard.html");
  }

  // If already logged in, render history
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (session) {
    setUserUI(session.user);
    getPomodoroHistory();
  } else {
    setUserUI(null);
    setPomodoroList([]);
  }
});
