<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>tetsudo-site</title>
    <link href="https://googleapis.com" rel="stylesheet">
    <style>
        :root { --blue: #007bff; --dark-blue: #0056b3; --green: #5cb85c; --bg: #f8f9fa; }
        html, body { margin: 0; padding: 0; background: var(--bg); color: #333; overflow-x: hidden; }
        header { background: var(--blue); color: white; padding: 35px 0; text-align: center; }
        header h1 { margin: 0; font-size: 1.8rem; font-weight: bold; }
        
        /* ナビゲーション */
        nav { background: white; display: flex; justify-content: center; padding: 12px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; }
        .nav-inner { display: flex; width: 100%; max-width: 800px; justify-content: space-between; gap: 4px; overflow-x: auto; }
        .nav-inner::-webkit-scrollbar { display: none; }
        .nav-btn { flex: 1; border: none; background: none; padding: 10px 5px; cursor: pointer; font-weight: bold; color: #555; font-size: 0.85rem; border-radius: 25px; transition: 0.2s; text-align: center; white-space: nowrap; min-width: 60px; }
        .nav-btn.active { background: var(--blue); color: white; box-shadow: 0 4px 10px rgba(0,123,255,0.3); }

        .container { padding: 20px 15px; max-width: 600px; margin: auto; }

        /* 検索バーのスタイル */
        .search-container { margin-bottom: 20px; }
        .search-input { 
            width: 100%; padding: 12px 15px; border: 2px solid #ddd; border-radius: 10px; 
            font-size: 1rem; box-sizing: border-box; transition: 0.3s;
        }
        .search-input:focus { border-color: var(--blue); outline: none; background: #fff; box-shadow: 0 0 8px rgba(0,123,255,0.1); }

        /* リンクカード */
        .link-card { background: white; padding: 18px; margin-bottom: 12px; border-radius: 12px; box-shadow: 0 3px 10px rgba(0,0,0,0.03); border-left: 6px solid var(--blue); position: relative; }
        .link-header { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
        .cat-badge { font-size: 0.6rem; padding: 2px 8px; border-radius: 4px; color: white; font-weight: bold; white-space: nowrap; }
        .badge-keio { background: #ff0080; }
        .badge-jr { background: #008000; }
        .badge-docs { background: #ffc107; color: #333; }
        .badge-others { background: #6c757d; }
        .link-title { font-size: 1.05rem; color: var(--blue); text-decoration: none; font-weight: bold; line-height: 1.4; }
        .link-desc { font-size: 0.8rem; color: #666; margin-top: 8px; border-top: 1px solid #f0f0f0; padding-top: 8px; }
        .delete-btn { color: #ff4444; border: none; background: none; cursor: pointer; float: right; font-weight: bold; font-size: 0.8rem; }

        .card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); }
        .btn-green { background: var(--green); color: white; border: none; padding: 16px; width: 100%; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 25px; font-size: 1rem; }
        .btn-blue { background: var(--blue); color: white; border: none; padding: 16px; width: 100%; border-radius: 8px; font-weight: bold; cursor: pointer; }
        input, select, textarea { width: 100%; padding: 12px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 1rem; }
    </style>
</head>
<body>

<header><h1>tetsudo-site</h1></header>

<nav><div class="nav-inner">
    <button class="nav-btn active" onclick="showSection('all', this)">すべて</button>
    <button class="nav-btn" onclick="showSection('keio', this)">京王</button>
    <button class="nav-btn" onclick="showSection('jr', this)">JR線</button>
    <button class="nav-btn" onclick="showSection('docs', this)">資料</button>
    <button class="nav-btn" onclick="showSection('others', this)">その他</button>
    <button class="nav-btn" onclick="showSection('settings', this)">同期・管理</button>
</div></nav>

<div class="container">
    <!-- 検索バー -->
    <div class="search-container" id="search-bar-wrap">
        <input type="text" id="keyword-search" class="search-input" placeholder="🔍 キーワードで検索..." oninput="renderWithSearch()">
    </div>

    <div id="links-view">
        <h2 id="page-title" style="font-size: 1.3rem; margin-bottom: 15px;">すべて</h2>
        <div id="links-list"></div>
    </div>

    <!-- 設定画面 -->
    <div id="settings" style="display:none;">
        <div class="card">
            <h2>同期と管理</h2>
            <button class="btn-green" onclick="importData()">クラウドから読込 (受信)</button>
            <p style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">編集用パスワードを入力してください</p>
            <input type="password" id="admin-pass" placeholder="Password">
            <button class="btn-blue" onclick="unlockEditor()" style="margin-bottom: 20px;">ロック解除</button>
            
            <div id="edit-tools" style="display:none; border-top: 2px dashed #eee; padding-top: 25px;">
                <select id="new-cat">
                    <option value="keio">京王</option>
                    <option value="jr">JR線</option>
                    <option value="docs">資料</option>
                    <option value="others">その他</option>
                </select>
                <input type="text" id="new-title" placeholder="サイト名">
                <input type="url" id="new-url" placeholder="URL (https://...)">
                <textarea id="new-desc" placeholder="詳細説明（任意）" rows="3"></textarea>
                <button class="btn-blue" onclick="addLink()">リストに追加</button>
                <button class="btn-blue" style="background:#666; margin-top:10px;" onclick="exportData()">クラウドに保存 (送信)</button>
            </div>
            <p id="sync-status" style="text-align:center; font-size:0.85rem; color:var(--blue); margin-top:15px; font-weight:bold; min-height:1.2em;"></p>
        </div>
    </div>
</div>

<script>
    const GAS_URL = "https://script.google.com/macros/s/AKfycbzwdxyec68__OZYLtea6buKy4O9XkKm5qfrJKkuzWx7UDf9f4WAibPWcDnVNMdTs3B3HQ/exec";
    const MASTER_PASS = "0829"; 
    let links = JSON.parse(localStorage.getItem('tetsudo_links')) || [];
    let isUnlocked = false;
    let currentFilter = 'all';

    const catLabels = { keio: "京王", jr: "JR線", docs: "資料", others: "その他" };

    function showSection(cat, btn) {
        currentFilter = cat;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const isSettings = (cat === 'settings');
        document.getElementById('links-view').style.display = isSettings ? 'none' : 'block';
        document.getElementById('settings').style.display = isSettings ? 'block' : 'none';
        document.getElementById('search-bar-wrap').style.display = isSettings ? 'none' : 'block';

        if(!isSettings) {
            document.getElementById('page-title').innerText = btn.innerText;
            renderWithSearch();
        }
    }

    function renderWithSearch() {
        const list = document.getElementById('links-list');
        const keyword = document.getElementById('keyword-search').value.toLowerCase();
        list.innerHTML = '';
        
        // フィルタリング処理（カテゴリ ＋ 資料除外 ＋ 検索ワード）
        const filtered = links.filter(item => {
            const matchCat = (currentFilter === 'all') ? (item.cat !== 'docs') : (item.cat === currentFilter);
            const matchWord = item.title.toLowerCase().includes(keyword) || (item.desc && item.desc.toLowerCase().includes(keyword));
            return matchCat && matchWord;
        });
        
        filtered.forEach((item) => {
            const originalIndex = links.indexOf(item);
            list.innerHTML += `<div class="link-card">
                <div class="link-header">
                    <span class="cat-badge badge-${item.cat}">${catLabels[item.cat]}</span>
                    <a href="${item.url}" target="_blank" class="link-title">${item.title}</a>
                </div>
                ${item.desc ? `<div class="link-desc">${item.desc}</div>` : ''}
                ${isUnlocked ? `<button class="delete-btn" onclick="deleteLink(${originalIndex})">削除</button>` : ''}
            </div>`;
        });
    }

    function unlockEditor() {
        if(document.getElementById('admin-pass').value === MASTER_PASS) {
            isUnlocked = true;
            document.getElementById('edit-tools').style.display = 'block';
            alert('ロック解除成功');
            renderWithSearch();
        } else { alert('パスワードが違います'); }
    }

    function addLink() {
        const title = document.getElementById('new-title').value;
        const url = document.getElementById('new-url').value;
        if(!title || !url) return alert('入力してください');
        links.push({ title, url, desc: document.getElementById('new-desc').value, cat: document.getElementById('new-cat').value });
        save();
        alert('追加しました');
        document.getElementById('new-title').value = '';
        document.getElementById('new-url').value = '';
        document.getElementById('new-desc').value = '';
    }

    function deleteLink(i) { if(confirm('削除しますか？')) { links.splice(i,1); save(); } }
    function save() { localStorage.setItem('tetsudo_links', JSON.stringify(links)); renderWithSearch(); }

    async function exportData() {
        document.getElementById('sync-status').innerText = "送信中...";
        try {
            await fetch(GAS_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(links) });
            document.getElementById('sync-status').innerText = "クラウド保存完了！";
        } catch (e) { document.getElementById('sync-status').innerText = "送信エラー"; }
    }

    async function importData() {
        document.getElementById('sync-status').innerText = "受信中...";
        try {
            const res = await fetch(GAS_URL);
            links = await res.json();
            save();
            document.getElementById('sync-status').innerText = "同期完了！";
        } catch (e) { document.getElementById('sync-status').innerText = "受信エラー"; }
    }
    renderWithSearch();
</script>
</body>
</html>
