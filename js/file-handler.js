/**   
 * Модуль для работы с файлами и превью
 */
// file-handler.js - полностью переписанная версия
// file-handler.js - полностью переписанная версия
// file-handler.js - исправленная версия
// file-handler.js - исправленная версия
const FileManager = {
    maxFiles: 3,
    maxFileSize: 15 * 1024 * 1024,
    selectedFiles: [],
    isProcessing: false,

    // Обработка выбора файлов
    handleFiles: function(input) {
        // Проверяем, что это именно изменение файлов
        if (!input || !input.files) {
            console.warn('⚠️ FileManager: нет файлов для обработки');
            return;
        }

        // Проверяем, не обрабатываем ли мы уже файлы
        if (this.isProcessing) {
            console.warn('⚠️ FileManager: уже обрабатывает файлы, пропускаем');
            return;
        }

        const files = Array.from(input.files);
        console.log(`📁 Получено файлов из input: ${files.length}`);

        // Если нет файлов, выходим
        if (files.length === 0) {
            console.log('📁 Нет файлов для обработки');
            return;
        }

        this.isProcessing = true;
        
        try {
            const container = document.getElementById('preview-container');
            
            // 1. Проверка на количество (учитываем уже добавленные файлы)
            if ((this.selectedFiles.length + files.length) > this.maxFiles) {
                let message = `Можно выбрать не более ${this.maxFiles} файлов`;
                
                if (window.getTranslation) {
                    const translation = window.getTranslation('files.maxFiles', window.currentLang);
                    if (translation !== 'files.maxFiles') {
                        message = translation.replace('{max}', this.maxFiles);
                    }
                }
                
                alert(message);
                input.value = "";
                this.isProcessing = false;
                return;
            }

            // Проверяем все файлы перед добавлением
            const validFiles = [];
            const invalidFiles = [];
            const duplicateFiles = [];
            
            files.forEach(file => {
                // Проверка размера
                if (file.size > this.maxFileSize) {
                    invalidFiles.push(file);
                    return;
                }
                
                // ПРОВЕРКА НА ДУБЛИРОВАНИЕ ПО ИМЕНИ И РАЗМЕРУ
                const isDuplicate = this.selectedFiles.some(existingFile => {
                    // Сравниваем имя файла и размер
                    const isSameName = existingFile.name === file.name;
                    const isSameSize = existingFile.size === file.size;
                    
                    // Дополнительная проверка на тип и последнее изменение
                    const isSameType = existingFile.type === file.type;
                    const isSameLastModified = existingFile.lastModified === file.lastModified;
                    
                    // Если совпадает имя И размер - это дубликат
                    return isSameName && isSameSize;
                });
                
                if (isDuplicate) {
                    duplicateFiles.push(file);
                    console.warn(`⚠️ Файл "${file.name}" (${(file.size/1024).toFixed(2)} KB) уже добавлен, пропускаем`);
                } else {
                    // Также проверяем на дублирование среди новых файлов
                    const isDuplicateInNew = validFiles.some(newFile => 
                        newFile.name === file.name && newFile.size === file.size
                    );
                    
                    if (isDuplicateInNew) {
                        duplicateFiles.push(file);
                        console.warn(`⚠️ Файл "${file.name}" дублируется в текущем выборе, пропускаем`);
                    } else {
                        validFiles.push(file);
                    }
                }
            });

            // Показываем предупреждение о дубликатах (но не блокируем)
            if (duplicateFiles.length > 0) {
                console.log(`⚠️ Найдено ${duplicateFiles.length} дубликатов файлов, они были проигнорированы`);
                
                if (duplicateFiles.length === files.length) {
                    // Если все файлы - дубликаты
                    console.log('📁 Все файлы уже добавлены ранее');
                    input.value = "";
                    this.isProcessing = false;
                    return;
                }
            }

            // Показываем ошибки для невалидных файлов
            if (invalidFiles.length > 0) {
                invalidFiles.forEach(file => {
                    let message = `Файл ${file.name} слишком большой (макс. 15МБ)`;
                    
                    if (window.getTranslation) {
                        const translation = window.getTranslation('files.maxSize', window.currentLang);
                        if (translation !== 'files.maxSize') {
                            const maxSizeMB = this.maxFileSize / (1024 * 1024);
                            message = translation
                                .replace('{name}', file.name)
                                .replace('{size}', maxSizeMB);
                        }
                    }
                    
                    alert(message);
                });
            }

            // Если нет валидных файлов
            if (validFiles.length === 0) {
                input.value = "";
                this.isProcessing = false;
                return;
            }

            // Добавляем только уникальные валидные файлы
            validFiles.forEach(file => {
                this.selectedFiles.push(file);
                console.log(`➕ Добавлен файл: ${file.name} (${(file.size/1024).toFixed(2)} KB)`);
            });

            // Обновляем поле ввода файлов ДО создания превью
            this.updateFileInput();

            // Очищаем контейнер и перерисовываем ВСЕ файлы
            if (container) {
                container.innerHTML = "";
            }

            // Создаем промисы для загрузки превью
            const previewPromises = this.selectedFiles.map((file, index) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                        const previewItem = document.createElement('div');
                        previewItem.className = 'preview-item';
                        previewItem.dataset.fileId = `file-${Date.now()}-${index}-${file.name.replace(/\s+/g, '-')}`;
                        previewItem.dataset.fileIndex = index;
                        
                        if (file.type.startsWith('image/')) {
                            previewItem.innerHTML = `<img src="${e.target.result}" alt="preview" loading="lazy">`;
                        } else if (file.type.startsWith('video/')) {
                            previewItem.innerHTML = `
                                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                                    <span class="material-symbols-outlined" style="font-size: 40px; color: var(--text-tertiary);">videocam</span>
                                    <div style="font-size: 12px; color: var(--text-tertiary); margin-top: 8px; text-align: center; padding: 0 8px;">
                                        ${file.name.substring(0, 20)}${file.name.length > 20 ? '...' : ''}
                                    </div>
                                </div>
                            `;
                        }
                        
                        // Кнопка удаления
                        const removeBtn = document.createElement('div');
                        removeBtn.className = 'remove-file';
                        removeBtn.innerHTML = '&times;';
                        removeBtn.dataset.fileIndex = index;
                        removeBtn.title = `Удалить ${file.name}`;
                        
                        removeBtn.onclick = (e) => {
                            e.stopPropagation();
                            const idx = parseInt(e.target.dataset.fileIndex);
                            this.removeFile(idx);
                        };
                        
                        previewItem.appendChild(removeBtn);
                        if (container) {
                            container.appendChild(previewItem);
                        }
                        
                        resolve(previewItem);
                    };
                    
                    reader.onerror = (error) => {
                        console.error(`❌ Ошибка загрузки файла: ${file.name}`, error);
                        reject(error);
                    };
                    
                    reader.readAsDataURL(file);
                });
            });

            // Ждем завершения всех промисов
            Promise.allSettled(previewPromises)
                .then(results => {
                    const successful = results.filter(r => r.status === 'fulfilled').length;
                    console.log(`✅ Создано превью: ${successful} из ${previewPromises.length}`);
                })
                .finally(() => {
                    console.log(`✅ Всего файлов в массиве: ${this.selectedFiles.length}`);
                    console.log(`📁 Файлов в поле ввода: ${input.files.length}`);
                    
                    // Логируем итоговый список файлов
                    console.log('📁 Итоговый список файлов:');
                    this.selectedFiles.forEach((file, index) => {
                        console.log(`  ${index + 1}. ${file.name} (${(file.size / 1024).toFixed(2)} KB, ${file.type})`);
                    });
                    
                    this.isProcessing = false;
                });

        } catch (error) {
            console.error('❌ FileManager.handleFiles ошибка:', error);
            this.isProcessing = false;
        }
    },

    // ВАЖНО: Метод для обновления поля ввода файлов
    updateFileInput: function() {
        const fileInput = document.getElementById('photo');
        if (!fileInput) {
            console.error('❌ Поле ввода файлов не найдено');
            return;
        }
        
        // Создаем новый DataTransfer и добавляем все файлы
        const dataTransfer = new DataTransfer();
        this.selectedFiles.forEach(file => {
            dataTransfer.items.add(file);
        });
        
        // Обновляем файлы в поле ввода
        fileInput.files = dataTransfer.files;
        
        console.log(`🔄 Обновлено поле ввода: ${fileInput.files.length} файлов`);
    },

    removeFile: function(index) {
        console.log(`🗑️ Удаление файла с индексом: ${index}`);
        
        if (index < 0 || index >= this.selectedFiles.length) {
            console.error('❌ Неверный индекс файла:', index);
            return;
        }
        
        // Удаляем файл из массива
        const removedFile = this.selectedFiles.splice(index, 1)[0];
        console.log(`🗑️ Удален файл: ${removedFile.name} (${(removedFile.size/1024).toFixed(2)} KB)`);
        
        const container = document.getElementById('preview-container');
        
        // Сразу обновляем поле ввода
        this.updateFileInput();
        
        // Очищаем контейнер
        if (container) {
            container.innerHTML = "";
        }
        
        // Перерисовываем оставшиеся файлы
        this.selectedFiles.forEach((file, newIndex) => {
            if (!container) return;
            
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.dataset.fileId = `file-${Date.now()}-${newIndex}-${file.name.replace(/\s+/g, '-')}`;
                previewItem.dataset.fileIndex = newIndex;
                
                if (file.type.startsWith('image/')) {
                    previewItem.innerHTML = `<img src="${e.target.result}" alt="preview">`;
                } else if (file.type.startsWith('video/')) {
                    previewItem.innerHTML = `
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%;">
                            <span class="material-symbols-outlined" style="font-size: 40px; color: var(--text-tertiary);">videocam</span>
                            <div style="font-size: 12px; color: var(--text-tertiary); margin-top: 8px; text-align: center; padding: 0 8px;">
                                ${file.name.substring(0, 20)}${file.name.length > 20 ? '...' : ''}
                            </div>
                        </div>
                    `;
                }
                
                const removeBtn = document.createElement('div');
                removeBtn.className = 'remove-file';
                removeBtn.innerHTML = '&times;';
                removeBtn.dataset.fileIndex = newIndex;
                removeBtn.title = `Удалить ${file.name}`;
                
                removeBtn.onclick = (event) => {
                    event.stopPropagation();
                    const idx = parseInt(event.target.dataset.fileIndex);
                    this.removeFile(idx);
                };
                
                previewItem.appendChild(removeBtn);
                container.appendChild(previewItem);
            };
            
            reader.readAsDataURL(file);
        });
        
        console.log(`🗑️ После удаления: ${this.selectedFiles.length} файлов`);
        console.log(`🖼️ Элементов превью: ${container ? container.children.length : 0}`);
    },

    // Метод для получения всех выбранных файлов
    getAllFiles: function() {
        return this.selectedFiles;
    },

    // Метод для очистки всех файлов
    clearAllFiles: function() {
        this.selectedFiles = [];
        
        const container = document.getElementById('preview-container');
        
        if (container) container.innerHTML = "";
        
        // Используем новый метод для сброса
        this.resetFileInput();
        
        console.log('🧹 Все файлы очищены');
    },

    // Метод для проверки состояния
    logStatus: function() {
        const fileInput = document.getElementById('photo');
        const container = document.getElementById('preview-container');
        
        console.log('📊 СТАТУС FileManager:');
        console.log(`  Файлов в массиве: ${this.selectedFiles.length}`);
        console.log(`  Файлов в поле ввода: ${fileInput ? fileInput.files.length : 'поле не найдено'}`);
        console.log(`  Превью в контейнере: ${container ? container.children.length : 'контейнер не найден'}`);
        
        this.selectedFiles.forEach((file, index) => {
            console.log(`  ${index + 1}. ${file.name} (${file.type}, ${(file.size / 1024).toFixed(2)} KB)`);
        });
    },

    // Сброс поля ввода файлов
    resetFileInput: function() {
        const fileInput = document.getElementById('photo');
        if (fileInput) {
            // Полностью сбрасываем поле ввода
            fileInput.value = "";
            
            // Также сбрасываем через DataTransfer для надежности
            const dataTransfer = new DataTransfer();
            fileInput.files = dataTransfer.files;
            
            console.log('🔄 Поле ввода файлов сброшено');
        }
    }
};

window.FileManager = FileManager;