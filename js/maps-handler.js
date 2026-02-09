// maps-handler.js  +++
// ОБНОВЛЕННЫЙ КОД (с новыми классами)

let map, marker, autocomplete, geocoder;
let tempCoords = null;
let userActualCoords = null;
let isTelegramWebApp = false;
let geocodeTimeout = null;
let confirmLocationBtn = null;

// Координаты центров городов
const cityCoordinates = {
    'Podgorica': { lat: 42.441, lng: 19.263 },
    'Budva': { lat: 42.291, lng: 18.840 },
    'Bar': { lat: 42.093, lng: 19.100 },
    'Tivat': { lat: 42.435, lng: 18.696 },
    'Kotor': { lat: 42.424, lng: 18.771 },
    'Herceg Novi': { lat: 42.453, lng: 18.537 }
};

// Обновление центра карты при выборе города
function updateMapCenterByCity(cityName) {
    if (cityCoordinates[cityName] && map && marker) {
        const newPos = cityCoordinates[cityName];
        map.setCenter(newPos);
        marker.setPosition(newPos);
        tempCoords = new google.maps.LatLng(newPos.lat, newPos.lng);
        clearGeocodeDisplay();
    }
}

// Обработка выбора в выпадающем списке
function handleAddressSelection(value, cityName) {
    const addressInput = document.getElementById('address-input');
    
    if (value === 'map') {
        openMapModal(cityName);
    } else if (value === 'manual') {
        addressInput.readOnly = false;
        addressInput.classList.remove('address-display-input');
        addressInput.focus();
        // Очищаем координаты при ручном вводе
        document.getElementById("lat").value = '';
        document.getElementById("lng").value = '';
    }
    
    // Сбрасываем селектор обратно на заголовок
    document.getElementById('address-type-select').value = "";
}

function openMapModal(cityName) {
    console.log("Открываем модалку карты, город:", cityName);
    
    const modal = document.getElementById("mapModal");
    if (!modal) {
        console.error("Модальное окно карты не найдено!");
        return;
    }
    
    modal.classList.add('active');

    // Деактивируем кнопку при открытии
    confirmLocationBtn = document.getElementById('confirm-location-btn');
    if (confirmLocationBtn) {
        confirmLocationBtn.disabled = true;
        confirmLocationBtn.classList.add('disabled');
    }
    
    // Даем время на отрисовку модального окна
    setTimeout(() => {
        // Проверяем, загружена ли Google Maps API
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            console.error("Google Maps API не загружена!");
            alert("Карта временно недоступна. Пожалуйста, обновите страницу.");
            return;
        }
        
        // Проверяем, находимся ли мы в Telegram WebApp
        isTelegramWebApp = typeof Telegram !== 'undefined' && Telegram.WebApp;
        
        if (!map) {
            console.log("Инициализируем новую карту");
            initMapLogic(cityName);
        } else {
            console.log("Используем существующую карту");
            if (cityName && cityCoordinates[cityName]) {
                const cityPos = cityCoordinates[cityName];
                map.setCenter(cityPos);
                marker.setPosition(cityPos);
                tempCoords = new google.maps.LatLng(cityPos.lat, cityPos.lng);
            }
        }
        
        // Принудительно запускаем resize карты
        setTimeout(() => {
            if (map && typeof google !== 'undefined') {
                console.log("Запускаем resize карты");
                google.maps.event.trigger(map, 'resize');
                
                // Перецентрируем карту
                const center = map.getCenter();
                map.setCenter(center);
                
                // Проверяем размеры
                const mapCanvas = document.getElementById("map-canvas");
                if (mapCanvas) {
                    console.log("Размеры canvas:", {
                        width: mapCanvas.offsetWidth,
                        height: mapCanvas.offsetHeight
                    });
                }
            }
        }, 100);

    }, 100);
}

function closeMapModal() {
    document.getElementById("mapModal").classList.remove('active');
    
    // Сбрасываем сообщение о геолокации при закрытии
    const info = document.getElementById("location-comparison");
    if (info) {
        info.innerHTML = "";
        info.className = "";
    }

    // Деактивируем кнопку при закрытии
    if (confirmLocationBtn) {
        confirmLocationBtn.disabled = true;
        confirmLocationBtn.classList.add('disabled');
    }
    
    // Очищаем таймаут
    if (geocodeTimeout) {
        clearTimeout(geocodeTimeout);
        geocodeTimeout = null;
    }
}

