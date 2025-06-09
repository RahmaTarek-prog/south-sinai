// إنشاء الخريطة وتحديد مركزها
var map = L.map('map').setView([30.5, 33.8], 8);

// إضافة طبقة الخريطة من OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// متغير لحفظ الطبقة الحالية
let currentLayer = null;

// تحميل ملف GeoJSON حسب السنة
function loadGeoJSON(year) {
  const url = `data/${year}.geojson`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (currentLayer) {
        map.removeLayer(currentLayer);
      }

      currentLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 6,
            fillColor: '#ff7800',
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup("1000 people");
          layer.bindTooltip("1000 people", { permanent: false, direction: "top" });
        }
      }).addTo(map);

      // حساب عدد السكان = عدد النقاط × 1000
      const count = data.features.length * 1000;
      document.getElementById("population-count").innerText = `عدد السكان في ${year} = ${count.toLocaleString()} نسمة`;
    })
    .catch(error => {
      console.error('Error loading GeoJSON:', error);
      alert("تعذر تحميل البيانات، تأكد من وجود الملف في المسار الصحيح.");
    });
}

// ربط الأزرار
document.getElementById('btn-2013').addEventListener('click', () => loadGeoJSON('2013'));
document.getElementById('btn-2017').addEventListener('click', () => loadGeoJSON('2017'));
document.getElementById('btn-2021').addEventListener('click', () => loadGeoJSON('2021'));
document.getElementById('btn-2025').addEventListener('click', () => loadGeoJSON('2025'));
