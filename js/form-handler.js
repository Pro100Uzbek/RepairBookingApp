// form-handler.js
const scriptURL = 'https://script.google.com/macros/s/AKfycbzcSr5H9IEEufkHi3HH4Y12e5b5jsxI_jWda6oqKYVWVrskiIyQ3KTa3BYv_63tdoGg_A/exec';

const FormHandler = {
    init: function() {
        const form = document.getElementById('orderForm');
        if (form) {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
        this.initModalHandlers();
    },

    initModalHandlers: function() {
        const cancelBtn = document.querySelector('#confirmModal .btn-secondary');
        if (cancelBtn) cancelBtn.addEventListener('click', this.closeModal.bind(this));
        
        const confirmBtn = document.querySelector('#confirmModal .btn-primary');
        if (confirmBtn) confirmBtn.addEventListener('click', this.finalSend.bind(this));
        
        const statusOkBtn = document.querySelector('#statusModal .btn-primary');
        if (statusOkBtn) statusOkBtn.addEventListener('click', this.closeStatusModal.bind(this));
    },

    handleFormSubmit: function(e) {
        e.preventDefault();
        if (window.FileManager) FileManager.updateFileInput();
        if (window.validateFormWithTranslations && !window.validateFormWithTranslations()) return;
        this.prepareConfirmationModal();
    },

    // 1. ИСПРАВЛЕНО: Теперь пользователь видит ВСЕ данные
    prepareConfirmationModal: function() {
        const getVal = (id) => document.getElementById(id)?.value || '—';
        const getSelectText = (id) => {
            const el = document.getElementById(id);
            return el?.options[el.selectedIndex]?.text || '—';
        };

        let displayPhone = getVal('phone');
        if (window.iti) displayPhone = window.iti.getNumber();

        const summaryElement = document.getElementById('summary');
        if (summaryElement) {
            summaryElement.innerHTML = `
                <div style="display: grid; gap: 10px; font-size: 14px; line-height: 1.4;">
                    <div><strong>Имя:</strong> ${getVal('name')}</div>
                    <div><strong>Телефон:</strong> ${displayPhone}</div>
                    <div><strong>Город:</strong> ${getVal('city')}</div>
                    <div><strong>Адрес:</strong> ${getVal('address-input')}</div>
                    <div><strong>Бренд:</strong> ${getVal('brand')}</div>
                    <div><strong>Категория:</strong> ${getSelectText('type-category')}</div>
                    <div><strong>Подкатегория:</strong> ${getVal('subcategory-select') || getVal('type-subcategory')}</div>
                    <div style="white-space: pre-wrap;"><strong>Описание:</strong> ${getVal('description')}</div>
                    <div><strong>Фото:</strong> ${window.FileManager?.selectedFiles?.length || 0} шт.</div>
                </div>
            `;
        }
        document.getElementById('confirmModal').classList.add('active');
    },

    closeModal: function() {
        document.getElementById('confirmModal').classList.remove('active');
    },

    finalSend: function() {
        this.closeModal();
        this.showUploadStatus();
        this.sendDataToServerWithProgress();
    },

    showUploadStatus: function() {
        const modal = document.getElementById('statusModal');
        if (modal) {
            modal.classList.add('active');
            document.getElementById('status-title').innerText = 'Отправка...';
            document.getElementById('status-details').innerHTML = '<div class="loader"></div>';
            const okBtn = modal.querySelector('.btn-primary');
            if (okBtn) okBtn.style.display = 'none';
        }
    },

    // 2. ИСПРАВЛЕНО: Полный набор данных без сокращений для Apps Script
    sendDataToServerWithProgress: async function() {
        try {
            const filePromises = (FileManager.selectedFiles || []).map(file => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve({
                        base64: e.target.result.split(',')[1],
                        filename: file.name,
                        filetype: file.type
                    });
                    reader.readAsDataURL(file);
                });
            });
            const encodedFiles = await Promise.all(filePromises);

            const dataToSend = {
                // Соответствие полям в вашем Apps Script:
                source: new URLSearchParams(window.location.search).get('source') || 'direct',
                user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id || '',
                name: document.getElementById('name').value,
                phone: window.iti ? window.iti.getNumber() : document.getElementById('phone').value,
                city: document.getElementById('city').value,
                address: document.getElementById('address-input')?.value || '',
                lat: document.getElementById('lat')?.value || '', // Координаты из скрытых полей
                lng: document.getElementById('lng')?.value || '',
                category: document.getElementById('type-category').value,
                subcategory: document.getElementById('subcategory-select')?.value || document.getElementById('type-subcategory')?.value || '',
                brand: document.getElementById('brand').value,
                description: document.getElementById('description').value,
                files: encodedFiles // Фотографии
            };

            // Меняем mode на 'cors' чтобы получить ответ от сервера
            const response = await fetch(scriptURL, {
                method: 'POST',
                mode: 'cors', // Изменено с 'no-cors' на 'cors'
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(dataToSend)
            });

            // Получаем данные от сервера
            const result = await response.json();
            
            if (result.status === "success") {
                // 1. Получаем номер заявки и статус из app script
                const orderNumber = result.orderNumber;
                const status = 'Новая: Ожидает обработки';
                
                // 2. Вставляем номер заявки и статус в функцию showFinalStatus
                // 3-4. Функция сама генерирует случайную фразу и показывает пользователю
                this.showFinalStatus(orderNumber, status);
            } else {
                throw new Error(result.message || "Ошибка отправки");
            }

        } catch (error) {
            console.error('Ошибка:', error);
            document.getElementById('status-details').innerHTML = `<p style="color:red">Ошибка: ${error.message}</p>`;
            const okBtn = document.querySelector('#statusModal .btn-primary');
            if (okBtn) okBtn.style.display = 'block';
        }
    },

    /**
     * Показ финального статуса с номером заявки
     * @param {string} orderNumber - номер заявки от сервера
     * @param {string} status - статус заявки от сервера
     */
    showFinalStatus: function(orderNumber, status) {
        const lang = window.currentLang || 'ru';
        
        // 3. Генерируем случайную фразу (на выбранном языке)
        let randomPhrase = "Спасибо за обращение!";
        if (window.getRandomPhrase) {
            randomPhrase = window.getRandomPhrase(lang);
        } else if (window.translations?.[lang]?.phrases) {
            const phrases = window.translations[lang].phrases;
            randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        }
        randomPhrase = randomPhrase.replace("{orderNum}", orderNumber);

        const details = document.getElementById('status-details');
        
        // Получаем заголовки
        let successTitle = "Заявка отправлена!";
        let orderLabel = "Номер заявки";
        let statusLabel = "Статус";
        
        if (window.getTranslation) {
            successTitle = window.getTranslation('common.successTitle', lang);
            orderLabel = window.getTranslation('status.orderLabel', lang);
            statusLabel = window.getTranslation('status.statusLabel', lang);
        } else if (window.translations?.[lang]) {
            successTitle = window.translations[lang].successTitle || successTitle;
            orderLabel = window.translations[lang].orderLabel || orderLabel;
            statusLabel = window.translations[lang].statusLabel || statusLabel;
        }
        
        // Обновляем заголовки
        document.getElementById('status-title').innerText = successTitle;
        
        // Формируем контент
        details.innerHTML = `
            <div style="margin-bottom: var(--space-md);">
                <span style="color: var(--text-tertiary); font-size: 12px; text-transform: uppercase;">${orderLabel}:</span>
                <span style="color: var(--primary-color); font-weight: bold; font-size: 16px; margin-left: 5px;">#${orderNumber}</span>
            </div>
            <div style="margin-bottom: var(--space-lg);">
                <span style="color: var(--text-tertiary); font-size: 12px; text-transform: uppercase;">${statusLabel}:</span>
                <span style="color: var(--success-color); font-weight: 600; margin-left: 5px;">${status}</span>
            </div>
            <div style="padding: var(--space-md); background: var(--bg-color); border-radius: var(--radius-md); border: 1px solid var(--border-color); font-style: italic; color: var(--text-primary);">
                "${randomPhrase}"
            </div>`;
        
        // 5. Кнопка "Понятно" (на выбранном языке)
        const okBtn = document.querySelector('#statusModal .modal-footer .btn-primary');
        if (okBtn) {
            okBtn.style.display = 'block';
            okBtn.innerText = window.getTranslation ? window.getTranslation('common.btnOk', lang) : 'Понятно';
            
            // Удаляем старый обработчик и добавляем новый
            okBtn.onclick = () => {
                // Закрываем модалку
                this.closeStatusModal();
                // Очищаем форму
                this.resetForm();
            };
        }
        
        // 4. Показываем пользователю
        document.getElementById('statusModal').classList.add('active');
    },

     resetForm: function() {
        console.log('🔄 Сброс формы...');
        
        // 1. Сбрасываем стандартные поля формы
        const form = document.getElementById('orderForm');
        if (form) {
            // Сбрасываем все поля вручную, а не через form.reset()
            const nameField = document.getElementById('name');
            const phoneField = document.getElementById('phone');
            const descriptionField = document.getElementById('description');
            
            if (nameField) nameField.value = '';
            if (phoneField) phoneField.value = '';
            if (descriptionField) descriptionField.value = '';
            
            // 2. Сбрасываем селект города
            const citySelect = document.getElementById('city');
            if (citySelect) {
                citySelect.selectedIndex = 0; // Выбираем первый option (disabled selected)
                citySelect.classList.remove('filled');
            }
            
            // 3. Сбрасываем селект категории
            const categorySelect = document.getElementById('type-category');
            if (categorySelect) {
                categorySelect.innerHTML = '<option value="" disabled selected>Select type</option>';
                categorySelect.classList.remove('filled');
                
                // Переинициализируем категории
                if (typeof CategoryManager !== 'undefined' && CategoryManager.initMainCategories) {
                    setTimeout(() => {
                        CategoryManager.initMainCategories(window.currentLang);
                    }, 100);
                }
            }
        }
        
        // 4. Очищаем FileManager
        if (window.FileManager && typeof window.FileManager.clearAllFiles === 'function') {
            window.FileManager.clearAllFiles();
        }
        
        // 5. Очищаем поле бренда
        const brandInput = document.getElementById('brand-input');
        const brandHidden = document.getElementById('brand');
        if (brandInput) {
            brandInput.value = '';
            brandInput.classList.remove('filled', 'error');
            brandInput.style.color = 'var(--text-placeholder)';
            brandInput.style.backgroundColor = 'var(--bg-color)';
            brandInput.style.borderColor = '';
        }
        if (brandHidden) {
            brandHidden.value = '';
        }
        
        // 6. Скрываем секцию адреса и очищаем поля
        const addressSection = document.getElementById('address-section');
        if (addressSection) {
            addressSection.style.display = 'none';
        }
        
        const addressInput = document.getElementById('address-input');
        const addressTypeSelect = document.getElementById('address-type-select');
        if (addressInput) {
            addressInput.value = '';
            addressInput.classList.remove('filled');
        }
        if (addressTypeSelect) {
            addressTypeSelect.selectedIndex = 0;
        }
        
        // 7. Сбрасываем координаты
        const latField = document.getElementById('lat');
        const lngField = document.getElementById('lng');
        if (latField) latField.value = '';
        if (lngField) lngField.value = '';
        
        // 8. Скрываем и очищаем подкатегорию
        const subcategoryContainer = document.getElementById('type-subcategory');
        const subcategorySelect = document.getElementById('subcategory-select');
        if (subcategoryContainer) {
            subcategoryContainer.style.display = 'none';
        }
        if (subcategorySelect) {
            subcategorySelect.innerHTML = '<option value="">Select subcategory</option>';
            subcategorySelect.value = '';
        }
        
        // 9. Восстанавливаем переводы через небольшую задержку
        setTimeout(() => {
            if (typeof changeLang === 'function') {
                changeLang(window.currentLang);
            }
            
            // 10. Сбрасываем состояние полей через CSSHandler
            if (typeof CSSHandler !== 'undefined') {
                // Если есть метод resetAllFields
                if (CSSHandler.resetAllFields) {
                    CSSHandler.resetAllFields();
                }
                // Иначе сбрасываем вручную
                else if (CSSHandler.resetField) {
                    document.querySelectorAll('.form-control').forEach(field => {
                        CSSHandler.resetField(field);
                    });
                }
            }
        }, 200);
        
        console.log('✅ Форма полностью сброшена');
    },

    closeStatusModal: function() {
        document.getElementById('statusModal').classList.remove('active');
    }
};

window.FormHandler = FormHandler;