function initMapLogic(cityName) {
    // Определяем начальную позицию на основе выбранного города
    let defaultPos = { lat: 42.441, lng: 19.263 }; // По умолчанию Подгорица

    // Проверяем наличие элемента карты
    const mapCanvas = document.getElementById("map-canvas");
    if (!mapCanvas) {
        console.error("Элемент map-canvas не найден!");
        return;
    }
    
    // Проверяем загрузку Google Maps API
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        console.error("Google Maps API не загружена!");
        alert("Карта временно недоступна. Пожалуйста, обновите страницу.");
        return;
    }
    
    if (cityName && cityCoordinates[cityName]) {
        defaultPos = cityCoordinates[cityName];
        console.log("Инициализируем карту с центром в:", cityName, defaultPos);
    }
    
    geocoder = new google.maps.Geocoder();

    map = new google.maps.Map(document.getElementById("map-canvas"), {
        center: defaultPos,
        zoom: 14,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        disableDefaultUI: false,
        streetViewControl: false,
        mapTypeControl: false,
        mapcameraControl: false,
        fullscreenControl: false,
        rotateControl: false,
        tiltControl: false,
        mapTypeControlOptions: {
            mapTypeIds: []
        }        
    });

    // Инициализация маркера
    if (window.google && google.maps && google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        marker = new google.maps.marker.AdvancedMarkerElement({
            map: map,
            gmpDraggable: true,
            position: defaultPos
        });
    } else {
        // Fallback на старый маркер
        marker = new google.maps.Marker({
            map: map,
            draggable: true,
            position: defaultPos
        });
    }

    // Инициализируем кнопку подтверждения
    confirmLocationBtn = document.getElementById('confirm-location-btn');
    
    // Делаем кнопку неактивной по умолчанию
    if (confirmLocationBtn) {
        confirmLocationBtn.disabled = true;
        confirmLocationBtn.classList.add('disabled');
    }    

    // Автодополнение поиска в модалке
    const searchInput = document.getElementById("map-search-input");
    
    if (searchInput) {
        // Сначала проверяем поддержку новой версии
        if (window.google && google.maps && google.maps.places && google.maps.places.PlaceAutocompleteElement) {
            try {
                // Новая версия PlaceAutocompleteElement
                const autocompleteElement = new google.maps.places.PlaceAutocompleteElement({
                    inputElement: searchInput,
                    componentRestrictions: { country: 'me' }
                });
                
                autocompleteElement.addEventListener('place_changed', () => {
                    const place = autocompleteElement.value;
                    if (place && place.geometry) {
                        updateMapPosition(place.geometry.location, true);
                    }
                });
            } catch (error) {
                console.warn('PlaceAutocompleteElement не поддерживается, используем старую версию:', error);
            }
        }
        
        // Старая версия Autocomplete (fallback)
        try {
            autocomplete = new google.maps.places.Autocomplete(searchInput, {
                componentRestrictions: { country: 'me' }
            });
            
            // ТОЛЬКО если autocomplete успешно создан
            if (autocomplete) {
                autocomplete.addListener("place_changed", () => {
                    const place = autocomplete.getPlace();
                    if (place.geometry) {
                        updateMapPosition(place.geometry.location, true);
                    }
                });
            }
        } catch (error) {
            console.warn('Autocomplete не инициализирован:', error);
            // Продолжаем без автодополнения
        }
    }

    // Клики по карте
    map.addListener("click", (e) => updateMapPosition(e.latLng));
    marker.addListener("dragend", () => updateMapPosition(marker.getPosition()));

    // Добавляем кнопку "Где я"
    createGeoButton();
    
    // Инициализируем tempCoords
    tempCoords = new google.maps.LatLng(defaultPos.lat, defaultPos.lng);
}

// Функция для создания кнопки "Где я"
function createGeoButton() {
    const btn = document.createElement("button");
    btn.innerHTML = '<span class="material-symbols-outlined">my_location</span>';
    btn.className = "geo-button";
    btn.type = "button";
    btn.title = "Определить мое местоположение";
    
    const container = document.getElementById("map-canvas-container");
    if (container) {
        const oldBtn = container.querySelector('.geo-button');
        if (oldBtn) oldBtn.remove();
        container.appendChild(btn);
    }

    btn.onclick = () => {
        getBrowserLocationForButton(btn);
    };
}

// Основная функция для определения местоположения
function getBrowserLocationForButton(btn) {
    if (!navigator.geolocation) {
        showGeolocationError("Ваш браузер не поддерживает геолокацию");
        return;
    }
    
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span class="material-symbols-outlined">sync</span>';
    btn.classList.add('loading');
    btn.disabled = true;
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const pos = { 
                lat: position.coords.latitude, 
                lng: position.coords.longitude 
            };
            userActualCoords = pos;
            updateMapPosition(new google.maps.LatLng(pos.lat, pos.lng), true);
            map.setZoom(17);
            showGeolocationSuccess();
            
            btn.innerHTML = originalHTML;
            btn.classList.remove('loading');
            btn.disabled = false;
        },
        (error) => {
            let message = "📍 Не удалось определить местоположение";
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    message = "📍 Доступ к геолокации запрещен. Разрешите доступ в настройках браузера.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = "📍 Информация о местоположении недоступна";
                    break;
                case error.TIMEOUT:
                    message = "📍 Время ожидания истекло";
                    break;
            }
            
            showGeolocationError(message);
            
            btn.innerHTML = originalHTML;
            btn.classList.remove('loading');
            btn.disabled = false;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Автоматическое определение при открытии карты
