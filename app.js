// Başlangıç kayıtları (localStorage yoksa)
if(!localStorage.getItem("kayitlar")){
  const ornekKayitlar=[
    {tarih:"2026-02-01", konu:"Toplantı ve Planlama", resimler:["kayıtlar/resim1.jpg","kayıtlar/resim2.jpg"], timestamp:new Date().toLocaleString()},
    {tarih:"2026-02-02", konu:"Raporlama ve Analiz", resimler:["kayıtlar/resim3.jpg"], timestamp:new Date().toLocaleString()}
  ];
  localStorage.setItem("kayitlar", JSON.stringify(ornekKayitlar));
}

// Kartları listeleme ve filtreleme
function filitrele(){
  const arama=document.getElementById("aramaInput")?.value.toLowerCase()||"";
  const container=document.getElementById("kartContainer");
  if(!container) return;
  container.innerHTML="";
  let kayitlar=JSON.parse(localStorage.getItem("kayitlar")||"[]");
  if(arama) kayitlar=kayitlar.filter(k=>k.tarih.toLowerCase().includes(arama)||k.konu.toLowerCase().includes(arama));
  
  kayitlar.forEach((k,i)=>{
    const kart=document.createElement("div"); 
    kart.className="kart";

    // Sil butonu
    const silBtn=document.createElement("button"); 
    silBtn.className="silButon"; 
    silBtn.textContent="🗑️";
    silBtn.onclick=(e)=>{e.stopPropagation(); kayitSil(i);}
    kart.appendChild(silBtn);

    // Resimler
    k.resimler.forEach(r=>{
      const img=document.createElement("img"); 
      img.src=r; 
      kart.appendChild(img);
    });

    // Bilgi kartı
    const info=document.createElement("div"); 
    info.className="kartInfo";
    info.innerHTML=`<p><strong>Tarih:</strong> ${k.tarih}</p><p><strong>Konu:</strong> ${k.konu}</p>`;
    kart.appendChild(info);

    // Detay açma
    kart.onclick=()=>detayGoster(k);
    container.appendChild(kart);
  });
}

// Kayıt sil
function kayitSil(i){
  let kayitlar=JSON.parse(localStorage.getItem("kayitlar")||"[]");
  kayitlar.splice(i,1);
  localStorage.setItem("kayitlar",JSON.stringify(kayitlar));
  filitrele();
}

// Detay göster
function detayGoster(k){
  document.getElementById("detayOverlay").style.display="flex"; 
  const detayIcerik=document.getElementById("detayIcerik");
  detayIcerik.innerHTML=k.resimler.map(r=>`<img src="${r}">`).join('')+
    `<div class="kartInfo"><p><strong>Tarih:</strong>${k.tarih}</p><p><strong>Konu:</strong>${k.konu}</p></div>`;
}

// Detay kapatma
function kapatDetay(){
  document.getElementById("detayOverlay").style.display="none";
}

// Son güncelleme göster (ayarlar sayfası)
function sonGuncellemeGoster(){
  let kayitlar=JSON.parse(localStorage.getItem("kayitlar")||"[]"); 
  const son=kayitlar.length?kayitlar[kayitlar.length-1].timestamp:"-"; 
  document.getElementById("sonGuncelleme")?.innerText="Son güncelleme: "+son;
}

// Dışa aktar
function disarAktar(){
  alert("JSON ve resimler klasörünü kopyalayarak PC'ye aktarabilirsiniz.");
}

// İçe al
function iceriAl(){
  alert("Telefon veya başka cihazdan JSON ve kayıtlar/ klasörünü buraya kopyalayabilirsiniz."); 
  sonGuncellemeGoster();
}

// Sayfa yüklendiğinde kartları renderle
document.addEventListener("DOMContentLoaded",filitrele);
