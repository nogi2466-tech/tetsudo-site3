<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>tetsudo-site（Firebase同期）</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; background: #f5f5f5; }
    header { background: #1976d2; color: #fff; padding: 10px 16px; }
    header h1 { margin: 0 0 8px; font-size: 20px; }
    .tabs { display: flex; flex-wrap: wrap; gap: 4px; }
    .tab { padding: 6px 10px; border-radius: 16px; cursor: pointer; font-size: 13px; }
    .tab.active { background: #fff; color: #1976d2; font-weight: 600; }
    .search-bar { padding: 10px 16px; background: #e3f2fd; }
    .search-bar input { width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #bbb; font-size: 14px; }

    main { padding: 12px 16px 24px; }

    .section-title { font-size: 16px; margin: 8px 0 12px; }

    .card-list { display: flex; flex-direction: column; gap: 8px; }
    .card { background: #fff; border-radius: 8px; padding: 10px 12px; border-left: 4px solid #ccc; cursor: pointer; }
    .card:hover { background: #f0f7ff; }
    .card-category { font-size: 11px; color: #666; margin-bottom: 4px; }
    .card-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
    .card-detail { font-size: 13px; color: #555; }

    /* カテゴリ色 */
    .cat-京王 { border-left-color: #e57373; }
    .cat-JR { border-left-color: #64b5f6; }
    .cat-大手私鉄 { border-left-color: #81c784; }
    .cat-その他 { border-left-color: #ffb74d; }
    .cat-資料 { border-left-color: #9e9e9e; }
    .cat-画像 { border-left-color: #ba68c8; }

    /* 同期・管理 */
    .settings { max-width: 480px; margin-top: 8px; }
    .settings label { font-size: 13px; display: block; margin: 8px 0 4px; }
    .settings input, .settings select, .settings textarea {
      width: 100%; padding: 6px 8px; font-size: 13px;
      border-radius: 4px; border: 1px solid #bbb; box-sizing: border-box;
    }
    .settings textarea { resize: vertical; min-height: 60px; }
    .settings button { margin-top: 10px; padding: 6px 12px; font-size: 13px; border-radius: 4px; border: none; background: #1976d2; color: #fff; cursor: pointer; }
    .settings button:hover { background: #145ca3; }
    .hint { font-size: 12px; color: #666; margin-top: 4px; }
    .hidden { display: none; }

    @media (max-width: 600px) {
      .tabs { gap: 2px; }
      .tab { font-size: 12px; padding: 5px 8px; }
      .card { padding: 8px 10px; }
    }
  </style>
</head>
<body>
<header>
  <h1>tetsudo-site</h1>
  <div class="tabs" id="tabs">
    <div class="tab active" data-tab="すべて">すべて</div>
    <div class="tab" data-tab="京王">京王</div>
    <div class="tab" data-tab="JR">JR</div>
    <div class="tab" data-tab="大手私鉄">大手私鉄</div>
    <div class="tab" data-tab="その他">その他</div>
    <div class="tab" data-tab="資料">資料</div>
    <div class="tab" data-tab="画像">画像</div>
    <div class="tab" data-tab="同期・管理">同期・管理</div>
  </div>
</header>

<div class="search-bar">
  <input type="text" id="searchInput" placeholder="タイトルで検索…">
</div>

<main>
  <div id="listSection">
    <div class="section-title" id="sectionTitle">すべて</div>
    <div class="card-list" id="cardList"></div>
  </div>

  <div id="settingsSection" class="hidden">
    <div class="section-title">同期・管理</div>

    <div class="settings">
      <label for="adminPass">編集パスワード</label>
      <input type="password" id="adminPass" placeholder="パスワードを入力">
      <button id="passSubmit">送信</button>
      <div class="hint">正しいパスワードを入力すると、URL追加フォームが表示されます。</div>
    </div>

    <div class="settings hidden" id="addForm">
      <hr style="margin:16px 0;">
      <div class="section-title">新規URL追加</div>

      <label for="newTitle">タイトル</label>
      <input type="text" id="newTitle" placeholder="例：京王 2000系">

      <label for="newURL">URL</label>
      <input type="text" id="newURL" placeholder="https://...">

      <label for="newDetail">詳細</label>
      <textarea id="newDetail" placeholder="例：特急京王八王子行き 新宿→笹塚"></textarea>

      <label for="newCategory">カテゴリ</label>
      <select id="newCategory">
        <option value="京王">京王</option>
        <option value="JR">JR</option>
        <option value="大手私鉄">大手私鉄</option>
        <option value="その他">その他</option>
        <option value="資料">資料</option>
        <option value="画像">画像</option>
      </select>

      <button id="addSubmit">追加</button>
      <div class="hint">追加したURLはFirebaseに保存され、他のデバイスにも同期されます。</div>
    </div>
  </div>
</main>

<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";
  import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";
  import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyD55Pawag1UichGwM-Uxddivb8lFr7QOU8",
    authDomain: "tetsudo-site6.firebaseapp.com",
    databaseURL: "https://tetsudo-site6-default-rtdb.firebaseio.com",
    projectId: "tetsudo-site6",
    storageBucket: "tetsudo-site6.firebasestorage.app",
    messagingSenderId: "563943849207",
    appId: "1:563943849207:web:1c813365201cb431d6e7f2",
    measurementId: "G-JX8SDMF3ZB"
  };

  const PASSWORD = "0829";

  const app = initializeApp(firebaseConfig);
  getAnalytics(app);

  const auth = getAuth();
  const db = getDatabase();

  let items = []; // {title, url, detail, category}
  let currentTab = "すべて";
  let searchText = "";

  const tabsEl = document.getElementById("tabs");
  const searchInput = document.getElementById("searchInput");
  const cardList = document.getElementById("cardList");
  const sectionTitle = document.getElementById("sectionTitle");
  const listSection = document.getElementById("listSection");
  const settingsSection = document.getElementById("settingsSection");

  const adminPass = document.getElementById("adminPass");
  const passSubmit = document.getElementById("passSubmit");
  const addForm = document.getElementById("addForm");
  const newTitle = document.getElementById("newTitle");
  const newURL = document.getElementById("newURL");
  const newDetail = document.getElementById("newDetail");
  const newCategory = document.getElementById("newCategory");
  const addSubmit = document.getElementById("addSubmit");

  // 匿名ログイン
  signInAnonymously(auth).then(() => {
    const dataRef = ref(db, "urlData");
    onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (val && Array.isArray(val)) {
        items = val;
      } else if (val && typeof val === "object") {
        // 旧形式から移行する場合など
        items = Object.values(val);
      } else {
        items = [];
      }
      render();
    });
  }).catch(console.error);

  function saveToFirebase() {
    const dataRef = ref(db, "urlData");
    set(dataRef, items);
  }

  function render() {
    if (currentTab === "同期・管理") {
      listSection.classList.add("hidden");
      settingsSection.classList.remove("hidden");
      return;
    } else {
      listSection.classList.remove("hidden");
      settingsSection.classList.add("hidden");
    }

    sectionTitle.textContent = currentTab;

    const filtered = items
      .filter(item => {
        if (currentTab !== "すべて" && item.category !== currentTab) return false;
        if (!searchText) return true;
        return item.title.toLowerCase().includes(searchText.toLowerCase());
      })
      .sort((a, b) => a.title.localeCompare(b.title, "ja"));

    cardList.innerHTML = "";
    filtered.forEach(item => {
      const card = document.createElement("div");
      const catClass = "cat-" + (item.category || "").replace(/ /g, "");
      card.className = "card " + catClass;
      card.addEventListener("click", () => {
        if (item.url) window.open(item.url, "_blank");
      });

      const cat = document.createElement("div");
      cat.className = "card-category";
      cat.textContent = item.category || "";

      const title = document.createElement("div");
      title.className = "card-title";
      title.textContent = item.title || "";

      const detail = document.createElement("div");
      detail.className = "card-detail";
      detail.textContent = item.detail || "";

      card.appendChild(cat);
      card.appendChild(title);
      card.appendChild(detail);
      cardList.appendChild(card);
    });
  }

  // タブ切り替え
  tabsEl.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab");
    if (!tab) return;
    const tabName = tab.dataset.tab;
    currentTab = tabName;

    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    render();
  });

  // 検索
  searchInput.addEventListener("input", () => {
    searchText = searchInput.value.trim();
    render();
  });

  // パスワードチェック
  passSubmit.addEventListener("click", () => {
    if (adminPass.value === PASSWORD) {
      addForm.classList.remove("hidden");
      adminPass.value = "";
    } else {
      alert("パスワードが違います");
    }
  });

  // 追加
  addSubmit.addEventListener("click", () => {
    const title = newTitle.value.trim();
    const url = newURL.value.trim();
    const detail = newDetail.value.trim();
    const category = newCategory.value;

    if (!title || !url) {
      alert("タイトルとURLは必須です");
      return;
    }

    items.push({ title, url, detail, category });
    saveToFirebase();

    newTitle.value = "";
    newURL.value = "";
    newDetail.value = "";
    newCategory.value = "京王";

    alert("追加しました");
    if (currentTab !== "同期・管理") render();
  });
</script>
</body>
</html>
