// 提示詞筆記本管理器 - 主程式

class PromptManager {
    constructor() {
        this.prompts = [];
        this.categories = [];
        this.currentCategory = 'all';
        this.editingPromptId = null;
        this.deleteCallback = null;

        this.init();
    }

    init() {
        // 載入資料
        this.loadData();

        // 如果沒有分類，創建預設分類
        if (this.categories.length === 0) {
            this.createDefaultCategories();
        }

        // 綁定事件
        this.bindEvents();

        // 渲染介面
        this.render();
    }

    // 創建預設分類
    createDefaultCategories() {
        const defaultCategories = [
            { id: 'cat-1', name: '角色扮演', icon: '🎭', count: 0 },
            { id: 'cat-2', name: '圖像生成', icon: '🎨', count: 0 },
            { id: 'cat-3', name: '影片生成', icon: '🎬', count: 0 },
            { id: 'cat-4', name: '系統提示詞', icon: '⚙️', count: 0 },
            { id: 'cat-5', name: '創意寫作', icon: '✍️', count: 0 },
            { id: 'cat-6', name: '程式開發', icon: '💻', count: 0 }
        ];
        this.categories = defaultCategories;
        this.createDefaultPrompts();
        this.saveData();
    }

    // 創建預設提示詞範例
    createDefaultPrompts() {
        const defaultPrompts = [
            {
                id: 'prompt-sora2',
                title: 'Sora 2 - 影片生成提示詞',
                categoryId: 'cat-3',
                content: `創建一個高品質的影片場景，需要包含以下元素：

1. 場景描述：[詳細描述場景環境、時間、地點]
2. 主體動作：[描述主要物體或人物的動作]
3. 鏡頭運動：[例如：推軌、拉遠、環繞等]
4. 光線氛圍：[描述光線效果和整體氛圍]
5. 風格參考：[電影風格、藝術風格等]

範例：
一個寧靜的日出場景，鏡頭緩緩推進一座被晨霧籠罩的山頂。金色的陽光穿過雲層，照亮了山谷中的小村莊。鏡頭以電影般的流暢度環繞，展現出壯麗的全景。整體呈現溫暖、寧靜的氛圍，參考威斯·安德森的對稱構圖風格。`,
                notes: '使用 Sora 2 時，越詳細的場景描述能獲得越好的效果。注意描述鏡頭運動和光線效果可以大幅提升影片質量。',
                tags: ['Sora 2', '影片生成', 'AI 影片', '場景描述'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'prompt-veo3',
                title: 'Gemini Veo 3.1 - 影片生成提示詞',
                categoryId: 'cat-3',
                content: `生成影片指令格式：

主題：[影片主題]
時長：[期望的影片長度]
風格：[視覺風格]
內容：[詳細內容描述]

範例：
主題：產品展示影片
時長：15 秒
風格：現代、簡約、專業
內容：一支智慧型手機從黑色背景中旋轉出現，螢幕亮起展示介面，鏡頭特寫手機的細節，最後以品牌 logo 結束。整體採用深色調配合藍色科技光效，營造高端科技感。`,
                notes: 'Veo 3.1 擅長生成結構化的內容，建議使用清晰的格式化指令。適合商業用途的短影片製作。',
                tags: ['Gemini Veo 3.1', '影片生成', 'AI 影片', '商業影片'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'prompt-grok',
                title: 'Grok - 影片生成提示詞',
                categoryId: 'cat-3',
                content: `影片生成提示：

[用簡潔直接的語言描述你想要的影片內容]

特點：
- 強調動態元素和動作
- 明確指出關鍵視覺效果
- 說明情緒或氛圍

範例 1：
一隻貓咪在鍵盤上打字，牠認真的表情配上快速的爪子動作，周圍飄散著代碼符號的視覺效果，營造出「駭客貓」的幽默氛圍。

範例 2：
城市夜景的縮時攝影，車流如光河般流動，高樓大廈的燈光閃爍，鏡頭從地面升起至俯瞰整座城市，展現現代都市的繁華與活力。`,
                notes: 'Grok 適合簡潔直接的描述風格。善用動作描述和視覺效果關鍵字可以獲得更生動的結果。',
                tags: ['Grok', '影片生成', 'AI 影片', '創意影片'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        this.prompts = defaultPrompts;
    }

    // 載入資料
    loadData() {
        const savedPrompts = localStorage.getItem('prompts');
        const savedCategories = localStorage.getItem('categories');

        if (savedPrompts) {
            this.prompts = JSON.parse(savedPrompts);
        }

        if (savedCategories) {
            this.categories = JSON.parse(savedCategories);
        }

        this.updateCategoryCounts();
    }

    // 儲存資料
    saveData() {
        localStorage.setItem('prompts', JSON.stringify(this.prompts));
        localStorage.setItem('categories', JSON.stringify(this.categories));
    }

    // 更新分類計數
    updateCategoryCounts() {
        this.categories.forEach(cat => {
            cat.count = this.prompts.filter(p => p.categoryId === cat.id).length;
        });
    }

    // 綁定事件
    bindEvents() {
        // 新增提示詞按鈕
        document.getElementById('addPromptBtn').addEventListener('click', () => {
            this.openPromptModal();
        });

        // 新增分類按鈕
        document.getElementById('addCategoryBtn').addEventListener('click', () => {
            this.openCategoryModal();
        });

        // 關閉 Modal 按鈕
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            this.closePromptModal();
        });

        document.getElementById('closeCategoryModalBtn').addEventListener('click', () => {
            this.closeCategoryModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closePromptModal();
        });

        document.getElementById('cancelCategoryBtn').addEventListener('click', () => {
            this.closeCategoryModal();
        });

        document.getElementById('cancelConfirmBtn').addEventListener('click', () => {
            this.closeConfirmModal();
        });

        // 表單提交
        document.getElementById('promptForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePrompt();
        });

        document.getElementById('categoryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCategory();
        });

        // 搜尋輸入
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterPrompts(e.target.value);
        });

