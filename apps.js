// ⚠️ 以下のURLをご自身のGASウェブアプリURL（末尾が/execのもの）に書き換えてください
const GAS_URL = "https://google.com";
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

// GAS連携：送信（POST）関数
async function exportData() {
    document.getElementById('sync-status').innerText = "送信中...";
    try {
        const response = await fetch(GAS_URL, { 
            method: "POST", 
            mode: "cors",
            redirect: "follow",
            headers: { "Content-Type": "text/plain" }, 
            body: JSON.stringify(links) 
        });
        
        if (!response.ok) throw new Error("Network error");
        document.getElementById('sync-status').innerText = "クラウド保存完了！";
    } catch (e) { 
        console.error(e);
        document.getElementById('sync-status').innerText = "送信エラーが発生しました"; 
    }
}

// GAS連携：受信（GET）関数
async function importData() {
    document.getElementById('sync-status').innerText = "受信中...";
    try {
        const res = await fetch(GAS_URL, {
            method: "GET",
            mode: "cors",
            redirect: "follow"
        });
        
        if (!res.ok) throw new Error("Network error");
        links = await res.json();
        save();
        document.getElementById('sync-status').innerText = "同期完了しました！";
    } catch (e) { 
        console.error(e);
        document.getElementById('sync-status').innerText = "受信エラーが発生しました"; 
    }
}

// 起動時にデータを読み込んで表示
renderWithSearch();
