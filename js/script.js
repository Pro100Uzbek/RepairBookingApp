// script.js - УПРОЩЕННАЯ ВЕРСИЯ (только функции интерфейса и брендов)
// Основные функции интерфейса, не связанные с инициализацией

// Константы брендов (без изменений)
const applianceBrands = [
    { id: 1, name: "Beko", logo: "assets/logos/logo-beko.png", color: "#e2001a" },
    { id: 2, name: "Gorenje", logo: "assets/logos/logo-gorenje.png", color: "#0056a3" },
    { id: 3, name: "Samsung", logo: "assets/logos/logo-samsung.png", color: "#1428a0" },
    { id: 4, name: "LG", logo: "assets/logos/logo-lg.png", color: "#a50034" },
    { id: 5, name: "Bosch", logo: "assets/logos/logo-bosch.png", color: "#0056a3" },
    { id: 6, name: "Whirlpool", logo: "assets/logos/logo-whirlpool.png", color: "#ffb612" },
    { id: 7, name: "Indesit", logo: "assets/logos/logo-indesit.png", color: "#0056a3" },
    { id: 8, name: "Candy", logo: "assets/logos/logo-candy.png", color: "#0056a3" },
    { id: 9, name: "Miele", logo: "assets/logos/logo-miele.png", color: "#5d1d1d" },
    { id: 10, name: "Ariston", logo: "assets/logos/logo-ariston.png", color: "#5d1d1d" },
    { id: 11, name: "Liebherr", logo: "assets/logos/logo-liebherr.png", color: "#5d1d1d" },
    { id: 12, name: "Siemens", logo: "assets/logos/logo-siemens.png", color: "#5d1d1d" },
    { id: 13, name: "AEG", logo: "assets/logos/logo-aeg.png", color: "#5d1d1d" },
    { id: 14, name: "Electrolux", logo: "assets/logos/logo-electrolux.png", color: "#5d1d1d" },
    { id: 15, name: "Gaggenau", logo: "assets/logos/logo-gaggenau.png", color: "#5d1d1d" },
    { id: 16, name: "Midea", logo: "assets/logos/logo-midea.png", color: "#5d1d1d" },
    { id: 17, name: "Haier", logo: "assets/logos/logo-haier.png", color: "#5d1d1d" },
    { id: 18, name: "Hisense", logo: "assets/logos/logo-hisense.png", color: "#5d1d1d" },
    { id: 19, name: "Neff", logo: "assets/logos/logo-neff.png", color: "#5d1d1d" },
    { id: 20, name: "Vivax", logo: "assets/logos/logo-vivax.png", color: "#5d1d1d" },
    { id: 21, name: "Vox", logo: "assets/logos/logo-vox.png", color: "#5d1d1d" }
];

// Функция для безопасного получения параметров из URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Эта функция срабатывает сразу после выбора города
function handleCityChange(cityValue) {
    const addressSection = document.getElementById('address-section');
    if (addressSection) {
        addressSection.style.display = 'block';
    }
    
    // Сбросить выбранный адрес при смене города
    const addressInput = document.getElementById('address-input');
    if (addressInput) {
        addressInput.value = '';
        addressInput.classList.remove('filled');
        addressInput.readOnly = false;
        
        const placeholder = window.getTranslation 
            ? window.getTranslation('address.manualPlaceholder', window.currentLang)
            : (window.translations?.[window.currentLang]?.manualPlaceholder || "Введите адрес или ориентир...");
        
        addressInput.placeholder = placeholder;
    }
    
    // Сбросить скрытые координаты
    const latField = document.getElementById("lat");
    const lngField = document.getElementById("lng");
    if (latField) latField.value = '';
    if (lngField) lngField.value = '';
    
    // Передаем город в карту
    if (typeof updateMapCenterByCity === "function") {
        updateMapCenterByCity(cityValue);
    }
}

// Функция обновления состояния полей (универсальная)
function updateFieldState(field) {
    if (field && field.value && field.value.trim() !== '') {
        field.classList.add('filled');
    } else if (field) {
        field.classList.remove('filled');
    }
}