        // 字數統計
        document.getElementById('promptContent').addEventListener('input', (e) => {
            document.getElementById('charCount').textContent = e.target.value.length;
        });

        // 點擊 Modal 外部關閉
        document.getElementById('promptModal').addEventListener('click', (e) => {
            if (e.target.id === 'promptModal') {
                this.closePromptModal();
            }
        });

        document.getElementById('categoryModal').addEventListener('click', (e) => {
            if (e.target.id === 'categoryModal') {
                this.closeCategoryModal();
            }
        });

        document.getElementById('confirmModal').addEventListener('click', (e) => {
            if (e.target.id === 'confirmModal') {
                this.closeConfirmModal();
            }
        });
    }

    // 渲染介面
    render() {
        this.renderCategories();
        this.renderPrompts();
        this.updateStats();
    }

    // 渲染分類列表
    renderCategories() {
        const categoryList = document.getElementById('categoryList');
        const categorySelect = document.getElementById('promptCategory');

        // 渲染側邊欄分類
        let html = `
            <div class="category-item ${this.currentCategory === 'all' ? 'active' : ''}" data-category="all">
                <div class="category-info">
                    <span class="category-icon">📚</span>
                    <span class="category-name">全部</span>
                </div>
                <span class="category-count">${this.prompts.length}</span>
            </div>
        `;

        this.categories.forEach(cat => {
            html += `
                <div class="category-item ${this.currentCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
                    <div class="category-info">
                        <span class="category-icon">${cat.icon}</span>
                        <span class="category-name">${cat.name}</span>
                    </div>
                    <span class="category-count">${cat.count}</span>
                    <div class="category-actions">
                        <button class="btn-icon-small" onclick="promptManager.deleteCategory('${cat.id}')" title="刪除">🗑️</button>
                    </div>
                </div>
            `;
        });

        categoryList.innerHTML = html;

        // 綁定分類點擊事件
        categoryList.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn-icon-small')) {
                    this.selectCategory(item.dataset.category);
                }
            });
        });

        // 渲染下拉選單
        let selectHtml = '';
        this.categories.forEach(cat => {
            selectHtml += `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`;
        });
        categorySelect.innerHTML = selectHtml;
    }

    // 渲染提示詞列表
    renderPrompts() {
        const promptList = document.getElementById('promptList');
        const emptyState = document.getElementById('emptyState');

        let filteredPrompts = this.prompts;

        // 根據選擇的分類篩選
        if (this.currentCategory !== 'all') {
            filteredPrompts = this.prompts.filter(p => p.categoryId === this.currentCategory);
        }

        if (filteredPrompts.length === 0) {
            promptList.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');

        let html = '';
        filteredPrompts.forEach(prompt => {
            const category = this.categories.find(c => c.id === prompt.categoryId);
            const categoryName = category ? category.name : '未分類';
            const categoryIcon = category ? category.icon : '📝';

            html += `
                <div class="prompt-card" data-id="${prompt.id}">
                    <div class="prompt-header">
                        <div>
                            <h3 class="prompt-title">${this.escapeHtml(prompt.title)}</h3>
                            <div class="prompt-meta">
                                <span>${categoryIcon} ${categoryName}</span>
                                <span>📅 ${this.formatDate(prompt.createdAt)}</span>
                                <span>📊 ${prompt.content.length} 字</span>
                            </div>
                        </div>
                    </div>
                    <div class="prompt-content">${this.escapeHtml(prompt.content)}</div>
                    ${prompt.notes ? `<div class="prompt-notes">💡 ${this.escapeHtml(prompt.notes)}</div>` : ''}
                    ${prompt.tags.length > 0 ? `
                        <div class="prompt-tags">
                            ${prompt.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="prompt-actions">
                        <button class="btn-small copy" onclick="promptManager.copyPrompt('${prompt.id}')">📋 複製</button>
                        <button class="btn-small" onclick="promptManager.editPrompt('${prompt.id}')">✏️ 編輯</button>
                        <button class="btn-small" onclick="promptManager.confirmDeletePrompt('${prompt.id}')">🗑️ 刪除</button>
                    </div>
                </div>
            `;
        });

        promptList.innerHTML = html;
    }

    // 篩選提示詞
    filterPrompts(searchTerm) {
        const promptList = document.getElementById('promptList');
        const emptyState = document.getElementById('emptyState');

        let filteredPrompts = this.prompts;

        // 根據選擇的分類篩選
        if (this.currentCategory !== 'all') {
            filteredPrompts = filteredPrompts.filter(p => p.categoryId === this.currentCategory);
        }

        // 根據搜尋詞篩選
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredPrompts = filteredPrompts.filter(p =>
                p.title.toLowerCase().includes(term) ||
                p.content.toLowerCase().includes(term) ||
                p.notes.toLowerCase().includes(term) ||
                p.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }

        if (filteredPrompts.length === 0) {
            promptList.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');

        let html = '';
        filteredPrompts.forEach(prompt => {
            const category = this.categories.find(c => c.id === prompt.categoryId);
            const categoryName = category ? category.name : '未分類';
            const categoryIcon = category ? category.icon : '📝';

            html += `
                <div class="prompt-card" data-id="${prompt.id}">
                    <div class="prompt-header">
                        <div>
                            <h3 class="prompt-title">${this.escapeHtml(prompt.title)}</h3>
                            <div class="prompt-meta">
                                <span>${categoryIcon} ${categoryName}</span>
                                <span>📅 ${this.formatDate(prompt.createdAt)}</span>
                                <span>📊 ${prompt.content.length} 字</span>
                            </div>
                        </div>
                    </div>
                    <div class="prompt-content">${this.escapeHtml(prompt.content)}</div>
                    ${prompt.notes ? `<div class="prompt-notes">💡 ${this.escapeHtml(prompt.notes)}</div>` : ''}
                    ${prompt.tags.length > 0 ? `
                        <div class="prompt-tags">
                            ${prompt.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="prompt-actions">
                        <button class="btn-small copy" onclick="promptManager.copyPrompt('${prompt.id}')">📋 複製</button>
                        <button class="btn-small" onclick="promptManager.editPrompt('${prompt.id}')">✏️ 編輯</button>
                        <button class="btn-small" onclick="promptManager.confirmDeletePrompt('${prompt.id}')">🗑️ 刪除</button>
                    </div>
                </div>
            `;
        });

        promptList.innerHTML = html;
    }

    // 選擇分類
    selectCategory(categoryId) {
        this.currentCategory = categoryId;
        document.getElementById('searchInput').value = '';
        this.render();
    }

    // 更新統計
    updateStats() {
        document.getElementById('totalPrompts').textContent = this.prompts.length;
    }

    // 開啟提示詞 Modal
    openPromptModal(promptId = null) {
        this.editingPromptId = promptId;
        const modal = document.getElementById('promptModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('promptForm');

        if (promptId) {
            // 編輯模式
            const prompt = this.prompts.find(p => p.id === promptId);
            modalTitle.textContent = '編輯提示詞';
            document.getElementById('promptTitle').value = prompt.title;
            document.getElementById('promptCategory').value = prompt.categoryId;
            document.getElementById('promptContent').value = prompt.content;
            document.getElementById('promptNotes').value = prompt.notes;
            document.getElementById('promptTags').value = prompt.tags.join(', ');
            document.getElementById('charCount').textContent = prompt.content.length;
        } else {
            // 新增模式
            modalTitle.textContent = '新增提示詞';
            form.reset();
            document.getElementById('charCount').textContent = '0';

            // 如果選擇了特定分類，預設選擇該分類
            if (this.currentCategory !== 'all') {
                document.getElementById('promptCategory').value = this.currentCategory;
            }
        }

        modal.classList.add('show');
        document.getElementById('promptTitle').focus();
    }

    // 關閉提示詞 Modal
    closePromptModal() {
        document.getElementById('promptModal').classList.remove('show');
        this.editingPromptId = null;
    }

    // 儲存提示詞
    savePrompt() {
        const title = document.getElementById('promptTitle').value.trim();
        const categoryId = document.getElementById('promptCategory').value;
        const content = document.getElementById('promptContent').value.trim();
        const notes = document.getElementById('promptNotes').value.trim();
        const tagsInput = document.getElementById('promptTags').value.trim();
        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

        if (this.editingPromptId) {
            // 更新現有提示詞
            const prompt = this.prompts.find(p => p.id === this.editingPromptId);
            prompt.title = title;
            prompt.categoryId = categoryId;
            prompt.content = content;
            prompt.notes = notes;
            prompt.tags = tags;
            prompt.updatedAt = new Date().toISOString();

            this.showToast('✅ 提示詞已更新');
        } else {
            // 新增提示詞
            const newPrompt = {
                id: 'prompt-' + Date.now(),
                title,
                categoryId,
                content,
                notes,
                tags,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.prompts.unshift(newPrompt);
            this.showToast('✅ 提示詞已新增');
        }

        this.updateCategoryCounts();
        this.saveData();
        this.closePromptModal();
        this.render();
    }

    // 編輯提示詞
    editPrompt(promptId) {
        this.openPromptModal(promptId);
    }

    // 確認刪除提示詞
    confirmDeletePrompt(promptId) {
        this.deleteCallback = () => this.deletePrompt(promptId);
        this.openConfirmModal('確定要刪除這個提示詞嗎？此操作無法復原。');
    }

    // 刪除提示詞
    deletePrompt(promptId) {
        this.prompts = this.prompts.filter(p => p.id !== promptId);
        this.updateCategoryCounts();
        this.saveData();
        this.closeConfirmModal();
        this.render();
        this.showToast('🗑️ 提示詞已刪除');
    }

    // 複製提示詞
    async copyPrompt(promptId) {
        const prompt = this.prompts.find(p => p.id === promptId);

        try {
            await navigator.clipboard.writeText(prompt.content);
            this.showToast('📋 已複製到剪貼簿');
        } catch (err) {
            // 舊版瀏覽器回退方案
            const textArea = document.createElement('textarea');
            textArea.value = prompt.content;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                this.showToast('📋 已複製到剪貼簿');
            } catch (err) {
                this.showToast('❌ 複製失敗');
            }

            document.body.removeChild(textArea);
        }
    }

    // 開啟分類 Modal
    openCategoryModal() {
        const modal = document.getElementById('categoryModal');
        document.getElementById('categoryForm').reset();
        modal.classList.add('show');
        document.getElementById('categoryName').focus();
    }

    // 關閉分類 Modal
    closeCategoryModal() {
        document.getElementById('categoryModal').classList.remove('show');
    }

    // 儲存分類
    saveCategory() {
        const name = document.getElementById('categoryName').value.trim();
        const icon = document.getElementById('categoryIcon').value.trim() || '📝';

        const newCategory = {
            id: 'cat-' + Date.now(),
            name,
            icon,
            count: 0
        };

        this.categories.push(newCategory);
        this.saveData();
        this.closeCategoryModal();
        this.render();
        this.showToast('✅ 分類已新增');
    }

    // 刪除分類
    deleteCategory(categoryId) {
        // 檢查是否有提示詞使用此分類
        const hasPrompts = this.prompts.some(p => p.categoryId === categoryId);

        if (hasPrompts) {
            this.showToast('❌ 無法刪除：此分類下還有提示詞');
            return;
        }

        this.deleteCallback = () => {
            this.categories = this.categories.filter(c => c.id !== categoryId);
            this.saveData();
            this.closeConfirmModal();

            // 如果刪除的是當前選中的分類，切換到全部
            if (this.currentCategory === categoryId) {
                this.currentCategory = 'all';
            }

            this.render();
            this.showToast('🗑️ 分類已刪除');
        };

        this.openConfirmModal('確定要刪除這個分類嗎？');
    }

    // 開啟確認 Modal
    openConfirmModal(message) {
        const modal = document.getElementById('confirmModal');
        document.getElementById('confirmMessage').textContent = message;
        modal.classList.add('show');

        // 綁定確認按鈕
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        newConfirmBtn.addEventListener('click', () => {
            if (this.deleteCallback) {
                this.deleteCallback();
                this.deleteCallback = null;
            }
        });
    }

    // 關閉確認 Modal
    closeConfirmModal() {
        document.getElementById('confirmModal').classList.remove('show');
        this.deleteCallback = null;
    }

    // 顯示 Toast 通知
    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return '今天';
        } else if (days === 1) {
            return '昨天';
        } else if (days < 7) {
            return `${days} 天前`;
        } else {
            return date.toLocaleDateString('zh-TW');
        }
    }

    // HTML 轉義
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化應用程式
let promptManager;
document.addEventListener('DOMContentLoaded', () => {
    promptManager = new PromptManager();
});