// function tryAutoLocation() {
//    checkLocationPermission();
// }

// Проверка разрешения на геолокацию
function checkLocationPermission() {
    if (!navigator.geolocation) {
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const pos = { 
                lat: position.coords.latitude, 
                lng: position.coords.longitude 
            };
            userActualCoords = pos;
            updateMapPosition(new google.maps.LatLng(pos.lat, pos.lng), true);
            map.setZoom(17);
            showGeolocationSuccess();
        },
        (error) => {
            if (error.code === error.PERMISSION_DENIED) {
                showLocationInfoMessage();
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 3000,
            maximumAge: 0
        }
    );
}

// Показать информационное сообщение о геолокации
function showLocationInfoMessage() {
    const info = document.getElementById("location-comparison");
    if (info) {
        info.innerHTML = `
            <div style="text-align: center; padding: 10px;">
                <div style="margin-bottom: var(--space-sm); color: var(--text-tertiary); font-size: 13px;">
                    Для быстрого определения адреса нажмите 
                    <span style="color: var(--primary-color); font-weight: 500;">"Где я"</span>
                </div>
                <div style="font-size: 12px; color: var(--text-placeholder);">
                    Или укажите местоположение на карте вручную
                </div>
            </div>`;
        info.style.color = "var(--text-tertiary)";
        info.style.backgroundColor = "var(--bg-secondary)";
        info.style.padding = "var(--space-md) var(--space-lg)";
        info.style.borderRadius = "var(--radius-md)";
        info.style.margin = "var(--space-md) 0";
        info.style.border = "1px solid var(--border-color)";
    }
}

// Функция для показа успешного определения геолокации
function showGeolocationSuccess() {
    const info = document.getElementById("location-comparison");
    if (info) {
        info.innerHTML = "✅ Ваше местоположение определено";
        info.style.color = "var(--success-color)";
        info.style.backgroundColor = "var(--success-light)";
        info.style.padding = "var(--space-md) var(--space-lg)";
        info.style.borderRadius = "var(--radius-md)";
        info.style.margin = "var(--space-md) 0";
        info.style.border = "1px solid var(--success-color)";
    }
}

// Функция для показа ошибки геолокации
function showGeolocationError(message) {
    const info = document.getElementById("location-comparison");
    if (info) {
        info.innerHTML = message;
        info.style.color = "var(--error-color)";
        info.style.backgroundColor = "var(--error-light)";
        info.style.padding = "var(--space-md) var(--space-lg)";
        info.style.borderRadius = "var(--radius-md)";
        info.style.margin = "var(--space-md) 0";
        info.style.border = "1px solid var(--error-color)";
    }
}

// Очистка поля с адресом
function clearGeocodeDisplay() {
    const searchInput = document.getElementById("map-search-input");
    if (searchInput) {
        searchInput.value = "";
    }

    // Деактивируем кнопку при очистке
    if (confirmLocationBtn) {
        confirmLocationBtn.disabled = true;
        confirmLocationBtn.classList.add('disabled');
    }
}

