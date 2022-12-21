import { Badge, Divider, List, Stack, Text } from "@mantine/core";

const labelSwitch = {
  fix: "blue",
  feature: "green",
  note: "orange",
  next: "lime",
};

const Note = ({ version, texts }) => {
  return (
    <Stack spacing={20}>
      <Text variant="h4" weight={"bold"} size={20}>
        v{version}
      </Text>
      {texts.map((t) => {
        return (
          <Stack align={"start"}>
            <Badge color={labelSwitch[t.label]}>{t.label}</Badge>
            <List listStyleType="disc" sx={{ rowGap: 20 }}>
              {t.lines.map((tl, i) => (
                <List.Item
                  p={2}
                  sx={{
                    width: "90%",
                    color: "#212121",
                  }}
                >
                  <Text weight={i % 2 ? "bold" : "normal"}>{tl}</Text>
                </List.Item>
              ))}
            </List>
          </Stack>
        );
      })}
    </Stack>
  );
};

const Notes = () => {
  const notes = [
    {
      version: "0.2.3",
      texts: [
        {
          label: "feature",
          lines: [
            "Tablonun tasarımı değiştirildi.",
            "Tablo için virgülden sonra basamak ayarlanılabilecek bir input eklenildi.",
            "Result lara datasetlerin k sı eklenildi.",
            "Klasörün tüm içeriğini seçebilmek için yeni bir switch eklenildi.",
          ],
        },
        {
          label: "fix",
          lines: [
            "Flowcard da seçilen dosyalarla ilgili aynı dosyanın iki kere seçilmesine sebep olan bir hata giderildi",
          ],
        },
        {
          label: "next",
          lines: [
            "Main.py dosyasının mutate edilmesini sağlayabilecek yeni bir arayüz üzerinde çalışılıyor.",
          ],
        },
      ],
    },
    {
      version: "0.2.2",
      texts: [
        {
          label: "fix",
          lines: [
            "Datasetler için geçerli K nın tanımlanmasından dolayı doğan bir crash hatası giderildi",
          ],
        },
      ],
    },
    {
      version: "0.2.1",
      texts: [
        {
          label: "feature",
          lines: ["Tablolar için görsel düzenleme yapıldı."],
        },
        {
          label: "next",
          lines: [
            "Uygulama içine gömülü olan main.py dosyasının bir kopyasının düzenlenilip deneysel olarak kullanılabilmesi sağlanılması planlanıyor. DUE: 20.12.2022",
          ],
        },

        {
          label: "fix",
          lines: [
            "Daha önce uygulamanın ayarlar bölümünden seçilen bir klasör okunamamışsa (file system hatası) uygulamanın crash vermesine sebep olan bir hata giderildi.",
            "Minör optimizasyonlar",
          ],
        },
      ],
    },
    {
      version: "0.2.0",
      texts: [
        {
          label: "feature",
          lines: [
            "Kullanıcı Arayüzü modernleştirildi. Aşina olunan tasarımsal trendler kullanıldı",
            "Uygulama yapısı nerdeyse baştan tasarlanıldı.",
            "Output: Sonuçları ve Seçilen Argümanları gösteren yeni sekmeler eklenildi",
            "Normalization Seçmeyi zorunlu kılma devre dışı bırakıldı. Eğer hiç bir normalizasyon seçilmemişse uygulamanın sağlıklı bir şekilde çalışmaya devam etmesi sağlanıldı.",
            "Yeni bir normalizasyon tipi uygulama içine gömülü dosyalarca düzenlenildi. Artık hiç bir normalizasyon olmadan da kmeansin çalışması desteklendi.",
            "Sonunda sayı bulunan datasetler için bu sayı K olarak varsayılarak uygulama içi gömülü python kodlarında bu k nın kullanılması sağlanıldı. Eğer k belirtilmemişse 3 olacak şekilde ilerlemesi sağlanıldı",
          ],
        },
        {
          label: "next",
          lines: [
            "Her bir database için uygulama üzerinden k girilebilecek yeni bir ayar düşünülüyor.",
            "UX geliştirmeleri yapılması planlanılıyor",
          ],
        },

        {
          label: "fix",
          lines: [
            "Uygulamanın dosyaları gömülü bir şekilde kullanmasına bağlı olarak python kodları immutable hale getirmesini sağlayan bir hata giderildi.",
          ],
        },
      ],
    },
    {
      version: "0.1.17",
      texts: [
        {
          label: "feature",
          lines: ["Added help menu", "Added testing for dependencies"],
        },
        {
          label: "next",
          lines: ["Fixing not installed dependencies from the GUI"],
        },
      ],
    },
    {
      version: "0.1.16",
      texts: [
        {
          label: "fix",
          lines: ["An issue that prevents to open app in windows"],
        },
      ],
    },
  ];

  return (
    <Stack spacing={60}>
      {notes.map((n, i) => (
        <>
          <Note {...n} />
          {i !== notes.length - 1 && <Divider />}
        </>
      ))}
    </Stack>
  );
};

export default Notes;
