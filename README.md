<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>tetsudo-site</title>
    <!-- 外部CSSファイルを読み込み -->
    <link rel="stylesheet" href="style.css">
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

<!-- 外部JSファイルを読み込み -->
<script src="apps.js"></script>
</body>
</html>
