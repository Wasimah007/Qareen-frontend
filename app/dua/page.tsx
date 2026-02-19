'use client'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'

const DUAS = [
  { id:1,  title:"Dua for Anxiety & Worry",    cat:"Mental Health",    arabic:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ", transliteration:"Allahumma inni a'udhu bika minal-hammi wal-hazan", meaning:"O Allah, I seek refuge in You from worry and grief, from weakness and laziness, from miserliness and cowardice, from being overcome by debt and from being overpowered by men.", source:"Sahih al-Bukhari 6369" },
  { id:2,  title:"Dua Before Sleeping",         cat:"Daily",            arabic:"بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", transliteration:"Bismika Allahumma amutu wa ahya", meaning:"In Your name, O Allah, I die and I live.", source:"Sahih al-Bukhari 6324" },
  { id:3,  title:"Dua Upon Waking",             cat:"Daily",            arabic:"الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", transliteration:"Alhamdulillahilladhi ahyana ba'da ma amatana wa ilayhin-nushur", meaning:"All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.", source:"Sahih al-Bukhari 6325" },
  { id:4,  title:"Dua for Entering Home",       cat:"Daily",            arabic:"بِسْمِ اللهِ وَلَجْنَا وَبِسْمِ اللهِ خَرَجْنَا وَعَلَى اللهِ رَبِّنَا تَوَكَّلْنَا", transliteration:"Bismillahi walajna wa bismillahi kharajna wa 'ala Allahi rabbina tawakkalna", meaning:"In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we place our trust.", source:"Abu Dawud 5096" },
  { id:5,  title:"Dua for Forgiveness (Sayyid al-Istighfar)", cat:"Forgiveness", arabic:"اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ", transliteration:"Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana 'abduk", meaning:"O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant.", source:"Sahih al-Bukhari 6306" },
  { id:6,  title:"Dua for Istikhara",           cat:"Decisions",        arabic:"اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ", transliteration:"Allahumma inni astakhiruka bi'ilmika", meaning:"O Allah, I seek Your guidance by Your knowledge, and I seek ability through Your power, and I ask You from Your great bounty.", source:"Sahih al-Bukhari 1166" },
  { id:7,  title:"Dua for Increase in Knowledge", cat:"Knowledge",      arabic:"رَّبِّ زِدْنِي عِلْمًا", transliteration:"Rabbi zidni 'ilma", meaning:"My Lord, increase me in knowledge.", source:"Qur'an 20:114" },
  { id:8,  title:"Dua for Entering Masjid",     cat:"Worship",          arabic:"اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", transliteration:"Allahumma iftah li abwaba rahmatik", meaning:"O Allah, open the gates of Your mercy for me.", source:"Sahih Muslim 713" },
  { id:9,  title:"Dua When Angry",              cat:"Mental Health",    arabic:"أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ", transliteration:"A'udhu billahi minash-shaytanir-rajeem", meaning:"I seek refuge in Allah from the accursed Shaytan.", source:"Sahih al-Bukhari 3282" },
  { id:10, title:"Dua for Parents",             cat:"Family",           arabic:"رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", transliteration:"Rabbi irhamhuma kama rabbayani sagheera", meaning:"My Lord, have mercy upon them as they brought me up when I was small.", source:"Qur'an 17:24" },
  { id:11, title:"Dua for Rizq (Provision)",    cat:"Wealth",           arabic:"اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ", transliteration:"Allahumma-kfini bi halalika 'an haramika", meaning:"O Allah, suffice me with what is halal so that I have no need for what is haram.", source:"Jami at-Tirmidhi 3563" },
  { id:12, title:"Dua for Sadness & Depression", cat:"Mental Health",   arabic:"لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ", transliteration:"La ilaha illallahul 'Azimul Halim, la ilaha illallahu Rabbul 'arshil 'azim", meaning:"There is no god but Allah, the Magnificent, the Forbearing. There is no god but Allah, Lord of the Magnificent Throne.", source:"Sahih al-Bukhari 6346" },
  { id:13, title:"Dua for Debt",                cat:"Wealth",           arabic:"اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ", transliteration:"Allahumma-kfini bi halalika 'an haramika wa aghnini bi fadlika 'amman siwak", meaning:"O Allah, make what is halal sufficient for me and free me from what is haram, and make me independent from all others besides You.", source:"Jami at-Tirmidhi 3563" },
  { id:14, title:"Dua When Starting to Eat",    cat:"Daily",            arabic:"بِسْمِ اللَّهِ", transliteration:"Bismillah", meaning:"In the name of Allah.", source:"Abu Dawud 3767" },
  { id:15, title:"Dua After Eating",            cat:"Daily",            arabic:"الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ", transliteration:"Alhamdulillahilladhi at'amani hadha wa razaqanihi", meaning:"All praise is for Allah who fed me this and provided it for me.", source:"Abu Dawud 4023" },
  { id:16, title:"Dua for Sickness",            cat:"Health",           arabic:"اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ اشْفِهِ وَأَنْتَ الشَّافِي", transliteration:"Allahumma Rabban-nasi, adhhibil-ba'sa, washfi antash-Shafi", meaning:"O Allah, Lord of mankind, remove this disease and cure him, You are the Healer.", source:"Sahih al-Bukhari 5743" },
  { id:17, title:"Dua for Travelling",          cat:"Travel",           arabic:"سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ", transliteration:"Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinin", meaning:"Glory be to Him who has subjected this to us, and we were not capable of that.", source:"Qur'an 43:13" },
  { id:18, title:"Dua for Marriage",            cat:"Family",           arabic:"بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ", transliteration:"Barak Allahu laka wa baraka 'alayka wa jama'a baynakuma fi khayr", meaning:"May Allah bless you and shower His blessings upon you, and join you together in goodness.", source:"Abu Dawud 2130" },
]

const CATS = ['All', ...Array.from(new Set(DUAS.map(d => d.cat))).sort()]

export default function DuaPage() {
  const [cat, setCat] = useState('All')
  const [saved, setSaved] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('qareen_saved_duas') || '[]') } catch { return [] }
  })
  const [copied, setCopied] = useState<number | null>(null)

  const toggleSave = (id: number) => {
    setSaved(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      localStorage.setItem('qareen_saved_duas', JSON.stringify(next))
      return next
    })
  }

  const copyDua = (dua: typeof DUAS[0]) => {
    navigator.clipboard.writeText(`${dua.arabic}\n\n${dua.transliteration}\n\nMeaning: ${dua.meaning}\n\nSource: ${dua.source}`)
    setCopied(dua.id)
    setTimeout(() => setCopied(null), 2000)
  }

  const filtered = DUAS.filter(d => cat === 'All' || d.cat === cat)

  return (
    <div className="min-h-screen bg-[#0a1f14]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10 pb-28">
        <div className="mb-8">
          <div className="text-4xl mb-3">🤲</div>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] text-[#f0ece0] mb-1">Dua Collection</h1>
          <p className="text-[#9ab8a4] text-[13px]">{DUAS.length} authentic duas from Qur'an & Sunnah</p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className="shrink-0 px-3 py-1.5 rounded-full text-[11px] border transition-all"
              style={{ background: cat===c ? '#d4a85322' : '#0f2d1c', border:`1px solid ${cat===c ? '#d4a853' : '#1e4a2e'}`, color: cat===c ? '#d4a853' : '#9ab8a4' }}>
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map(dua => (
            <div key={dua.id} className="bg-[#0f2d1c] border border-[#1e4a2e] rounded-2xl p-5 hover:border-[#d4a853]/20 transition-all">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-[#f0ece0] font-medium text-[14px] mb-0.5">{dua.title}</p>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#142d1e] border border-[#1e4a2e] text-[#9ab8a4]">{dua.cat}</span>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => copyDua(dua)}
                    className="p-1.5 rounded-lg text-[#9ab8a4] hover:text-[#f0ece0] transition-colors text-[12px]">
                    {copied === dua.id ? '✓' : '📋'}
                  </button>
                  <button onClick={() => toggleSave(dua.id)}
                    className="p-1.5 rounded-lg text-[#9ab8a4] hover:text-[#d4a853] transition-colors">
                    {saved.includes(dua.id) ? '🔖' : '🏳️'}
                  </button>
                </div>
              </div>

              {/* Arabic */}
              <p className="text-[#d4a853] text-xl leading-loose text-right mb-3" style={{ fontFamily:'serif', direction:'rtl' }}>
                {dua.arabic}
              </p>

              {/* Transliteration */}
              <p className="text-[#9ab8a4] text-[12px] italic mb-2">{dua.transliteration}</p>

              {/* Meaning */}
              <p className="text-[#f0ece0] text-[13px] leading-relaxed mb-3">{dua.meaning}</p>

              {/* Source */}
              <p className="text-[11px] text-[#9ab8a4]/60">— {dua.source}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
