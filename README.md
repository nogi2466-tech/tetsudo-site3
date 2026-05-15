<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>tetsudo-site</title>
    <style>
        :root { --blue: #007bff; --dark-blue: #0056b3; --green: #5cb85c; --bg: #f8f9fa; }
        :root { 
            --color-keio: #ff0080; 
            --color-jr: #008000; 
            --color-private: #f39c12; 
            --color-others: #6c757d; 
            --color-docs: #ffc107; 
            --color-gallery: #17a2b8; 
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
        .card-gallery { border-left-color: var(--color-gallery); }

        .link-header { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
        .cat-badge { font-size: 0.6rem; padding: 2px 8px; border-radius: 4px; color: white; font-weight: bold; white-space: nowrap; }
        .badge-keio { background: var(--color-keio); }
        .badge-jr { background: var(--color-jr); }
        .badge-private { background: var(--color-private); }
        .badge-docs { background: var(--color-docs); color: #333; }
        .badge-others { background: var(--color-others); }
        .badge-gallery { background: var(--color-gallery); }
        
        .link-title { font-size: 1.05rem; color: var(--blue); text-decoration: none; font-weight: bold; }
        .link-title.no-link { color: #333; cursor: default; }
        
        .link-img-wrap { margin-top: 10px; border-radius: 8px; overflow: hidden; max-height: 300px; background: #eee; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .link-img { width: 100%; height: 100%; object-fit: cover; }
        .link-desc { font-size: 0.8rem; color: #666; margin-top: 8px; border-top: 1px solid #f0f0f0; padding-top: 8px; }
        
        .action-btns { margin-top: 10px; text-align: right; display: flex; justify-content: flex-end; gap: 15px; }
        .delete-btn { color: #ff4444; border: none; background: none; cursor: pointer; font-weight: bold; font-size: 0.8rem; }
        .edit-btn { color: var(--blue); border: none; background: none; cursor: pointer; font-weight: bold; font-size: 0.8rem; }

        .card { background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); }
        .btn-green { background: var(--green); color: white; border: none; padding: 16px; width: 100%; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 25px; font-size: 1rem; }
        .btn-blue { background: var(--blue); color: white; border: none; padding: 16px; width: 100%; border-radius: 8px; font-weight: bold; cursor: pointer; }
        input, select, textarea { width: 100%; padding: 12px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 1rem; }
        
        .preview-area { margin-bottom: 12px; text-align: center; }
        .preview-img { max-width: 100%; max-height: 150px; border-radius: 8px; display: none; }

        .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; overflow: hidden; touch-action: none; user-select: none; }
        .modal-img-container { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative; }
        .modal-img { max-width: 100%; max-height: 100%; object-fit: contain; transition: transform 0.1s ease-out; cursor: grab; transform-origin: center center; }
        .modal-img:active { cursor: grabbing; }
        
        .modal-close { position: absolute; top: 15px; left: 15px; background: rgba(255,255,255,0.2); color: white; border: none; padding: 10px 15px; border-radius: 5px; font-size: 1rem; cursor: pointer; font-weight: bold; z-index: 1001; }
        .modal-download { position: absolute; top: 15px; right: 15px; background: var(--blue); color: white; border: none; padding: 10px 15px; border-radius: 5px; font-size: 1rem; cursor: pointer; font-weight: bold; z-index: 1001; text-decoration: none; }
        #sync-status { text-align: center; font-size: 0.9rem; color: var(--blue); margin-top: 15px; font-weight: bold; min-height: 1.5em; }
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
    <button class="nav-btn" onclick="showSection('gallery', this)">画像</button>
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
                    <option value="gallery">画像</option>
                </select>
                <input type="text" id="new-title" placeholder="タイトル">
                <input type="url" id="new-url" placeholder="URL（画像カテゴリーの場合は空欄可）">
                
                <p style="font-size: 0.85rem; color: #666; margin: 0 0 5px 0;">画像を追加（任意）</p>
                <input type="file" id="new-img" accept="image/*" onchange="previewFile()">
                <div class="preview-area">
                    <img id="form-preview" class="preview-img" src="" alt="プレビュー">
                    <button id="del-img-btn" class="delete-btn" style="display:none; float:none; margin-top:5px;" onclick="clearImageInput()">画像を消去</button>
                </div>

                <textarea id="new-desc" placeholder="詳細説明（任意）" rows="3"></textarea>
                <button class="btn-blue" id="add-update-btn" onclick="addOrUpdateLink()">リストに追加</button>
                <button class="btn-blue" id="cancel-edit-btn" style="background:#666; margin-top:10px; display:none;" onclick="resetForm()">キャンセル</button>
                <button class="btn-blue" id="export-btn" style="background:#666; margin-top:10px;" onclick="exportData()">クラウドに保存 (送信)</button>
            </div>
            <p id="sync-status"></p>
        </div>
    </div>
</div>

<div id="image-modal" class="modal-overlay">
    <button class="modal-close" onclick="closeModal()">閉じる</button>
    <a id="modal-download-link" class="modal-download" download="tetsudo-image.jpg">保存</a>
    <div class="modal-img-container" id="modal-container">
        <img id="modal-target-img" class="modal-img" src="" alt="拡大画像">
    </div>
</div>

<script>
    // ⚠️【最重要】ここに新しくデプロイしたウェブアプリのURLを貼り付けてください
    const GAS_URL = "https://script.google.com/macros/s/AKfycbzwdxyec68__OZYLtea6buKy4O9XkKm5qfrJKkuzWx7UDf9f4WAibPWcDnVNMdTs3B3HQ/exec"; 
    const MASTER_PASS = "0829"; 

    let links = JSON.parse(localStorage.getItem('tetsudo_links')) || [];
    let isUnlocked = false;
    let currentFilter = 'all';
    let currentImageData = ""; 
    const catLabels = { keio: "京王", jr: "JR", private: "大手私鉄", docs: "資料", others: "その他", gallery: "画像" };

    let scale = 1, posX = 0, posY = 0, startX = 0, startY = 0, isDragging = false;
    let startDist = 0;

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
        list.innerHTML = '';

        let displayList = links
            .filter(item => {
                const matchCat = (currentFilter === 'all') ? (item.cat !== 'docs' && item.cat !== 'gallery') : (item.cat === currentFilter);
                const matchWord = item.title.toLowerCase().includes(keyword);
                return matchCat && matchWord;
            })
            .sort((a, b) => a.title.localeCompare(b.title, 'ja'));

        displayList.forEach((item) => {
            const originalIndex = links.indexOf(item);
            const titleHtml = item.url 
                ? `<a href="${item.url}" target="_blank" class="link-title">${item.title}</a>`
                : `<span class="link-title no-link">${item.title}</span>`;

            list.innerHTML += `<div class="link-card card-${item.cat}">
                <div class="link-header">
                    <span class="cat-badge badge-${item.cat}">${catLabels[item.cat]}</span>
                    ${titleHtml}
                </div>
                ${item.img ? `<div class="link-img-wrap" onclick="openModal('${item.img}', '${item.title}')"><img src="${item.img}" class="link-img"></div>` : ''}
                ${item.desc ? `<div class="link-desc">${item.desc}</div>` : ''}
                ${isUnlocked ? `
                <div class="action-btns">
                    <button class="edit-btn" onclick="startEdit(${originalIndex})">編集</button>
                    <button class="delete-btn" onclick="deleteLink(${originalIndex})">削除</button>
                </div>` : ''}
            </div>`;
        });
    }

    function unlockEditor() {
        if(document.getElementById('admin-pass').value === MASTER_PASS) {
            isUnlocked = true;
            document.getElementById('password-area').style.display = 'none';
            document.getElementById('edit-tools').style.display = 'block';
            renderWithSearch();
        } else { alert('パスワードが違います'); }
    }

    function previewFile() {
        const file = document.getElementById('new-img').files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function() {
                // クラウド送信容量制限の超過を防ぐため最大幅500pxに最適化
                const maxW = 500; 
                const canvas = document.createElement('canvas');
                const scaleFactor = Math.min(maxW / img.width, 1);
                canvas.width = img.width * scaleFactor;
                canvas.height = img.height * scaleFactor;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                currentImageData = canvas.toDataURL('image/jpeg', 0.65); // 容量を考慮し画質を65%に調整
                
                const pImg = document.getElementById('form-preview');
                pImg.src = currentImageData;
                pImg.style.display = 'inline-block';
                document.getElementById('del-img-btn').style.display = 'inline-block';
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }

    function clearImageInput() {
        document.getElementById('new-img').value = "";
        const pImg = document.getElementById('form-preview');
        pImg.src = "";
        pImg.style.display = 'none';
        document.getElementById('del-img-btn').style.display = 'none';
        currentImageData = "";
    }

    function startEdit(index) {
        const item = links[index];
        document.getElementById('edit-index').value = index;
        document.getElementById('new-cat').value = item.cat;
        document.getElementById('new-title').value = item.title;
        document.getElementById('new-url').value = item.url || '';
        document.getElementById('new-desc').value = item.desc || '';
        
        if(item.img) {
            currentImageData = item.img;
            const pImg = document.getElementById('form-preview');
            pImg.src = item.img;
            pImg.style.display = 'inline-block';
            document.getElementById('del-img-btn').style.display = 'inline-block';
        } else {
            clearImageInput();
        }
        
        document.getElementById('add-update-btn').innerText = "修正を保存する";
        document.getElementById('cancel-edit-btn').style.display = "block";
        document.getElementById('edit-mode-title').innerText = "リンクを編集";
        showSection('settings', document.getElementById('nav-settings'));
    }

    function resetForm() {
        document.getElementById('edit-index').value = "-1";
        document.getElementById('new-title').value = '';
        document.getElementById('new-url').value = '';
        document.getElementById('new-desc').value = '';
        clearImageInput();
        document.getElementById('add-update-btn').innerText = "リストに追加";
        document.getElementById('cancel-edit-btn').style.display = "none";
        document.getElementById('edit-mode-title').innerText = "同期と管理";
    }

    function addOrUpdateLink() {
        const index = parseInt(document.getElementById('edit-index').value);
        const title = document.getElementById('new-title').value;
        const url = document.getElementById('new-url').value;
        const cat = document.getElementById('new-cat').value;
        const desc = document.getElementById('new-desc').value;

        if(!title) return alert('タイトルを入力してください');
        if(cat !== 'gallery' && !url) return alert('URLを入力してください');
        
        const newItem = { title, url, desc, cat, img: currentImageData };
        
        if (index === -1) { links.push(newItem); alert('追加しました'); }
        else { links[index] = newItem; alert('修正しました'); }
        save();
        resetForm();
    }

    function deleteLink(i) { if(confirm('削除しますか？')) { links.splice(i,1); save(); } }
    function save() { localStorage.setItem('tetsudo_links', JSON.stringify(links)); renderWithSearch(); }

    /* 改良版：クラウド同期（送信）関数 */
    async function exportData() {
        if(GAS_URL.includes("...")) return alert("先に正しいGAS_URLを設定してください");
        document.getElementById('sync-status').innerText = "送信中...";
        try {
            // content-typeを指定せずtext/plainで送りCORS制限を回避
            const response = await fetch(GAS_URL, { 
                method: "POST", 
                body: JSON.stringify(links),
                headers: { "Content-Type": "text/plain" }
            });
            if (response.ok) {
                document.getElementById('sync-status').innerText = "クラウド保存完了！";
            } else {
                document.getElementById('sync-status').innerText = "送信エラーが発生しました";
            }
        } catch (e) { 
            document.getElementById('sync-status').innerText = "通信エラーが発生しました"; 
            console.error(e);
        }
    }

    /* 改良版：クラウド同期（受信）関数 */
    async function importData() {
        if(GAS_URL.includes("...")) return alert("先に正しいGAS_URLを設定してください");
        document.getElementById('sync-status').innerText = "受信中...";
        try {
            // redirect: "follow" を追加してGAS固有の転送エラーを回避
            const res = await fetch(GAS_URL, { 
                method: "GET",
                redirect: "follow"
            });
            if (!res.ok) throw new Error("応答データが異常です");
            
            const data = await res.json();
            if(Array.isArray(data)) {
                links = data;
                save();
                document.getElementById('sync-status').innerText = "クラウドからの読み込みに成功しました！";
            } else {
                document.getElementById('sync-status').innerText = "データ形式が正しくありません";
            }
        } catch (e) { 
            document.getElementById('sync-status').innerText = "読み込みエラーが発生しました"; 
            console.error(e);
        }
    }

    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-target-img');
    const dlLink = document.getElementById('modal-download-link');

    function openModal(imgSrc, title) {
        scale = 1; posX = 0; posY = 0;
        modalImg.src = imgSrc;
        dlLink.href = imgSrc;
        dlLink.download = `${title}.jpg`;
        updateTransform();
        modal.style.display = "block";
    }

    function closeModal() { modal.style.display = "none"; }
    function updateTransform() { modalImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`; }

    modal.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = 0.1;
        if (e.deltaY < 0) { scale = Math.min(scale + zoomFactor, 5); } 
        else { scale = Math.max(scale - zoomFactor, 0.5); }
        updateTransform();
    }, { passive: false });

    const container = document.getElementById('modal-container');
    function getDistance(t1, t2) { return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY); }

    container.addEventListener('mousedown', (e) => {
        if(e.target === modalImg) { isDragging = true; startX = e.clientX - posX; startY = e.clientY - posY; }
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return; posX = e.clientX - startX; posY = e.clientY - startY; updateTransform();
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) { isDragging = true; startX = e.touches[0].clientX - posX; startY = e.touches[0].clientY - posY; } 
        else if (e.touches.length === 2) { isDragging = false; startDist = getDistance(e.touches[0], e.touches[1]); }
    }, { passive: true });
    container.addEventListener('touchmove', (e) => {
        if (isDragging && e.touches.length === 1) { posX = e.touches[0].clientX - startX; posY = e.touches[0].clientY - startY; updateTransform(); } 
        else if (e.touches.length === 2) {
            const dist = getDistance(e.touches[0], e.touches[1]); const factor = dist / startDist; startDist = dist;
            scale = Math.min(Math.max(scale * factor, 0.5), 5); updateTransform();
        }
    }, { passive: true });
    container.addEventListener('touchend', () => { isDragging = false; });

    renderWithSearch();
</script>
</body>
</html>
