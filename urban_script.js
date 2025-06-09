// إنشاء الخريطة وتحديد مركزها
var map = L.map('map').setView([30.5, 33.8], 8);

// إضافة طبقة الخريطة الأساسية
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// متغير لحفظ الطبقة الحالية
let currentLayer = null;

// دالة لتحميل ملف GeoJSON للعمران
function loadUrban(year) {
  const url = `data/urban_${year}.geojson`;

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
        style: {
          color: '#8e44ad',
          weight: 1,
          fillColor: '#9b59b6',
          fillOpacity: 0.5
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup("منطقة عمرانية");
        }
      }).addTo(map);
    })
    .catch(error => {
      console.error('خطأ في تحميل البيانات:', error);
      alert("تعذر تحميل ملف العمران. تأكدي من المسار والاسم.");
    });
}

// ربط الأزرار بتحميل ملفات العمران
document.getElementById('btn-2013').addEventListener('click', () => loadUrban('2013'));
document.getElementById('btn-2021').addEventListener('click', () => loadUrban('2021'));
document.getElementById('btn-2025').addEventListener('click', () => loadUrban('2025'));
