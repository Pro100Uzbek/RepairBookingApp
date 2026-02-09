// debug.js - исправленная версия
const DebugHelper = {
    logFormState: function() {
        console.group('🔍 СОСТОЯНИЕ ФОРМЫ');
        
        // Все поля формы
        const form = document.getElementById('orderForm');
        if (form) {
            const elements = form.elements;
            console.log('📋 Поля формы:');
            
            for (let i = 0; i < elements.length; i++) {
                const el = elements[i];
                if (el.name) {
                    console.log(`  ${el.name}:`, {
                        type: el.type,
                        value: el.value,
                        required: el.required,
                        valid: el.checkValidity(),
                        placeholder: el.placeholder,
                        className: el.className
                    });
                }
            }
        }
        
        // Файлы
        const fileInput = document.getElementById('photo');
        if (fileInput) {
            console.log('📁 Файлы:', fileInput.files.length);
        }
        
        // Состояние превью
        const previewContainer = document.getElementById('preview-container');
        if (previewContainer) {
            console.log('🖼️ Превью элементов:', previewContainer.children.length);
        }
        
        // Категории
        const category = document.getElementById('type-category');
        const subcategory = document.getElementById('subcategory-select');
        if (category) {
            console.log('📂 Категория:', category.value);
        }
        if (subcategory) {
            console.log('📂 Подкатегория:', subcategory.value);
        }
        
        console.groupEnd();
    },
    
    logSystemInfo: function() {
        console.group('🖥️ СИСТЕМНАЯ ИНФОРМАЦИЯ');
        console.log('Время:', new Date().toISOString());
        console.log('URL:', window.location.href);
        console.log('User Agent:', navigator.userAgent);
        console.log('Экран:', `${window.innerWidth}x${window.innerHeight}`);
        console.log('Язык:', window.currentLang || 'не установлен');
        console.log('Локальное хранилище:', localStorage.length ? 'доступно' : 'недоступно');
        console.groupEnd();
    },
    
    checkForDuplicates: function() {
        console.group('🔍 ПРОВЕРКА НА ДУБЛИКАТЫ');
        
        // Проверяем превью файлов
        const previewContainer = document.getElementById('preview-container');
        if (previewContainer) {
            const previews = previewContainer.querySelectorAll('.preview-item');
            const fileIds = new Set();
            let duplicateCount = 0;
            
            previews.forEach((preview, index) => {
                const fileId = preview.dataset.fileId;
                if (fileIds.has(fileId)) {
                    console.warn(`⚠️ Дубликат превью #${index}:`, fileId);
                    preview.classList.add('duplicate');
                    duplicateCount++;
                } else {
                    fileIds.add(fileId);
                    preview.classList.remove('duplicate');
                }
            });
            
            console.log(`Превью: всего ${previews.length}, дубликатов: ${duplicateCount}`);
        }
        
        console.groupEnd();
    },

    // В debug.js добавляем:
    logFileStatus: function() {
        console.group('📁 СТАТУС ФАЙЛОВ');
        
        const fileInput = document.getElementById('photo');
        const container = document.getElementById('preview-container');
        
        if (fileInput) {
            console.log('Поле ввода файлов:');
            console.log(`  Всего файлов: ${fileInput.files.length}`);
            console.log(`  Значение value: "${fileInput.value}"`);
            
            if (fileInput.files.length > 0) {
                Array.from(fileInput.files).forEach((file, index) => {
                    console.log(`  ${index + 1}. ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
                });
            }
        } else {
            console.log('❌ Поле ввода файлов не найдено');
        }
        
        if (container) {
            console.log(`Превью элементов: ${container.children.length}`);
            container.querySelectorAll('.preview-item').forEach((item, index) => {
                console.log(`  Превью ${index + 1}:`, {
                    fileId: item.dataset.fileId,
                    fileIndex: item.dataset.fileIndex
                });
            });
        }
        
        if (typeof FileManager !== 'undefined') {
            console.log('FileManager:');
            console.log(`  Файлов в массиве: ${FileManager.selectedFiles.length}`);
            console.log(`  Обрабатывается: ${FileManager.isProcessing ? 'да' : 'нет'}`);
        }
        
        console.groupEnd();
    }
};

// Автологирование при отправке формы
// В debug.js обновляем:
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('orderForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            console.log('=== 🚀 ОТПРАВКА ФОРМЫ ===');
            DebugHelper.logSystemInfo();
            DebugHelper.logFormState();
            DebugHelper.logFileStatus(); // Добавляем логирование статуса файлов
            DebugHelper.checkForDuplicates();
        });
    }
});

window.DebugHelper = DebugHelper;