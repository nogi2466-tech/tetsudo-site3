<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>URL一覧管理（Firebase同期）</title>
<style>
  body { font-family: sans-serif; margin: 20px; background: #f5f5f5; }

  h1 { margin-bottom: 10px; }

  .category { margin-top: 20px; padding: 10px; border-radius: 8px; }

  /* カテゴリ色分け */
  .京王 { background: #ffe0e0; }
  .JR { background: #e0f0ff; }
  .大手私鉄 { background: #e8ffe0; }
  .その他 { background: #fff5d6; }
  .資料 { background: #e8e8e8; }

  .item { background: #fff; padding: 10px; margin: 5px 0; border-radius: 6px; }
  button { margin-left: 5px; }

  #editArea { display: none; margin-top: 20px; padding: 10px; background: #eef; border-radius: 6px; }
</style>
</head>
<body>

<h1>URL一覧（Firebase同期）</h1>

<div id="categories"></div>

<hr>

<h2>設定</h2>
<input type="password" id="pass" placeholder="パスワードを入力">
<button onclick="checkPass()">送信</button>

<div id="editArea">
  <h3>URL追加 / 編集</h3>
  <select id="editCategory"></select><br><br>
  <input id="editLabel" placeholder="名前"><br><br>
  <input id="editURL" placeholder="URL"><br><br>
  <button onclick="saveItem()">保存</button>
  <button onclick="cancelEdit()">キャンセル</button>
</div>

<!-- Firebase SDK -->
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";
  import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";
  import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

  /* ★ 君の Firebase 設定（そのままでOK） */
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

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  const PASSWORD = "0829";

  let data = {
    "京王": [],
    "JR": [],
    "大手私鉄": [],
    "その他": [],
    "資料": []
  };

  let editIndex = null;

  /* ★ 匿名ログイン */
  const auth = getAuth();
  signInAnonymously(auth)
    .then(() => {
      console.log("匿名ログイン成功");
      startDatabase();
    })
    .catch((error) => {
      console.error("ログインエラー:", error);
    });

  /* ★ Firebase Realtime Database */
  function startDatabase() {
    const db = getDatabase();
    const dataRef = ref(db, "urlData");

    // リアルタイム取得
    onValue(dataRef, (snapshot) => {
      const val = snapshot.val();
      if (val) data = val;
      render();
    });

    // 保存関数
    window.saveToFirebase = function() {
      set(dataRef, data);
    };
  }

  /* ★ 画面描画 */
  function render() {
    const container = document.getElementById("categories");
    container.innerHTML = "";

    for (const cat in data) {
      // 名前順ソート
      data[cat].sort((a, b) => a.label.localeCompare(b.label, "ja"));

      const div = document.createElement("div");
      div.className = `category ${cat}`;
      div.innerHTML = `<h2>${cat}</h2>`;

      data[cat].forEach((item, i) => {
        const row = document.createElement("div");
        row.className = "item";
        row.innerHTML = `
          <a href="${item.url}" target="_blank">${item.label}</a>
          ${cat !== "資料" ? `<button onclick="edit('${cat}', ${i})">編集</button>
          <button onclick="del('${cat}', ${i})">削除</button>` : ""}
        `;
        div.appendChild(row);
      });

      container.appendChild(div);
    }
  }

  /* ★ パスワードチェック */
  window.checkPass = function() {
    const p = document.getElementById("pass").value;
    if (p === PASSWORD) {
      document.getElementById("editArea").style.display = "block";
      fillCategorySelect();
    } else {
      alert("パスワードが違います");
    }
  };

  /* ★ カテゴリ選択肢 */
  function fillCategorySelect() {
    const sel = document.getElementById("editCategory");
    sel.innerHTML = "";
    for (const cat in data) {
      if (cat !== "資料") {
        const op = document.createElement("option");
        op.value = cat;
        op.textContent = cat;
        sel.appendChild(op);
      }
    }
  }

  /* ★ 保存 */
  window.saveItem = function() {
    const cat = document.getElementById("editCategory").value;
    const label = document.getElementById("editLabel").value;
    const url = document.getElementById("editURL").value;

    if (!label || !url) {
      alert("名前とURLを入力してください");
      return;
    }

    if (editIndex !== null) {
      data[cat][editIndex] = { label, url };
    } else {
      data[cat].push({ label, url });
    }

    saveToFirebase();
    cancelEdit();
  };

  /* ★ 編集 */
  window.edit = function(cat, index) {
    editIndex = index;

    document.getElementById("editArea").style.display = "block";
    fillCategorySelect();
    document.getElementById("editCategory").value = cat;
    document.getElementById("editLabel").value = data[cat][index].label;
    document.getElementById("editURL").value = data[cat][index].url;
  };

  /* ★ 削除 */
  window.del = function(cat, index) {
    if (confirm("削除しますか")) {
      data[cat].splice(index, 1);
      saveToFirebase();
    }
  };

  /* ★ 編集キャンセル */
  window.cancelEdit = function() {
    editIndex = null;
    document.getElementById("editLabel").value = "";
    document.getElementById("editURL").value = "";
  };
</script>

</body>
</html>
