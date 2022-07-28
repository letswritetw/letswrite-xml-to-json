// xml to json
import { parseXml, xml2json } from 'library/xml2json';

document.addEventListener('DOMContentLoaded', () => {

  // 取資料
  // xml2json：https://goessner.net/download/prj/jsonxml/
  fetch('https://ptx.transportdata.tw/MOTC/v2/Rail/Metro/Station/TRTC?$format=xml')
    .then(res => res.text())
    .then(res => {
      const data = xml2json(parseXml(res), '');
      const dataFormat = JSON.parse(data).ArrayOfStation.Station;
      console.log(dataFormat);

      // 放置地圖
      const center = [25.03, 121.57];
      const zoom = 13;
      const map = L.map('map').setView(center, zoom);
      L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      }).addTo(map);

      // 建 marker 並放上地圖
      const customIcon = L.icon({
        iconUrl: 'https://letswritetw.github.io/letswrite-leaflet-osm-locate/dist/dot.svg',
        iconSize: [16, 16],
      });

      Array.prototype.forEach.call(dataFormat, data => {
        let lat = data.StationPosition.PositionLat;
        let lon = data.StationPosition.PositionLon;
        let name = data.StationName.Zh_tw + '站';
        let address = data.StationAddress;
        let marker = L.marker([lat, lon], {
          icon: customIcon,
          title: name
        }).bindPopup(`<b>${name}</b><br/>${address}`)
          .addTo(map);
      });

      // 抓使用者定位套件
      L.control.locate({
        position: 'topleft',
        strings: {
          title: '定位我的位置',
          metersUnit: '公尺',
          feetUnit: '英尺',
          popup: '距離誤差：{distance}{unit}以內'
        },
        clickBehavior: {
          inView: 'setView',
          outOfView: 'setView',
          inViewNotFollowing: 'inView'
        }
      }).addTo(map);

    })

})