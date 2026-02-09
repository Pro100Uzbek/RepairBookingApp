// app.js - Централизованная инициализация приложения (ОБНОВЛЕННЫЙ)

// Обработка ошибок от расширений
window.addEventListener('error', function(e) {
    if (e.filename && 
        (e.filename.includes('chrome-extension://') || 
         e.filename.includes('moz-extension://') ||
         e.filename.includes('safari-extension://'))) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
});

window.addEventListener('unhandledrejection', function(e) {
    if (e.reason && e.reason.stack && 
        e.reason.stack.includes('chrome-extension://')) {
        e.preventDefault();
    }
});

const App = {
    config: {
        cities: ['Podgorica', 'Budva', 'Bar', 'Tivat', 'Kotor', 'Herceg Novi'],
        defaultLang: 'ru',
        phoneConfig: {
            initialCountry: "me",
            utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/js/utils.js",
            formatOnDisplay: true,
            autoPlaceholder: "aggressive",
            separateDialCode: true,
            nationalMode: false,
            allowDropdown: true
        }
    },

    init: function() {
        console.log('App: Инициализация приложения...');
        
        try {
            this.initLanguage();
            this.initTelegram();
            this.initUTM();
            this.initCSSHandler();
            this.initModules();
            this.initPhoneInput();
            this.handleAutofill();
            this.initPhotoHandlers();
            this.initFileManager();
            
            console.log('✅ App: Инициализация завершена');
        } catch (error) {
            console.error('❌ App: Ошибка при инициализации:', error);
            isAppInitialized = false; // Разрешаем повторную инициализацию при ошибке
        }
    },

    // Инициализация языка
    initLanguage: function() {
        window.currentLang = localStorage.getItem('userLanguage') || this.config.defaultLang;
        
        if (typeof changeLang === "function") {
            changeLang(window.currentLang);
        }
    },

    // Инициализация Telegram WebApp
    initTelegram: function() {
        try {
            if (window.Telegram && window.Telegram.WebApp) {
                const tg = window.Telegram.WebApp;
                tg.ready();
                tg.expand();
                
                if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
                    document.getElementById('source').value = 'telegram_miniapp';
                    const userField = document.getElementById('user_id');
                    if (userField) {
                        // Пробуем получить username, если нет - используем ID
                        userField.value = tg.initDataUnsafe.user.username || 
                                        `tg_${tg.initDataUnsafe.user.id}`;
                    }
                }
            }
        } catch (e) {
            console.warn("App: Ошибка Telegram SDK:", e);
        }
    },

    // Инициализация UTM параметров
    initUTM: function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('utm_source')) {
            const sourceField = document.getElementById('source');
            if (sourceField) {
                sourceField.value = urlParams.get('utm_source');
            }
        }
    },

    // Инициализация CSSHandler
    initCSSHandler: function() {
        if (typeof CSSHandler !== 'undefined' && CSSHandler.init) {
            const debugMode = window.location.search.includes('debug=true');
            const success = CSSHandler.init(debugMode);
            
            if (success) {
                console.log('✅ CSSHandler инициализирован' + (debugMode ? ' (debug mode)' : ''));
                
                // Вызываем handleAutofill из CSSHandler
                setTimeout(() => {
                    if (CSSHandler.handleAutofill) {
                        CSSHandler.handleAutofill();
                    }
                }, 700);
            } else {
                console.warn('⚠️ CSSHandler инициализация завершилась с ошибками');
                this.initFieldsFallback();
            }
        } else {
            console.warn('⚠️ CSSHandler не найден, используем fallback');
            this.initFieldsFallback();
        }
    },

    // Fallback для полей (если CSSHandler не загружен)
    initFieldsFallback: function() {
        console.log('Используем fallback инициализацию полей');
        
        // Базовая инициализация полей
        document.querySelectorAll('input[type="text"], input[type="tel"], select, textarea').forEach(field => {
            if (!field.classList.contains('form-control')) {
                field.classList.add('form-control');
            }
        });
    },

    // Инициализация модулей
    initModules: function() {
        console.log('App: Инициализация модулей...');

        // Инициализация категорий
        if (typeof CategoryManager !== 'undefined') {
            CategoryManager.initMainCategories(window.currentLang);
            
            // Инициализируем подкатегорию если уже выбрана категория
            setTimeout(() => {
                const catSelect = document.getElementById('type-category');
                if (catSelect && catSelect.value) {
                    CategoryManager.updateSubMenu();
                }
            }, 100);
        }

        // Инициализация FormHandler
        if (typeof FormHandler !== 'undefined' && FormHandler.init) {
            FormHandler.init();
        }
    },

    // Инициализация телефона (только intlTelInput)

    // В app.js обновляем initPhoneInput:
    initPhoneInput: function() {
        const phoneInput = document.getElementById('phone');
        if (!phoneInput) {
            console.error('App: Поле phone не найдено');
            return;
        }

        if (phoneInput.classList.contains('iti__tel-input')) {
            console.log('App: Поле телефона уже инициализировано');
            return;
        }

        try {
            window.iti = window.intlTelInput(phoneInput, {
                utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/js/utils.js",
                initialCountry: "me",
                separateDialCode: true,
                strictMode: true,
                autoPlaceholder: "aggressive",
                formatOnDisplay: true,
                nationalMode: false,
                allowDropdown: true
            });

            console.log('✅ intlTelInput инициализирован');

            // Добавляем защиту от частых вызовов валидации
            let lastValidationTime = 0;
            const validationCooldown = 500; // 500ms cooldown
            
            const validateWithCooldown = () => {
                const now = Date.now();
                if (now - lastValidationTime < validationCooldown) {
                    return;
                }
                lastValidationTime = now;
                
                if (typeof ValidationManager !== 'undefined' && ValidationManager.validate) {
                    ValidationManager.validate();
                }
            };

            // Заменяем стандартные обработчики
            phoneInput.addEventListener('input', (e) => {
                if (typeof ValidationManager !== 'undefined' && ValidationManager.clearError) {
                    ValidationManager.clearError();
                }
                // Откладываем валидацию
                setTimeout(validateWithCooldown, 300);
            });

            phoneInput.addEventListener('blur', validateWithCooldown);

            // Инициализируем ValidationManager
            if (typeof ValidationManager !== 'undefined' && ValidationManager.init) {
                ValidationManager.init(phoneInput);
                console.log('✅ ValidationManager инициализирован');
            }

        } catch (error) {
            console.error('App: Ошибка инициализации intlTelInput:', error);
            phoneInput.placeholder = "+382 68 XXX XXX";
            phoneInput.type = 'tel';
        }
    },

    // Обработчики для фото
    
    // В app.js обновляем initPhotoHandlers:

    // В app.js обновляем initPhotoHandlers:
    initPhotoHandlers: function() {
        const photoInput = document.getElementById('photo');
        const photoLabel = document.querySelector('.custom-file-upload');
        
        if (photoLabel && photoInput) {
            // Удаляем все старые обработчики события change
            const newInput = photoInput.cloneNode(true);
            photoInput.parentNode.replaceChild(newInput, photoInput);
            
            const newPhotoInput = document.getElementById('photo');
            
            // Добавляем защиту от множественных вызовов
            let isProcessingChange = false;
            
            newPhotoInput.addEventListener('change', (e) => {
                console.log('📁 Событие change файлового поля');
                
                if (isProcessingChange) {
                    console.warn('⚠️ Изменение файлов уже обрабатывается');
                    e.target.value = ""; // Сбрасываем значение
                    return;
                }
                
                if (!e.target.files || e.target.files.length === 0) {
                    console.log('📁 Нет файлов для обработки');
                    return;
                }
                
                isProcessingChange = true;
                console.log(`📁 Начало обработки ${e.target.files.length} файлов`);
                
                // Логируем статус до обработки
                if (typeof FileManager !== 'undefined' && FileManager.logStatus) {
                    FileManager.logStatus();
                }
                
                if (typeof FileManager !== 'undefined' && FileManager.handleFiles) {
                    FileManager.handleFiles(e.target);
                }
                
                // Сбрасываем флаг через задержку
                setTimeout(() => {
                    isProcessingChange = false;
                    console.log('📁 Готов к обработке новых файлов');
                    
                    // Логируем статус после обработки
                    if (typeof FileManager !== 'undefined' && FileManager.logStatus) {
                        FileManager.logStatus();
                    }
                }, 1000);
            });
            
            // Также обновляем обработчик клика по label
            const newLabel = photoLabel.cloneNode(true);
            photoLabel.parentNode.replaceChild(newLabel, photoLabel);
            
            const newPhotoLabel = document.querySelector('.custom-file-upload');
            let isClickProcessing = false;
            
            newPhotoLabel.addEventListener('click', (e) => {
                if (isClickProcessing) {
                    console.warn('⚠️ Клик по фото уже обрабатывается');
                    return;
                }
                
                isClickProcessing = true;
                e.preventDefault();
                console.log('🖱️ Клик по кнопке фото');
                newPhotoInput.click();
                
                setTimeout(() => {
                    isClickProcessing = false;
                }, 500);
            });
            
            console.log('✅ Обработчики фото обновлены с защитой от дублирования');
        }
    },

    // метод для обработки автозаполнения
    handleAutofill: function() {
        // Обработка автозаполнения браузера
        setTimeout(() => {
            if (typeof CSSHandler !== 'undefined' && CSSHandler.handleAutofill) {
                CSSHandler.handleAutofill();
            }
        }, 600);
    },

    // метод для инициализации FileManager
    initFileManager: function() {
        // Принудительно обновляем поле ввода при инициализации
        setTimeout(() => {
            if (typeof FileManager !== 'undefined' && FileManager.updateFileInput) {
                console.log('🔄 Инициализация FileManager...');
                FileManager.updateFileInput();
            }
        }, 1000);
    },

    // Инициализация статусбара загрузки    
    initStatusBar: function() {
    // Инициализация прогрессбара если есть элементы
        const progressFill = document.getElementById('upload-progress');
        if (progressFill) {
            progressFill.style.width = '0%';
        }
    },

    // Вспомогательные методы
    getQueryParam: function(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    reload: function() {
        console.log('App: Перезагрузка приложения...');
        this.init();
    }
    
};

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Блокировка ошибок от расширений
window.addEventListener('error', function(e) {
    // Более строгая проверка на расширения
    if (e.filename && (
        e.filename.includes('chrome-extension://') ||
        e.filename.includes('moz-extension://') ||
        e.filename.includes('safari-extension://') ||
        e.filename.includes('extension://') ||
        e.filename.includes('contentScript.js')
    )) {
        e.preventDefault();
        e.stopPropagation();
        console.warn('Игнорируем ошибку расширения:', e.message);
        return true;
    }
});

// Также блокируем promise rejections от расширений
window.addEventListener('unhandledrejection', function(e) {
    if (e.reason && (
        (e.reason.stack && e.reason.stack.includes('chrome-extension')) ||
        (typeof e.reason === 'string' && e.reason.includes('extension'))
    )) {
        e.preventDefault();
        console.warn('Игнорируем rejection от расширения:', e.reason);
    }
});

// Экспорт для глобального доступа
window.App = App;