// Функция отрисовки сетки брендов в модальном окне
function renderBrandGrid() {
    console.log('renderBrandGrid вызвана');
    
    const grid = document.getElementById('brandSelectorGrid');
    if (!grid) {
        console.error('❌ renderBrandGrid: Элемент brandSelectorGrid не найден!');
        console.log('Поиск элемента:', document.querySelector('#brandSelectorGrid'));
        return;
    }
    
    console.log('renderBrandGrid: grid найден, children:', grid.children.length);
    
    // Если уже есть элементы, не перерисовываем
    if (grid.children.length > 0) {
        console.log('renderBrandGrid: Сетка уже отрисована, пропускаем');
        return;
    }
    
    console.log('renderBrandGrid: Очищаем и перерисовываем сетку');
    grid.innerHTML = '';
    
    // Проверяем данные брендов
    if (!applianceBrands || !Array.isArray(applianceBrands)) {
        console.error('❌ renderBrandGrid: applianceBrands не определен или не массив');
        return;
    }
    
    console.log('renderBrandGrid: Количество брендов:', applianceBrands.length);
    
    applianceBrands.forEach((brand, index) => {
        const card = document.createElement('div');
        card.className = 'brand-card';
        card.dataset.index = index;
        card.onclick = () => selectBrand(brand.name);
        
        const img = document.createElement('img');
        img.src = brand.logo;
        img.alt = brand.name;
        img.loading = 'lazy';
        
        img.onerror = function() {
            console.warn(`Не удалось загрузить логотип для ${brand.name}`);
            this.style.display = 'none';
            const textFallback = document.createElement('div');
            textFallback.className = 'brand-fallback-text';
            textFallback.innerText = brand.name;
            card.appendChild(textFallback);
        };
        
        img.onload = function() {
            console.log(`Логотип загружен: ${brand.name}`);
        };
        
        card.appendChild(img);
        grid.appendChild(card);
    });
    
    console.log(`✅ renderBrandGrid: Сетка отрисована: ${grid.children.length} элементов`);
}

// Открытие и закрытие модального окна брендов
// Открытие и закрытие модального окна брендов (обновляем)
function openBrandModal() { 
    const modal = document.getElementById('brandModal');
    if (modal) {
        document.body.style.overflow = 'hidden';
        modal.classList.add('active');
        
        // Ленивая инициализация сетки
        setTimeout(() => {
            const grid = document.getElementById('brandSelectorGrid');
            if (grid && grid.children.length === 0) {
                renderBrandGrid();
            }
        }, 10);
        
        // Фокус на поле ручного ввода
        setTimeout(() => {
            const customInput = document.getElementById('customBrand');
            if (customInput) {
                customInput.focus();
                customInput.select();
            }
        }, 100);
    }
}

// Функция очистки поля бренда
function clearBrandField() {
    if (typeof CSSHandler !== 'undefined' && CSSHandler.resetBrandField) {
        CSSHandler.resetBrandField();
    } else {
        // Fallback
        const brandInput = document.getElementById('brand-input');
        const brandHidden = document.getElementById('brand');
        
        if (brandInput) {
            brandInput.value = '';
            brandInput.classList.remove('filled', 'error');
            brandInput.style.color = 'var(--text-placeholder)';
            brandInput.style.backgroundColor = 'var(--bg-color)';
        }
        
        if (brandHidden) {
            brandHidden.value = '';
        }
    }
}

function closeBrandModal() { 
    const modal = document.getElementById('brandModal');
    if (modal) {
        modal.classList.remove('active');
        // Восстанавливаем скролл
        document.body.style.overflow = '';
    }
}

// Обновим функцию selectBrand для нового формата
function selectBrand(name) { 
    const brandInput = document.getElementById('brand-input');
    const brandHidden = document.getElementById('brand');
    
    if (!brandInput || !brandHidden) return;
    
    console.log(`🎯 Выбран бренд: ${name}`);
    
    // Используем CSSHandler для обновления состояния
    if (typeof CSSHandler !== 'undefined' && CSSHandler.updateBrandFieldAfterSelection) {
        CSSHandler.updateBrandFieldAfterSelection(name);
    } else {
        // Fallback
        brandInput.value = name; 
        brandHidden.value = name;
        brandInput.classList.add('filled');
        brandInput.style.color = 'var(--text-primary)';
        brandInput.style.backgroundColor = 'var(--success-light)';
        brandInput.style.borderColor = 'var(--success-color)';
    }
    
    // Визуальный фидбек
    brandInput.style.transform = 'scale(0.98)';
    setTimeout(() => {
        brandInput.style.transform = '';
    }, 150);
    
    // Закрываем модалку
    setTimeout(() => {
        closeBrandModal();
        // Фокус на следующее поле
        const categoryField = document.getElementById('type-category');
        if (categoryField) {
            setTimeout(() => categoryField.focus(), 100);
        }
    }, 300);
}

