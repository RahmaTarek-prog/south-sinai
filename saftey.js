var map = L.map('map').setView([30.5, 33.8], 9);
// إضافة طبقة الخريطة الأساسية
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// تخزين الطبقات

// النصوص التوضيحية لكل طبقة
const infoTexts = {
  watch: `🟥 <strong>أبراج المراقبة:</strong> نقاط تمركز لرصد المنطقة الحدودية وحماية الأمن.<br>🟦 <strong>الطرق الظاهرة باللون الأزرق: تقع في مجال رؤية الأبراج وتشكل محاور تأمين حيوية.`,
  supply: '🟩 <strong>مسارات الإمداد:</strong> طرق تُستخدم لتوصيل الدعم والتموين للمناطق.',
  patrol: '🟦 <strong>مسارات الدوريات:</strong> الطرق التي تسلكها قوات الأمن لتأمين المناطق.',
  displacement: '🟧 <strong>مسارات النزوح:</strong> الطرق التي سلكها السكان أثناء الإخلاء أو الهجرة.'
};


// دالة لتحميل أي طبقة GeoJSON
function loadLayer(name, file, color, isPoint = false) {
  fetch(file)
    .then(res => res.json())
    .then(data => {
      layers[name] = L.geoJSON(data, {
        style: isPoint ? null : {
          color: color,
          weight: 3
        },
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 6,
            fillColor: color,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        },
        onEachFeature: function (feature, layer) {
          let popup = "";
          if (feature.properties) {
            for (let key in feature.properties) {
              popup += `<strong>${key}</strong>: ${feature.properties[key]}<br>`;
            }
          }
          layer.bindPopup(popup);
        }
      });
    });
}

// زرار لتفعيل أي طبقة وإظهار المعلومة الخاصة بها
function toggleLayer(name) {
  for (let key in layers) {
    if (layers[key] && map.hasLayer(layers[key])) {
      map.removeLayer(layers[key]);
    }
  }

  if (layers[name]) {
    layers[name].addTo(map);
   document.getElementById('info').innerHTML = infoTexts[name];
  } else {
    document.getElementById('info').innerText = 'جاري التحميل... أعد المحاولة بعد لحظات.';
  }
}
