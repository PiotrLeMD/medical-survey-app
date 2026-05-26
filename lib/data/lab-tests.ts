export interface LabTest {
  id: number
  nazwa: string
  cena_wew: number
  cena_rynk: number
  opis: string
}

export const labTests: LabTest[] = [
  { id: 8, nazwa: "Morfologia krwi", cena_wew: 6.44, cena_rynk: 27.0, opis: "Podstawowe badanie oceniające ogólną kondycję organizmu. Pozwala wykryć m.in. anemię, ukryte stany zapalne oraz osłabienie odporności." },
  { id: 9, nazwa: "D-dimer. ilościowo", cena_wew: 32.0, cena_rynk: 83.0, opis: "Wskaźnik krzepliwości krwi. Bada ryzyko powstawania zakrzepów w naczyniach krwionośnych." },
  { id: 10, nazwa: "Sód", cena_wew: 4.4, cena_rynk: 26.3, opis: "Jeden z najważniejszych elektrolitów. Reguluje gospodarkę wodną i ciśnienie krwi." },
  { id: 11, nazwa: "Lipidogram", cena_wew: 12.6, cena_rynk: 78.8, opis: "Kompletny profil cholesterolowy. Absolutny fundament profilaktyki zawałów i udarów." },
  { id: 12, nazwa: "Próby wątrobowe", cena_wew: 18.6, cena_rynk: 115.5, opis: "Pakiet oceniający pracę i obciążenie wątroby." },
  { id: 21, nazwa: "Lipaza", cena_wew: 9.0, cena_rynk: 46.6, opis: "Główny enzym trawienny trzustki. Służy do bardzo precyzyjnego wykrywania stanów zapalnych." },
  { id: 24, nazwa: "Mocznik", cena_wew: 4.4, cena_rynk: 26.3, opis: "Produkt uboczny metabolizmu białek. Pokazuje, jak dobrze Twoje nerki filtrują krew." },
  { id: 25, nazwa: "Kreatynina", cena_wew: 4.4, cena_rynk: 26.3, opis: "Najważniejszy wskaźnik pracy nerek." },
  { id: 26, nazwa: "Kwas moczowy", cena_wew: 4.8, cena_rynk: 28.4, opis: "Jego nadmiar krystalizuje się w stawach powodując bolesną dnę moczanową." },
  { id: 28, nazwa: "Wapń całkowity", cena_wew: 4.4, cena_rynk: 26.3, opis: "Kluczowy dla mocnych kości, zębów oraz prawidłowej pracy serca i mięśni." },
  { id: 29, nazwa: "Żelazo", cena_wew: 4.4, cena_rynk: 26.3, opis: "Niezbędne do produkcji czerwonych krwinek i transportu tlenu." },
  { id: 30, nazwa: "Magnez", cena_wew: 4.4, cena_rynk: 26.3, opis: "Pierwiastek antystresowy. Wpływa na pracę mózgu, mięśni i serca." },
  { id: 39, nazwa: "Hemoglobina glikowana (HbA1c)", cena_wew: 16.0, cena_rynk: 62.0, opis: "Złoty standard w profilaktyce i diagnozowaniu cukrzycy." },
  { id: 43, nazwa: "TSH", cena_wew: 10.4, cena_rynk: 47.3, opis: "Najważniejsze badanie przesiewowe tarczycy." },
  { id: 44, nazwa: "fT3", cena_wew: 10.4, cena_rynk: 47.3, opis: "Aktywny hormon tarczycy, zarządza tempem przemiany materii." },
  { id: 45, nazwa: "fT4", cena_wew: 10.4, cena_rynk: 47.3, opis: "Główny hormon uwalniany przez tarczycę." },
  { id: 46, nazwa: "anty-TPO", cena_wew: 18.0, cena_rynk: 67.2, opis: "Badanie przeciwciał, kluczowe w diagnostyce choroby Hashimoto." },
  { id: 47, nazwa: "anty-TG", cena_wew: 18.0, cena_rynk: 67.2, opis: "Wskaźnik chorób autoimmunologicznych tarczycy." },
  { id: 51, nazwa: "Ferrytyna", cena_wew: 17.0, cena_rynk: 59.9, opis: "Pokazuje realne zmagazynowanie żelaza w organizmie." },
  { id: 52, nazwa: "Witamina B12", cena_wew: 20.0, cena_rynk: 71.4, opis: "Kluczowa dla układu nerwowego i pamięci." },
  { id: 53, nazwa: "Kwas foliowy", cena_wew: 20.0, cena_rynk: 71.4, opis: "Odpowiada za podział komórek i pracę układu nerwowego." },
  { id: 54, nazwa: "Witamina D3", cena_wew: 35.0, cena_rynk: 110.3, opis: "Hormon odporności, mocnych kości i dobrego nastroju." },
  { id: 59, nazwa: "Testosteron całkowity", cena_wew: 15.0, cena_rynk: 54.6, opis: "Główny hormon męski." },
  { id: 64, nazwa: "PSA całkowity", cena_wew: 18.0, cena_rynk: 62.0, opis: "Marker przerostu i raka prostaty." },
  { id: 78, nazwa: "CRP", cena_wew: 11.0, cena_rynk: 38.9, opis: "Najszybszy wskaźnik toczącego się w organizmie stanu zapalnego." },
  { id: 81, nazwa: "Borelioza IgG", cena_wew: 180.0, cena_rynk: 232.7, opis: "Potwierdzenie późnej infekcji odkleszczowej." },
  { id: 84, nazwa: "IgE całkowite", cena_wew: 30.0, cena_rynk: 56.1, opis: "Podstawowy parametr określający ogólną tendencję do alergii." }
]

export function getLabTestById(id: number): LabTest | undefined {
  return labTests.find(test => test.id === id)
}

export function getLabTestsByIds(ids: number[]): LabTest[] {
  return labTests.filter(test => ids.includes(test.id))
}