// Функция для проверки состояния поля бренда
function checkBrandField() {
    const brandField = document.getElementById('brand');
    if (brandField && brandField.value.trim()) {
        return true;
    }
    
    // Визуальный фидбек если поле пустое
    brandField.classList.add('error');
    brandField.style.animation = 'shake 0.5s';
    setTimeout(() => {
        brandField.style.animation = '';
    }, 500);
    
    return false;
}

// Функция применения пользовательского бренда
function applyCustomBrand() {
    const customInput = document.getElementById('customBrand');
    if (!customInput) return;
    
    const custom = customInput.value.trim();
    if (custom !== "") {
        selectBrand(custom); // Используем ту же функцию
        customInput.value = "";
        closeBrandModal(); // Закрываем модалку после применения
    } else {
        // Если поле пустое, просто закрываем модалку
        closeBrandModal();
    }
}

// Вспомогательные функции для обработки адреса
function handleAddressSelection(value, cityName) {
    const addressInput = document.getElementById('address-input');
    if (!addressInput) return;
    
    if (value === 'map') {
        openMapModal(cityName);
    } else if (value === 'manual') {
        addressInput.readOnly = false;
        addressInput.classList.remove('address-display-input');
        addressInput.focus();
        
        // Очищаем координаты при ручном вводе
        const latField = document.getElementById("lat");
        const lngField = document.getElementById("lng");
        if (latField) latField.value = '';
        if (lngField) lngField.value = '';
    }
    
    // Сбрасываем селектор обратно на заголовок
    const addressSelect = document.getElementById('address-type-select');
    if (addressSelect) {
        addressSelect.value = "";
    }
}

// Экспорт функций для глобального доступа (если нужно)
window.handleCityChange = handleCityChange;
window.openBrandModal = openBrandModal;
window.closeBrandModal = closeBrandModal;
window.selectBrand = selectBrand;
window.applyCustomBrand = applyCustomBrand;
window.renderBrandGrid = renderBrandGrid;
window.getQueryParam = getQueryParam;
window.clearBrandField = clearBrandField;


// Обработчик для клавиши Enter в поле ручного ввода бренда
document.addEventListener('DOMContentLoaded', function() {
    const customBrandInput = document.getElementById('customBrand');
    
    if (customBrandInput) {
        customBrandInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyCustomBrand();
            }
        });
    }
});

// Добавим в конец script.js:
// Проверка и инициализация подкатегории при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем подкатегорию через небольшую задержку
    setTimeout(() => {
        const catSelect = document.getElementById('type-category');
        const subContainer = document.getElementById('type-subcategory');
        
        if (catSelect && catSelect.value && subContainer) {
            // Если категория уже выбрана, показываем подкатегорию
            if (typeof CategoryManager !== 'undefined') {
                CategoryManager.updateSubMenu();
            } else {
                // Fallback
                subContainer.style.display = 'block';
            }
        }
    }, 200);
    
    // ... остальной существующий код
});

// Улучшенная функция openBrandModal с фокусом на поле ввода
const originalOpenBrandModal = window.openBrandModal || function() {
    const modal = document.getElementById('brandModal');
    if (modal) {
        modal.classList.add('active');
    }
};

window.openBrandModal = function() {
    originalOpenBrandModal();
    
    // Фокус на поле ввода через небольшую задержку
    setTimeout(() => {
        const customInput = document.getElementById('customBrand');
        if (customInput) {
            customInput.focus();
            customInput.select(); // выделяем текст для удобства
        }
    }, 100);
};

// В конец файла script.js (после всех функций и экспортов)