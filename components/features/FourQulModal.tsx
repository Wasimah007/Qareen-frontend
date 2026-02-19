'use client'
import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react'

const FOUR_QUL = [
  {
    number: 109,
    name: 'Al-Kafirun',
    arabic_name: 'الكافرون',
    meaning: 'The Disbelievers',
    arabic: `قُلْ يَٰٓأَيُّهَا ٱلْكَٰفِرُونَ
لَآ أَعْبُدُ مَا تَعْبُدُونَ
وَلَآ أَنتُمْ عَٰبِدُونَ مَآ أَعْبُدُ
وَلَآ أَنَا۠ عَابِدٌ مَّا عَبَدتُّمْ
وَلَآ أَنتُمْ عَٰبِدُونَ مَآ أَعْبُدُ
لَكُمْ دِينُكُمْ وَلِىَ دِينِ`,
    transliteration: `Qul yā ayyuhal-kāfirūn
Lā a'budu mā ta'budūn
Wa lā antum 'ābidūna mā a'bud
Wa lā ana 'ābidum mā 'abadtum
Wa lā antum 'ābidūna mā a'bud
Lakum dīnukum wa liya dīn`,
    translation: `Say, "O disbelievers,
I do not worship what you worship.
Nor are you worshippers of what I worship.
Nor will I be a worshipper of what you worship.
Nor will you be worshippers of what I worship.
For you is your religion, and for me is my religion."`,
    benefit: 'Protection from shirk. Equal to reciting one-quarter of the Qur\'an. Recommended before sleep to die on Tawheed.',
    source: 'Jami at-Tirmidhi 2894',
  },
  {
    number: 112,
    name: 'Al-Ikhlas',
    arabic_name: 'الإخلاص',
    meaning: 'Sincerity / Purity of Faith',
    arabic: `قُلْ هُوَ ٱللَّهُ أَحَدٌ
ٱللَّهُ ٱلصَّمَدُ
لَمْ يَلِدْ وَلَمْ يُولَدْ
وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ`,
    transliteration: `Qul huwa Allāhu aḥad
Allāhu ṣ-ṣamad
Lam yalid wa lam yūlad
Wa lam yakul lahū kufuwan aḥad`,
    translation: `Say, "He is Allah, [who is] One,
Allah, the Eternal Refuge.
He neither begets nor is born,
Nor is there to Him any equivalent."`,
    benefit: 'Equals one-third of the Qur\'an in reward. Whoever recites it 3 times before sleeping, it is as if they recited the entire Qur\'an.',
    source: 'Sahih al-Bukhari 5013',
  },
  {
    number: 113,
    name: 'Al-Falaq',
    arabic_name: 'الفلق',
    meaning: 'The Daybreak',
    arabic: `قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ
مِن شَرِّ مَا خَلَقَ
وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ
وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ
وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ`,
    transliteration: `Qul a'ūdhu bi-rabbi l-falaq
Min sharri mā khalaq
Wa min sharri ghāsiqin idhā waqab
Wa min sharrin-naffāthāti fil-'uqad
Wa min sharri ḥāsidin idhā ḥasad`,
    translation: `Say, "I seek refuge in the Lord of daybreak
From the evil of that which He created
And from the evil of darkness when it settles
And from the evil of the blowers in knots
And from the evil of an envier when he envies."`,
    benefit: 'Protection from evil, black magic, envy, and harm. The Prophet ﷺ used to recite this every night before sleeping.',
    source: 'Sahih al-Bukhari 5017',
  },
  {
    number: 114,
    name: 'An-Nas',
    arabic_name: 'الناس',
    meaning: 'Mankind',
    arabic: `قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ
مَلِكِ ٱلنَّاسِ
إِلَٰهِ ٱلنَّاسِ
مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ
ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ
مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ`,
    transliteration: `Qul a'ūdhu bi-rabbi n-nās
Maliki n-nās
Ilāhi n-nās
Min sharril-waswāsil-khannās
Alladhī yuwaswisu fī ṣudūrin-nās
Minal-jinnati wan-nās`,
    translation: `Say, "I seek refuge in the Lord of mankind,
The Sovereign of mankind,
The God of mankind,
From the evil of the retreating whisperer —
Who whispers [evil] into the breasts of mankind —
From among the jinn and mankind."`,
    benefit: 'Protection from waswasa (whispering of Shaytan), evil jinn, and bad people. Special protection before sleep and after Fajr & Maghrib.',
    source: 'Sahih al-Bukhari 5017',
  },
]

interface Props {
  onClose: () => void
}

