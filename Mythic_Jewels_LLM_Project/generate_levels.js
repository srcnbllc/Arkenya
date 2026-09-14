const fs = require('fs');

const mythologies = [
    { title: "Herkül'ün Uyanışı", desc: "Olimpos'a giden yolda ilk adımını at, taşları eşleştirerek gücünü kanıtla!" },
    { title: "Kiklop Mağarası", desc: "Tek gözlü devin dikkatini dağıtmak için hızlıca mücevherleri patlat." },
    { title: "Minotor'un Labirenti", desc: "Karanlık dehlizlerde yolunu bulmak için zekanı kullan ve engelleri aş." },
    { title: "Medusa'nın Gözyaşları", desc: "Taşa dönmemek için sihirli yakutları toplayarak kalkanını güçlendir." },
    { title: "Pegasus'un Kanatları", desc: "Gökyüzüne yükselmek için aynı renkteki rüzgar taşlarını bir araya getir." },
    { title: "İkarus'un Düşüşü", desc: "Güneşe çok yaklaşmadan hedefine ulaşmaya çalış, hamlelerini dikkatli seç." },
    { title: "Nemea Aslanı", desc: "Yenilmez postu aşmak için büyük kombolar yaparak aslanı dize getir." },
    { title: "Lerna Ejderhası", desc: "Kesilen her başın yerine iki tane çıkmadan seri eşleştirmeler yap." },
    { title: "Erymanthos Yaban Domuzu", desc: "Öfkeli canavarı yormak için tahtadaki toprak elementlerini temizle." },
    { title: "Hades'in Kapıları (BOSS)", desc: "Yeraltı dünyasının lordunu geçmek için en büyük Zeus patlamalarını tetikle!" },
    
    { title: "Styx Nehri", desc: "Kayıp ruhları karşıya geçirmek için nehrin akışını kontrol eden kristalleri bul." },
    { title: "Kerberos'un Üç Başı", desc: "Cehennem tazısını sakinleştirmek için üçlü kombolarla et parçaları topla." },
    { title: "Tartarus'un Derinlikleri", desc: "Karanlık hapishaneden kaçmak için zincirli taşların kilidini kır." },
    { title: "Titanların Ayaklanması", desc: "Kadim devlerin öfkesini dindirmek için element dengesini sağla." },
    { title: "Atlas'ın Yükü", desc: "Dünyanın ağırlığını hafifletmek için tahtanın altındaki kaya taşlarını yok et." },
    { title: "Prometheus'un Ateşi", desc: "İnsanlığa ateşi ulaştırmak için buzlu taşları erit." },
    { title: "Pandora'nın Kutusu", desc: "Kutudan çıkan kötülükleri geri hapsetmek için hızlı ve keskin oyna." },
    { title: "Sirenlerin Şarkısı", desc: "Büyülü sese aldanmamak için mavi safirleri toplayıp zihnini koru." },
    { title: "Scylla ve Charybdis", desc: "İki canavar arasından gemini sağ salim geçirmek için orta sütunu temizle." },
    { title: "Poseidon'un Öfkesi (BOSS)", desc: "Denizler tanrısının fırtınalarını dindirmek için üçlü eşleştirmelerle okyanusu sakinleştir!" },
    
    { title: "Apollon'un Liri", desc: "Altın telleri titreterek melodiyi tamamla ve güneşin doğmasını sağla." },
    { title: "Artemis'in Yayı", desc: "Ormanın derinliklerinde gümüş okları toplayarak avını yakala." },
    { title: "Ares'in Savaş Arabası", desc: "Savaş alanında kaos yaratmak için kırmızı yakutlarla zincirleme patlamalar yap." },
    { title: "Afrodit'in Güzelliği", desc: "Aşk tanrıçasını etkilemek için en parlak pembe elmasları bir araya getir." },
    { title: "Hermes'in Kanatlı Sandaletleri", desc: "Haberci tanrıya yetişmek için en az hamleyle en yüksek puanı topla." },
    { title: "Hephaistos'un Örsü", desc: "Ateş ve metali döverek yeni efsanevi silahlar yaratmak için taşları erit." },
    { title: "Demeter'in Bereketi", desc: "Kurak toprakları yeşertmek için zümrütleri toplayıp doğayı canlandır." },
    { title: "Dionysos'un Şöleni", desc: "Kutlamalara katılmak için mor ametistleri toplayıp neşeyi artır." },
    { title: "Athena'nın Zekası", desc: "Baykuşun bilgeliğiyle karmaşık bulmacaları stratejik hamlelerle çöz." },
    { title: "Zeus'un Yıldırımları (BOSS)", desc: "Tanrıların kralına karşı gücünü kanıtla, gök gürültüsü kombolarıyla tahtayı sars!" },

    { title: "Orpheus'un Hüznü", desc: "Eurydice'yi geri getirmek için karanlık taşları müzik kombolarıyla aydınlat." },
    { title: "Argonautların Seferi", desc: "Altın Post'u bulmak için zorlu denizlerde mücevher haritasını tamamla." },
    { title: "Talos'un Bronz Zırhı", desc: "Devasa metal bekçinin zayıf noktasını bulmak için köşe taşlarını patlat." },
    { title: "Kharon'un Kayığı", desc: "Ölüler nehrini geçmek için altın sikkeleri topla ve kayıkçıya öde." },
    { title: "Midas'ın Dokunuşu", desc: "Her şeyi altına çeviren lanetten kurtulmak için altın taşları normale döndür." },
    { title: "Gorgon'un Bakışı", desc: "Taşlaşmış hücreleri kırmak için etraflarındaki mücevherleri arka arkaya patlat." },
    { title: "Eris'in Altın Elması", desc: "Kaosu önlemek için uyumsuz taşları hızla tahtadan temizle." },
    { title: "Hesperidlerin Bahçesi", desc: "Ölümsüzlük elmalarını koruyan ejderhayı atlatarak meyveleri topla." },
    { title: "Nemesis'in Terazisi", desc: "İlahi adaleti sağlamak için tahtanın sağ ve sol tarafındaki renkleri dengele." },
    { title: "Hades'in Dönüşü (BOSS)", desc: "Yeraltı tanrısı daha güçlü döndü! Tüm özel yeteneklerini kullanarak onu mağlup et!" },

    { title: "Olimpos'un Etekleri", desc: "Zirveye yaklaşırken son engelleri aşmak için en uzun eşleştirme zincirlerini kur." },
    { title: "Kader Tanrıçaları (Moiralar)", desc: "Kader ipliklerini doğru örmek için renk sıralamasına dikkat ederek ilerle." },
    { title: "Uranüs'ün Yıldızları", desc: "Gökyüzünün ilk tanrısına ulaşmak için astral kristalleri topla." },
    { title: "Gaia'nın Kalbi", desc: "Toprak ananın enerjisini hissetmek için yeşil taşlarla büyük patlamalar yarat." },
    { title: "Kronos'un Zamanı", desc: "Zaman daralıyor! Kum saatleri dolmadan hedef puana ulaşmalısın." },
    { title: "Eros'un Okları", desc: "Farklı renkteki taşları birbiriyle eşleştirerek sevgi bağları kur." },
    { title: "Hyperion'un Işığı", desc: "Karanlık bölümleri aydınlatmak için güneş taşlarını patlat." },
    { title: "Nyx'in Gecesi", desc: "Gecenin karanlığında sadece parlayan mücevherleri bularak yolunu çiz." },
    { title: "Elysium Çayırları", desc: "Kahramanların cennetinde huzuru bulmak için son bulmacaları kolayca çöz." },
    { title: "Olimpos'un Zirvesi (GRAND BOSS)", desc: "Tüm tanrıların gücünü test et! Evrenin en güçlü kahramanı olmak için tahtayı paramparça et!" }
];

let levelDataCode = '        const LEVEL_DATA = {\\n';
mythologies.forEach((m, idx) => {
    levelDataCode += `            ${idx + 1}: { title: "${m.title}", desc: "${m.desc}" },\n`;
});
levelDataCode += '        };\n';

let html = fs.readFileSync('Arkenya_Playable_Demo.html', 'utf8');

// Insert LEVEL_DATA right after HEROES definition
if (!html.includes('const LEVEL_DATA')) {
    html = html.replace(/(const HEROES = \{[\s\S]*?\};\n)/, `$1\n${levelDataCode}`);
}

// Write back
fs.writeFileSync('Arkenya_Playable_Demo.html', html);
console.log("LEVEL_DATA injected successfully!");