// Обновление позиции на карте с ограниченным геокодированием
function updateMapPosition(latLng, pan = false) {
    
    console.log("=== updateMapPosition вызвана ===");
    console.log("latLng:", latLng);
    console.log("marker:", marker);
    console.log("confirmLocationBtn до обновления:", confirmLocationBtn);


    if (pan) map.panTo(latLng);
    marker.setPosition(latLng);
    tempCoords = latLng;

    // Сохраняем координаты сразу
    const latInput = document.getElementById("lat");
    const lngInput = document.getElementById("lng");
    if (latInput && lngInput) {
        latInput.value = latLng.lat();
        lngInput.value = latLng.lng();
    }

        // Активируем кнопку
    confirmLocationBtn = document.getElementById('confirm-location-btn');
    console.log("confirmLocationBtn после поиска:", confirmLocationBtn);

    // ВАЖНО: Активируем кнопку сразу при получении координат
    if (confirmLocationBtn && latLng) {
        console.log("Активируем кнопку...");
        console.log("Состояние кнопки до активации:");
        console.log("- disabled:", confirmLocationBtn.disabled);
        console.log("- classList:", Array.from(confirmLocationBtn.classList));
        confirmLocationBtn.disabled = false;
        confirmLocationBtn.classList.remove('disabled');
        console.log("✅ Кнопка подтверждения активирована");
          console.log("Состояние кнопки после активации:");
        console.log("- disabled:", confirmLocationBtn.disabled);
        console.log("- classList:", Array.from(confirmLocationBtn.classList));
        console.log("✅ Кнопка подтверждения активирована");
    } else {
        console.log("❌ Не могу активировать кнопку:");
        console.log("- confirmLocationBtn:", confirmLocationBtn);
        console.log("- latLng:", latLng);
    }

    // Сравнение локаций
    if (userActualCoords) {
        const dist = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(userActualCoords.lat, userActualCoords.lng),
            latLng
        );
        const info = document.getElementById("location-comparison");
        if (info) {
            if (dist < 50) {
                info.innerHTML = "✅ Вы находитесь здесь";
                info.style.color = "var(--success-color)";
                info.style.backgroundColor = "var(--success-light)";
                info.style.border = "1px solid var(--success-color)";
            } else {
                info.innerHTML = `📍 Точка в ${Math.round(dist)}м от вас`;
                info.style.color = "var(--warning-color)";
                info.style.backgroundColor = "var(--warning-light)";
                info.style.border = "1px solid var(--warning-color)";
            }
        }
    }

    // Ограниченное геокодирование с таймаутом
    if (geocodeTimeout) {
        clearTimeout(geocodeTimeout);
    }
    
    // Устанавливаем таймаут 3 секунды на геокодирование
    geocodeTimeout = setTimeout(() => {
        geocoder.geocode({ location: latLng }, (results, status) => {
            const searchInput = document.getElementById("map-search-input");
            if (searchInput) {
                if (status === "OK" && results[0]) {
                    // Если нашли адрес - показываем его
                    searchInput.value = results[0].formatted_address;
                    
                    // Сохраняем в поле адреса
                    const addressField = document.getElementById("address-input");
                    if (addressField) {
                        addressField.value = results[0].formatted_address;
                    }
                } else {
                    // Если адрес не найден - показываем координаты
                    const lat = latLng.lat().toFixed(6);
                    const lng = latLng.lng().toFixed(6);
                    searchInput.value = `📍 Координаты: ${lat}, ${lng}`;
                    
                    // Сохраняем координаты в поле адреса
                    const addressField = document.getElementById("address-input");
                    if (addressField) {
                        addressField.value = `Координаты: ${lat}, ${lng}`;
                    }

                    // Активируем кнопку подтверждения после получения координат
                    if (confirmLocationBtn && latLng) {
                        confirmLocationBtn.disabled = false;
                        confirmLocationBtn.classList.remove('disabled');
                    }

                }
            }
        });
    }, 3000);
}

// Подтверждение выбранного местоположения
function confirmLocation() {
    const searchInput = document.getElementById("map-search-input");
    const displayInput = document.getElementById("address-input");
    
    if (tempCoords) {
        // Всегда сохраняем координаты
        const latInput = document.getElementById("lat");
        const lngInput = document.getElementById("lng");
        if (latInput && lngInput) {
            latInput.value = tempCoords.lat();
            lngInput.value = tempCoords.lng();
        }
        
        if (displayInput) {
            if (searchInput && searchInput.value) {
                // Если есть текст в поиске (адрес или координаты)
                displayInput.value = searchInput.value;
            } else {
                // Если текста нет, сохраняем координаты
                const lat = tempCoords.lat().toFixed(6);
                const lng = tempCoords.lng().toFixed(6);
                displayInput.value = `Координаты: ${lat}, ${lng}`;
            }
            // Обновляем состояние через CSSHandler
            if (typeof CSSHandler !== 'undefined' && CSSHandler.updateFieldState) {
                CSSHandler.updateFieldState(displayInput);
            } else {
                displayInput.classList.add('filled');
            }
            displayInput.classList.add('filled');
            displayInput.readOnly = true;
            displayInput.classList.add('address-display-input');
        }
        
        closeMapModal();
    } else {
        alert("Пожалуйста, выберите местоположение на карте");
    }
}

// Функция перезагрузки карты
window.reloadMap = function() {
    console.log("Перезагружаем карту...");
    if (map) {
        const center = map.getCenter();
        const zoom = map.getZoom();
        
        // Уничтожаем старую карту
        map = null;
        marker = null;
        
        // Пересоздаем
        setTimeout(() => {
            const citySelect = document.getElementById('city');
            const cityName = citySelect ? citySelect.value : null;
            initMapLogic(cityName);
            
            if (map && center) {
                map.setCenter(center);
                map.setZoom(zoom);
            }
        }, 100);
    }
}