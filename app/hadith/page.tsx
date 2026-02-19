'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'

const HADITHS = [
  { id:1, text:"Actions are judged by intentions, and every person will get the reward according to what he has intended.", arabic:"إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ", collection:"Sahih al-Bukhari", number:"1", narrator:"Umar ibn al-Khattab (RA)", topic:"Intentions", grade:"Sahih" },
  { id:2, text:"The strong man is not the one who wrestles others down, but the one who controls himself when angry.", arabic:"لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ", collection:"Sahih al-Bukhari", number:"6116", narrator:"Abu Huraira (RA)", topic:"Anger", grade:"Sahih" },
  { id:3, text:"None of you truly believes until he loves for his brother what he loves for himself.", arabic:"لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", collection:"Sahih al-Bukhari", number:"13", narrator:"Anas ibn Malik (RA)", topic:"Brotherhood", grade:"Sahih" },
  { id:4, text:"Make things easy and do not make them difficult, cheer people up and do not drive them away.", arabic:"يَسِّرُوا وَلَا تُعَسِّرُوا وَبَشِّرُوا وَلَا تُنَفِّرُوا", collection:"Sahih al-Bukhari", number:"69", narrator:"Anas ibn Malik (RA)", topic:"Ease in Religion", grade:"Sahih" },
  { id:5, text:"The best of you are those who learn the Qur'an and teach it.", arabic:"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", collection:"Sahih al-Bukhari", number:"5027", narrator:"Uthman ibn Affan (RA)", topic:"Qur'an", grade:"Sahih" },
  { id:6, text:"Whoever believes in Allah and the Last Day should speak good or remain silent.", arabic:"مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", collection:"Sahih al-Bukhari", number:"6018", narrator:"Abu Huraira (RA)", topic:"Speech", grade:"Sahih" },
  { id:7, text:"The upper hand is better than the lower hand. The upper hand is the one that gives, and the lower hand is the one that takes.", arabic:"الْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلَى", collection:"Sahih al-Bukhari", number:"1427", narrator:"Abdullah ibn Umar (RA)", topic:"Charity", grade:"Sahih" },
  { id:8, text:"Seeking knowledge is an obligation upon every Muslim.", arabic:"طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ", collection:"Sunan Ibn Majah", number:"224", narrator:"Anas ibn Malik (RA)", topic:"Knowledge", grade:"Sahih" },
  { id:9, text:"Smiling at your brother is charity. Enjoining good and forbidding evil is charity.", arabic:"تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ", collection:"Jami at-Tirmidhi", number:"1956", narrator:"Abu Dharr (RA)", topic:"Charity", grade:"Sahih" },
  { id:10, text:"The most beloved deeds to Allah are the most consistent ones, even if they are few.", arabic:"أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ", collection:"Sahih al-Bukhari", number:"6465", narrator:"Aisha (RA)", topic:"Worship", grade:"Sahih" },
  { id:11, text:"Pay the worker his wages before his sweat dries.", arabic:"أَعْطُوا الأَجِيرَ أَجْرَهُ قَبْلَ أَنْ يَجِفَّ عَرَقُهُ", collection:"Sunan Ibn Majah", number:"2443", narrator:"Abdullah ibn Umar (RA)", topic:"Rights", grade:"Hasan" },
  { id:12, text:"Whoever removes a worldly grief from a believer, Allah will remove from him one of the griefs of the Day of Resurrection.", arabic:"مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا", collection:"Sahih Muslim", number:"2699", narrator:"Abu Huraira (RA)", topic:"Helping Others", grade:"Sahih" },
  { id:13, text:"Be in this world as though you were a stranger or a traveller passing through.", arabic:"كُنْ فِي الدُّنْيَا كَأَنَّكَ غَرِيبٌ أَوْ عَابِرُ سَبِيلٍ", collection:"Sahih al-Bukhari", number:"6416", narrator:"Abdullah ibn Umar (RA)", topic:"Zuhd (Asceticism)", grade:"Sahih" },
  { id:14, text:"The halal is clear and the haram is clear, and between them are doubtful matters that most people do not know.", arabic:"الْحَلاَلُ بَيِّنٌ وَالْحَرَامُ بَيِّنٌ", collection:"Sahih al-Bukhari", number:"52", narrator:"Nu'man ibn Bashir (RA)", topic:"Halal & Haram", grade:"Sahih" },
  { id:15, text:"Fear Allah wherever you are, and follow up a bad deed with a good one and it will wipe it out, and behave well towards people.", arabic:"اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ", collection:"Jami at-Tirmidhi", number:"1987", narrator:"Abu Dharr (RA)", topic:"Taqwa", grade:"Hasan Sahih" },
  { id:16, text:"Part of someone's being a good Muslim is his leaving alone that which does not concern him.", arabic:"مِنْ حُسْنِ إِسْلَامِ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ", collection:"Jami at-Tirmidhi", number:"2317", narrator:"Abu Huraira (RA)", topic:"Character", grade:"Hasan" },
  { id:17, text:"The deen (religion) is sincerity. We said: To whom? He said: To Allah, His Book, His Messenger, the Muslim rulers and their common folk.", arabic:"الدِّينُ النَّصِيحَةُ", collection:"Sahih Muslim", number:"55", narrator:"Tamim ad-Dari (RA)", topic:"Sincerity", grade:"Sahih" },
  { id:18, text:"Whoever does not show mercy will not be shown mercy.", arabic:"لَا يَرْحَمُ اللَّهُ مَنْ لَا يَرْحَمُ النَّاسَ", collection:"Sahih al-Bukhari", number:"6013", narrator:"Jarir ibn Abdullah (RA)", topic:"Mercy", grade:"Sahih" },
  { id:19, text:"The world is a prison for the believer and a paradise for the disbeliever.", arabic:"الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ", collection:"Sahih Muslim", number:"2956", narrator:"Abu Huraira (RA)", topic:"Dunya", grade:"Sahih" },
  { id:20, text:"Every act of kindness is charity.", arabic:"كُلُّ مَعْرُوفٍ صَدَقَةٌ", collection:"Sahih al-Bukhari", number:"6021", narrator:"Jabir ibn Abdullah (RA)", topic:"Charity", grade:"Sahih" },
  { id:21, text:"Modesty is part of faith.", arabic:"الْحَيَاءُ مِنَ الإِيمَانِ", collection:"Sahih al-Bukhari", number:"24", narrator:"Ibn Umar (RA)", topic:"Modesty", grade:"Sahih" },
  { id:22, text:"The best of people is the one who benefits people the most.", arabic:"خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ", collection:"Al-Mu'jam al-Awsat", number:"5787", narrator:"Jabir (RA)", topic:"Service", grade:"Hasan" },
  { id:23, text:"A good word is charity.", arabic:"الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ", collection:"Sahih al-Bukhari", number:"2989", narrator:"Abu Huraira (RA)", topic:"Speech", grade:"Sahih" },
  { id:24, text:"Whoever conceals the faults of a Muslim, Allah will conceal his faults in this world and the Hereafter.", arabic:"مَنْ سَتَرَ مُسْلِمًا سَتَرَهُ اللَّهُ فِي الدُّنْيَا وَالآخِرَةِ", collection:"Sahih Muslim", number:"2590", narrator:"Abu Huraira (RA)", topic:"Brotherhood", grade:"Sahih" },
  { id:25, text:"Cleanliness is half of faith.", arabic:"الطُّهُورُ شَطْرُ الإِيمَانِ", collection:"Sahih Muslim", number:"223", narrator:"Abu Malik al-Ashari (RA)", topic:"Purity", grade:"Sahih" },
  { id:26, text:"None of you should make himself vile by being unable to express his grievance.", arabic:"لَا يَجِدُ أَحَدُكُمُ الإِيمَانَ حَتَّى يَكُونَ هَوَاهُ تَبَعًا لِمَا جِئْتُ بِهِ", collection:"Sunan an-Nasa'i", number:"5037", narrator:"Abdullah ibn Amr (RA)", topic:"Rights", grade:"Hasan" },
  { id:27, text:"The best house among the Muslims is the house in which orphans are well treated.", arabic:"خَيْرُ بَيْتٍ فِي الْمُسْلِمِينَ بَيْتٌ فِيهِ يَتِيمٌ يُحْسَنُ إِلَيْهِ", collection:"Sunan Ibn Majah", number:"3679", narrator:"Abu Huraira (RA)", topic:"Orphans", grade:"Sahih" },
  { id:28, text:"Do not be angry, and paradise is yours.", arabic:"لَا تَغْضَبْ وَلَكَ الْجَنَّةُ", collection:"Al-Mu'jam al-Kabir", number:"13646", narrator:"A man (RA)", topic:"Anger", grade:"Sahih" },
  { id:29, text:"Verily, Allah does not look at your appearance or wealth, but He looks at your hearts and actions.", arabic:"إِنَّ اللَّهَ لَا يَنْظُرُ إِلَى صُوَرِكُمْ وَأَمْوَالِكُمْ", collection:"Sahih Muslim", number:"2564", narrator:"Abu Huraira (RA)", topic:"Character", grade:"Sahih" },
  { id:30, text:"Tie your camel, then put your trust in Allah.", arabic:"اعْقِلْهَا وَتَوَكَّلْ", collection:"Jami at-Tirmidhi", number:"2517", narrator:"Anas ibn Malik (RA)", topic:"Tawakkul", grade:"Hasan" },
]