export default function FourQulModal({ onClose }: Props) {
  const [idx, setIdx] = useState(0)
  const [showTranslit, setShowTranslit] = useState(true)
  const [showTrans, setShowTrans] = useState(true)
  const surah = FOUR_QUL[idx]

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const prev = () => setIdx(i => Math.max(0, i - 1))
  const next = () => setIdx(i => Math.min(FOUR_QUL.length - 1, i + 1))

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>

      {/* Card */}
      <div className="w-full sm:max-w-lg max-h-[95vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
        style={{ background: '#0a1f14', border: '1px solid #1e4a2e', boxShadow: '0 0 60px rgba(212,168,83,0.1)' }}>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-[#1e4a2e]"
          style={{ background: '#0a1f14' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-bold"
              style={{ background: 'linear-gradient(135deg,#2d9e5f,#d4a853)' }}>
              {idx + 1}
            </div>
            <div>
              <p className="text-[#f0ece0] font-medium text-[15px]">{surah.name}</p>
              <p className="text-[#9ab8a4] text-[11px]">Surah {surah.number} · {surah.meaning}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-full text-[#9ab8a4] hover:text-[#f0ece0] hover:bg-[#1e4a2e] transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 justify-center pt-4 px-5">
          {FOUR_QUL.map((s, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className="transition-all rounded-full h-2"
              style={{ width: i === idx ? 24 : 8, background: i === idx ? '#d4a853' : '#1e4a2e' }} />
          ))}
        </div>

        {/* Surah name Arabic */}
        <div className="text-center px-5 py-4">
          <p className="text-3xl text-[#d4a853] mb-1" style={{ fontFamily: 'var(--font-noto-arabic, serif)' }}>
            {surah.arabic_name}
          </p>
          <p className="text-[11px] text-[#9ab8a4] uppercase tracking-widest">الجزء الأخير — Juz Amma</p>
        </div>

        {/* Bismillah */}
        <div className="mx-5 mb-4 text-center p-3 rounded-xl" style={{ background: '#0f2d1c', border: '1px solid #1e4a2e' }}>
          <p className="text-2xl text-[#d4a853]" style={{ fontFamily: 'var(--font-noto-arabic, serif)', direction: 'rtl' }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>

        {/* Arabic text */}
        <div className="mx-5 mb-4 p-5 rounded-2xl" style={{ background: '#0f2d1c', border: '1px solid #1e4a2e' }}>
          <p className="text-2xl leading-[2.2] text-right text-[#f0ece0]"
            style={{ fontFamily: 'var(--font-noto-arabic, serif)', direction: 'rtl', lineHeight: '2.5' }}>
            {surah.arabic}
          </p>
        </div>

        {/* Transliteration */}
        {showTranslit && (
          <div className="mx-5 mb-3 p-4 rounded-xl" style={{ background: '#142d1e', border: '1px solid #1e4a2e' }}>
            <p className="text-[10px] text-[#d4a853] uppercase tracking-widest mb-2">Transliteration</p>
            <p className="text-[13px] text-[#9ab8a4] leading-relaxed italic whitespace-pre-line">{surah.transliteration}</p>
          </div>
        )}

        {/* Translation */}
        {showTrans && (
          <div className="mx-5 mb-3 p-4 rounded-xl" style={{ background: '#142d1e', border: '1px solid #1e4a2e' }}>
            <p className="text-[10px] text-[#d4a853] uppercase tracking-widest mb-2">Translation</p>
            <p className="text-[13px] text-[#f0ece0] leading-relaxed whitespace-pre-line">{surah.translation}</p>
          </div>
        )}

        {/* Toggle buttons */}
        <div className="flex gap-2 mx-5 mb-3">
          <button onClick={() => setShowTranslit(s => !s)}
            className="flex-1 py-2 rounded-lg text-[11px] border transition-all"
            style={{ background: showTranslit ? '#d4a85322' : '#0f2d1c', border: `1px solid ${showTranslit ? '#d4a853' : '#1e4a2e'}`, color: showTranslit ? '#d4a853' : '#9ab8a4' }}>
            {showTranslit ? '✓ ' : ''}Transliteration
          </button>
          <button onClick={() => setShowTrans(s => !s)}
            className="flex-1 py-2 rounded-lg text-[11px] border transition-all"
            style={{ background: showTrans ? '#d4a85322' : '#0f2d1c', border: `1px solid ${showTrans ? '#d4a853' : '#1e4a2e'}`, color: showTrans ? '#d4a853' : '#9ab8a4' }}>
            {showTrans ? '✓ ' : ''}Translation
          </button>
        </div>

        {/* Benefit */}
        <div className="mx-5 mb-4 border-l-[3px] border-[#2d9e5f] pl-4 py-2">
          <p className="text-[10px] text-[#2d9e5f] uppercase tracking-widest mb-1">✦ Benefit</p>
          <p className="text-[12px] text-[#9ab8a4] leading-relaxed">{surah.benefit}</p>
          <p className="text-[10px] text-[#9ab8a4]/50 mt-1">— {surah.source}</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 px-5 pb-6">
          <button onClick={prev} disabled={idx === 0}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-[14px] transition-all disabled:opacity-30"
            style={{ border: '1px solid #1e4a2e', color: '#9ab8a4' }}>
            <ChevronLeft size={16} /> Prev
          </button>
          {idx < FOUR_QUL.length - 1
            ? <button onClick={next}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-medium text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#2d9e5f,#3ec97a)' }}>
                Next <ChevronRight size={16} />
              </button>
            : <button onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-medium text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#d4a853,#c9943b)' }}>
                Done ✓
              </button>
          }
        </div>
      </div>
    </div>
  )
}

export { FOUR_QUL }
