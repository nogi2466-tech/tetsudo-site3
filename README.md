<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>tetsudo-site</title>
    <style>
        :root { --blue: #007bff; --dark-blue: #0056b3; --green: #5cb85c; --bg: #f8f9fa; }
        /* カテゴリーカラーの設定 */
        :root { 
            --color-keio: #ff0080; 
            --color-jr: #008000; 
            --color-private: #f39c12; 
            --color-others: #6c757d; 
            --color-docs: #ffc107; 
            --color-images: #17a2b8; 
        }

        html, body { margin: 0; padding: 0; background: var(--bg); color: #333; overflow-x: hidden; }
        header { background: var(--blue); color: white; padding: 35px 0; text-align: center; }
        header h1 { margin: 0; font-size: 1.8rem; font-weight: bold; }
        nav { background: white; display: flex; justify-content: center; padding: 12px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; }
        .nav-inner { display: flex; width: 100%; max-width: 800px; justify-content: space-between; gap: 4px; overflow-x: auto; }
        .nav-inner::-webkit-scrollbar { display: none; }
        .nav-btn { flex: 1; border: none; background: none; padding: 10px 5px; cursor: pointer; font-weight: bold; color: #555; font-size: 0.85rem; border-radius: 25px; transition: 0.2s; text-align: center; white-space: nowrap; min-width: 60px; }
        .nav-btn.active { background: var(--blue); color: white; box-shadow: 0 4px 10px rgba(0,123,255,0.3); }
        .container { padding: 20px 15px; max-width: 600px; margin: auto; }
        .search-container { margin-bottom: 20px; }
        .search-input { width: 100%; padding: 12px 15px; border: 2px solid #ddd; border-radius: 10px; font-size: 1rem; box-sizing: border-box; }
        
        .link-card { background: white; padding: 18px; margin-bottom: 12px; border-radius: 12px; box-shadow: 0 3px 10px rgba(0,0,0,0.03); position: relative; border-left: 6px solid #ccc; }
        .card-keio { border-left-color: var(--color-keio); }
        .card-jr { border-left-color: var(--color-jr); }
        .card-private { border-left-color: var(--color-private); }
        .card-others { border-left-color: var(--color-others); }
        .card-docs { border-left-color: var(--color-docs); }
        .card-images { border-left-color: var(--color-images); }

        .link-header { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
        .cat-badge { font-size: 0.6rem; padding: 2px 8px; border-radius: 4px; color: white; font-weight: bold; white-space: nowrap; }
        .badge-keio { background: var(--color-keio); }
        .badge-jr { background: var(--color-jr); }
        .badge-private { background: var(--color-private); }
        .badge-docs { background: var(--color-docs); color: #333; }
        .badge-images { background: var(--color-images); }
        .badge-others { background: var(--color-others); }
        
        .link-title { font-size: 1.05rem; color: var(--blue); text-decoration: none; font-weight: bold; display: inline-block; cursor: pointer; }
        .link-title:hover { text-decoration: underline; }
        .link-desc { font-size: 0.8rem; color: #666; margin-top: 8px; border-top: 1px solid #f0f0f0; padding-top: 8px; }
        
        .link-img-wrap { margin-top: 10px; max-width: 100%; text-align: center; background: #eee; border-radius: 6px; overflow: hidden; display: block; }
        .link-img { max-width: 100%; max-height: 200px; object-fit: contain; display: block; margin: 0 auto; cursor: pointer; }

        .action-btns { margin-top: 10px; text-align: right; display: flex; justify-content: flex-end; gap: 15px; }
        .delete-btn { color: #ff4444; border: none; background: none; cursor: pointer; font-weight: bold; font-size: 0.8rem; }
        .edit-btn { color: var(--blue); border: none; background: none; cursor: pointer; font-weight: bold; font-size: 0.8rem; }

        .card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); }
        .btn-green { background: var(--green); color: white; border: none; padding: 16px; width: 100%; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 25px; font-size: 1rem; }
        .btn-blue { background: var(--blue); color: white; border: none; padding: 16px; width: 100%; border-radius: 8px; font-weight: bold; cursor: pointer; }
        input, select, textarea { width: 100%; padding: 12px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 1rem; }
    </style>
</head>
<body>

<header><h1>tetsudo-site</h1></header>

<nav><div class="nav-inner">
    <button id="nav-all" class="nav-btn active" onclick="showSection('all', this)">すべて</button>
    <button class="nav-btn" onclick="showSection('keio', this)">京王</button>
    <button class="nav-btn" onclick="showSection('jr', this)">JR</button>
    <button class="nav-btn" onclick="showSection('private', this)">大手私鉄</button>
    <button class="nav-btn" onclick="showSection('others', this)">その他</button>
    <button class="nav-btn" onclick="showSection('docs', this)">資料</button>
    <button class="nav-btn" onclick="showSection('images', this)">画像</button> 
    <button id="nav-settings" class="nav-btn" onclick="showSection('settings', this)">同期・管理</button>
</div></nav>

<div class="container">
    <div class="search-container" id="search-bar-wrap">
        <input type="text" id="keyword-search" class="search-input" placeholder="🔍 タイトルで検索..." oninput="renderWithSearch()">
    </div>

    <div id="links-view">
        <h2 id="page-title" style="font-size: 1.3rem; margin-bottom: 15px;">すべて</h2>
        <div id="links-list"></div>
    </div>

    <div id="settings" style="display:none;">
        <div class="card">
            <h2 id="edit-mode-title">同期と管理</h2>
            <button class="btn-green" id="import-btn" onclick="importData()">クラウドから読込 (受信)</button>
            
            <div id="password-area">
                <input type="password" id="admin-pass" placeholder="Password">
                <button class="btn-blue" onclick="unlockEditor()">ロック解除</button>
            </div>
            
            <div id="edit-tools" style="display:none; border-top: 2px dashed #eee; padding-top: 25px;">
                <input type="hidden" id="edit-index" value="-1">
                <select id="new-cat">
                    <option value="keio">京王</option>
                    <option value="jr">JR</option>
                    <option value="private">大手私鉄</option>
                    <option value="others">その他</option>
                    <option value="docs">資料</option>
                    <option value="images">画像</option>
                </select>
                <input type="text" id="new-title" placeholder="タイトル">
                <input type="url" id="new-url" placeholder="URL">
                <input type="url" id="new-img-url" placeholder="画像URL（任意・httpから始まる画像のリンク）"> 
                <textarea id="new-desc" placeholder="詳細説明（任意）" rows="3"></textarea>
                <button class="btn-blue" id="add-update-btn" onclick="addOrUpdateLink()">リストに追加</button>
                <button class="btn-blue" id="cancel-edit-btn" style="background:#666; margin-top:10px; display:none;" onclick="resetForm()">キャンセル</button>
                <button class="btn-blue" id="export-btn" style="background:#666; margin-top:10px;" onclick="exportData()">クラウドに保存 (送信)</button>
            </div>
            <p id="sync-status" style="text-align:center; font-size:0.85rem; color:var(--blue); margin-top:15px; font-weight:bold;"></p>
        </div>
    </div>
</div>

<script>
    const GAS_URL = "https://script.google.com/macros/s/AKfycbzwdxyec68__OZYLtea6buKy4O9XkKm5qfrJKkuzWx7UDf9f4WAibPWcDnVNMdTs3B3HQ/exec";
    const MASTER_PASS = "0829"; 
    let links = JSON.parse(localStorage.getItem('tetsudo_links')) || [];
    let isUnlocked = false;
    let currentFilter = 'all';
    const catLabels = { keio: "京王", jr: "JR", private: "大手私鉄", docs: "資料", images: "画像", others: "その他" };

    function showSection(cat, btn) {
        currentFilter = cat;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        if(btn) btn.classList.add('active');
        const isSettings = (cat === 'settings');
        document.getElementById('links-view').style.display = isSettings ? 'none' : 'block';
        document.getElementById('settings').style.display = isSettings ? 'block' : 'none';
        document.getElementById('search-bar-wrap').style.display = isSettings ? 'none' : 'block';
        if(!isSettings) {
            document.getElementById('page-title').innerText = btn ? btn.innerText : 'すべて';
            renderWithSearch();
        }
    }

    function renderWithSearch() {
        const list = document.getElementById('links-list');
        const keyword = document.getElementById('keyword-search').value.toLowerCase();
        
        const mappedLinks = links.map((item, index) => ({ ...item, originalIndex: index }));

        const filteredList = mappedLinks.filter(item => {
            // 「すべて」タブの場合は、画像(images)と資料(docs)を除外する
            const matchCat = (currentFilter === 'all') 
                ? (item.cat !== 'images' && item.cat !== 'docs') 
                : (item.cat === currentFilter);
                
            const matchWord = item.title.toLowerCase().includes(keyword);
            return matchCat && matchWord;
        });

        filteredList.sort((a, b) => a.title.localeCompare(b.title, 'ja'));

        let htmlBuffer = '';
        filteredList.forEach((item) => {
            htmlBuffer += `<div class="link-card card-${item.cat}">
                <div class="link-header">
                    <span class="cat-badge badge-${item.cat}">${catLabels[item.cat]}</span>
                    <a href="${item.url}" target="_blank" class="link-title">${item.title}</a>
                </div>
                ${item.imgUrl ? `
                <a href="${item.url}" target="_blank" class="link-img-wrap">
                    <img src="${item.imgUrl}" class="link-img" alt="thumbnail" onerror="this.parentNode.style.display='none'">
                </a>` : ''}
                ${item.desc ? `<div class="link-desc">${item.desc}</div>` : ''}
                ${isUnlocked ? `
                <div class="action-btns">
                    <button class="edit-btn" onclick="startEdit(${item.originalIndex})">編集</button>
                    <button class="delete-btn" onclick="deleteLink(${item.originalIndex})">削除</button>
                </div>` : ''}
            </div>`;
        });

        list.innerHTML = htmlBuffer || '<p style="text-align:center; color:#999; padding:20px;">該当する項目はありません</p>';
    }

    function unlockEditor() {
        if(document.getElementById('admin-pass').value === MASTER_PASS) {
            isUnlocked = true;
            document.getElementById('password-area').style.display = 'none';
            document.getElementById('edit-tools').style.display = 'block';
            renderWithSearch();
        } else { alert('パスワードが違います'); }
    }

    function startEdit(index) {
        const item = links[index];
        document.getElementById('edit-index').value = index;
        document.getElementById('new-cat').value = item.cat;
        document.getElementById('new-title').value = item.title;
        document.getElementById('new-url').value = item.url;
        document.getElementById('new-img-url').value = item.imgUrl || '';
        document.getElementById('new-desc').value = item.desc || '';
        document.getElementById('add-update-btn').innerText = "修正を保存する";
        document.getElementById('cancel-edit-btn').style.display = "block";
        document.getElementById('edit-mode-title').innerText = "リンクを編集";
        showSection('settings', document.getElementById('nav-settings'));
    }

    function resetForm() {
        document.getElementById('edit-index').value = "-1";
        document.getElementById('new-title').value = '';
        document.getElementById('new-url').value = '';
        document.getElementById('new-img-url').value = '';
        document.getElementById('new-desc').value = '';
        document.getElementById('add-update-btn').innerText = "リストに追加";
        document.getElementById('cancel-edit-btn').style.display = "none";
        document.getElementById('edit-mode-title').innerText = "同期と管理";
    }

    function addOrUpdateLink() {
        const index = parseInt(document.getElementById('edit-index').value);
        const title = document.getElementById('new-title').value.trim();
        const url = document.getElementById('new-url').value.trim();
        const imgUrl = document.getElementById('new-img-url').value.trim();
        const cat = document.getElementById('new-cat').value;
        const desc = document.getElementById('new-desc').value.trim();
        
        if(!title || !url) return alert('入力してください');
        const newItem = { title, url, imgUrl, desc, cat };
        
        if (index === -1) { links.push(newItem); alert('追加しました'); }
        else { links[index] = newItem; alert('修正しました'); }
        save();
        resetForm();
    }

    function deleteLink(i) { if(confirm('削除しますか？')) { links.splice(i,1); save(); } }
    function save() { localStorage.setItem('tetsudo_links', JSON.stringify(links)); renderWithSearch(); }

    async function exportData() {
        document.getElementById('sync-status').innerText = "送信中...";
        try {
            const response = await fetch(GAS_URL, { 
                method: "POST", 
                headers: { "Content-Type": "text/plain" }, 
                body: JSON.stringify(links) 
            });
            document.getElementById('sync-status').innerText = "クラウド保存完了！";
        } catch (e) { 
            console.error(e);
            document.getElementById('sync-status').innerText = "送信エラー"; 
        }
    }

    async function importData() {
        document.getElementById('sync-status').innerText = "受信中...";
        try {
            const res = await fetch(GAS_URL);
            links = await res.json();
            save();
            document.getElementById('sync-status').innerText = "同期完了しました！";
        } catch (e) { 
            console.error(e);
            document.getElementById('sync-status').innerText = "受信エラー"; 
        }
    }
    
    renderWithSearch();
</script>
</body>
</html>