const TOPICS = ['All', ...Array.from(new Set(HADITHS.map(h => h.topic))).sort()]
const GRADE_COLOR: Record<string, string> = { Sahih: '#22c55e', Hasan: '#3b82f6', 'Hasan Sahih': '#8b5cf6' }

export default function HadithPage() {
  const [daily, setDaily] = useState(HADITHS[0])
  const [selected, setSelected] = useState<typeof HADITHS[0] | null>(null)
  const [topic, setTopic] = useState('All')
  const [saved, setSaved] = useState<number[]>([])
  const [view, setView] = useState<'daily' | 'browse'>('daily')

  useEffect(() => {
    // Deterministic daily hadith based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    setDaily(HADITHS[dayOfYear % HADITHS.length])
    const sv = localStorage.getItem('qareen_saved_hadiths')
    if (sv) setSaved(JSON.parse(sv))
  }, [])

  const toggleSave = (id: number) => {
    setSaved(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      localStorage.setItem('qareen_saved_hadiths', JSON.stringify(next))
      return next
    })
  }

  const filtered = HADITHS.filter(h => topic === 'All' || h.topic === topic)

  const HadithCard = ({ h, big = false }: { h: typeof HADITHS[0]; big?: boolean }) => (
    <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5">
      {big && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] uppercase tracking-widest text-[#d4a853]">✦ Hadith of the Day</span>
          <span className="text-[11px] text-[#9ab8a4]">{new Date().toLocaleDateString('en', { weekday:'long', month:'short', day:'numeric' })}</span>
        </div>
      )}
      {/* Arabic */}
      <p className="text-xl leading-loose mb-3 text-right text-[#d4a853]" style={{ fontFamily: 'serif', direction: 'rtl' }}>
        {h.arabic}
      </p>
      {/* Translation */}
      <p className={`text-[#f0ece0] leading-relaxed mb-4 italic ${big ? 'text-[16px]' : 'text-[14px]'}`}>
        "{h.text}"
      </p>
      {/* Meta */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-[12px] text-[#9ab8a4]">{h.collection} #{h.number}</p>
          <p className="text-[11px] text-[#9ab8a4]/60">{h.narrator}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full border"
            style={{ color: GRADE_COLOR[h.grade] || '#9ab8a4', border: `1px solid ${GRADE_COLOR[h.grade] || '#9ab8a4'}` + '44', background: (GRADE_COLOR[h.grade] || '#9ab8a4') + '11' }}>
            {h.grade}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#142d1e] border border-[#1e4a2e] text-[#9ab8a4]">{h.topic}</span>
          <button onClick={() => toggleSave(h.id)} className="text-lg" title={saved.includes(h.id) ? 'Unsave' : 'Save'}>
            {saved.includes(h.id) ? '🔖' : '🏳️'}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a1f14]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10 pb-28">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="text-4xl mb-2">📜</div>
            <h1 className="font-display text-[clamp(2rem,5vw,3rem)] text-[#f0ece0]">Hadith Collection</h1>
            <p className="text-[#9ab8a4] text-[13px]">{HADITHS.length} authentic hadiths</p>
          </div>
          <div className="flex gap-2">
            {(['daily','browse'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className="px-4 py-1.5 rounded-full text-[13px] border capitalize transition-all"
                style={{ background: view===v ? '#d4a85322' : '#0f2d1c', border: `1px solid ${view===v ? '#d4a853' : '#1e4a2e'}`, color: view===v ? '#d4a853' : '#9ab8a4' }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === 'daily' && (
          <div className="space-y-4">
            <HadithCard h={daily} big />
            <div className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-xl p-4">
              <p className="text-[11px] text-[#9ab8a4] uppercase tracking-widest mb-2">Reflection</p>
              <p className="text-[13px] text-[#9ab8a4] leading-relaxed">
                Take a moment to reflect on this hadith. How can you apply it in your life today? 
                Share it with a friend or family member as a reminder — the Prophet ﷺ said: "Convey from me, even if it is one verse."
              </p>
            </div>
            <button onClick={() => setView('browse')}
              className="w-full py-3 rounded-xl text-[14px] text-[#9ab8a4] border border-[#1e4a2e] hover:text-[#f0ece0] transition-all">
              Browse All Hadiths →
            </button>
          </div>
        )}

        {view === 'browse' && (
          <>
            {/* Topic filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
              {TOPICS.map(t => (
                <button key={t} onClick={() => setTopic(t)}
                  className="shrink-0 px-3 py-1.5 rounded-full text-[11px] border transition-all"
                  style={{ background: topic===t ? '#d4a85322' : '#0f2d1c', border: `1px solid ${topic===t ? '#d4a853' : '#1e4a2e'}`, color: topic===t ? '#d4a853' : '#9ab8a4' }}>
                  {t}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {filtered.map(h => <HadithCard key={h.id} h={h} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
