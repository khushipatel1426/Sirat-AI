/**
 * SIRATAI VERIFIED REPOSITORIES & KNOWLEDGE DATASETS
 * Authentic Quranic verses, Sahih Hadith, Duas, Adhkar, Learning Paths & Knowledge Graph Nodes
 */

const SIRAT_DATA = {
  // Surah List & Ayahs
  surahs: [
    {
      id: 1,
      name: "Al-Fatihah",
      arabic: "الفاتحة",
      meaning: "The Opening",
      versesCount: 7,
      revelation: "Meccan",
      ayahs: [
        {
          number: 1,
          arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          transliteration: "Bismillāhir-Raḥmānir-Raḥīm",
          translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
          reference: "1:1"
        },
        {
          number: 2,
          arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
          transliteration: "Al-ḥamdu lillāhi Rabbil-'ālamīn",
          translation: "[All] praise is [due] to Allah, Lord of the worlds.",
          reference: "1:2"
        },
        {
          number: 3,
          arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
          transliteration: "Ar-Raḥmānir-Raḥīm",
          translation: "The Entirely Merciful, the Especially Merciful,",
          reference: "1:3"
        },
        {
          number: 4,
          arabic: "مَالِكِ يَوْمِ الدِّينِ",
          transliteration: "Māliki Yawmid-Dīn",
          translation: "Sovereign of the Day of Recompense.",
          reference: "1:4"
        },
        {
          number: 5,
          arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
          transliteration: "Iyyāka na'budu wa iyyāka nasta'īn",
          translation: "It is You we worship and You we ask for help.",
          reference: "1:5"
        },
        {
          number: 6,
          arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
          transliteration: "Ihdināṣ-ṣirāṭal-mustaqīm",
          translation: "Guide us to the straight path -",
          reference: "1:6"
        },
        {
          number: 7,
          arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
          transliteration: "Ṣirāṭalladhīna an'amta 'alayhim ghayril-maghḍūbi 'alayhim wa laḍ-ḍāllīn",
          translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
          reference: "1:7"
        }
      ]
    },
    {
      id: 2,
      name: "Al-Baqarah",
      arabic: "البقرة",
      meaning: "The Cow",
      versesCount: 286,
      revelation: "Medinan",
      ayahs: [
        {
          number: 153,
          arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
          transliteration: "Yā ayyuhalladhīna āmanūsta'īnū biṣ-ṣabri waṣ-ṣalāh; innallāha ma'aṣ-ṣābirīn",
          translation: "O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.",
          reference: "2:153"
        },
        {
          number: 255,
          arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
          transliteration: "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm; lā ta'khudhuhū sinatuw-wa lā nawm...",
          translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.",
          reference: "2:255 (Ayat al-Kursi)"
        },
        {
          number: 286,
          arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ",
          transliteration: "Lā yukallifullāhu nafsan illā wus'ahā; lahā mā kasabat wa 'alayhā maktasabat...",
          translation: "Allah does not burden a soul beyond that it can bear. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned.",
          reference: "2:286"
        }
      ]
    },
    {
      id: 94,
      name: "Ash-Sharh",
      arabic: "الشرح",
      meaning: "The Relief",
      versesCount: 8,
      revelation: "Meccan",
      ayahs: [
        {
          number: 1,
          arabic: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
          transliteration: "A-lam nashraḥ laka ṣadrak",
          translation: "Did We not expand for you, [O Muhammad], your breast?",
          reference: "94:1"
        },
        {
          number: 5,
          arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
          transliteration: "Fa-inna ma'al-'usri yusrā",
          translation: "For indeed, with hardship [will be] ease.",
          reference: "94:5"
        },
        {
          number: 6,
          arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
          transliteration: "Inna ma'al-'usri yusrā",
          translation: "Indeed, with hardship [will be] ease.",
          reference: "94:6"
        },
        {
          number: 7,
          arabic: "فَإِذَا فَرَغْتَ فَانصَبْ",
          transliteration: "Fa-idhā faraghta fanṣab",
          translation: "So when you have finished [your duties], then stand up [for worship].",
          reference: "94:7"
        },
        {
          number: 8,
          arabic: "وَإِلَىٰ رَبِّكَ فَارْغَب",
          transliteration: "Wa ilā Rabbika farghab",
          translation: "And to your Lord direct [your] longing.",
          reference: "94:8"
        }
      ]
    },
    {
      id: 112,
      name: "Al-Ikhlas",
      arabic: "الإخلاص",
      meaning: "The Sincerity",
      versesCount: 4,
      revelation: "Meccan",
      ayahs: [
        {
          number: 1,
          arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
          transliteration: "Qul huwallāhu aḥad",
          translation: "Say, 'He is Allah, [who is] One,",
          reference: "112:1"
        },
        {
          number: 2,
          arabic: "اللَّهُ الصَّمَدُ",
          transliteration: "Allāhuṣ-ṣamad",
          translation: "Allah, the Eternal Refuge.",
          reference: "112:2"
        },
        {
          number: 3,
          arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
          transliteration: "Lam yalid wa lam yūlad",
          translation: "He neither begets nor is born,",
          reference: "112:3"
        },
        {
          number: 4,
          arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
          transliteration: "Wa lam yakul-lahū kufuwan aḥad",
          translation: "Nor is there to Him any equivalent.'",
          reference: "112:4"
        }
      ]
    }
  ],

  // Hadith Explorer Collection
  hadiths: [
    {
      id: "h-1",
      collection: "Sahih al-Bukhari",
      bookNumber: "Book 1, Hadith 1",
      narrator: "Umar bin Al-Khattab (RA)",
      grade: "Sahih (Authentic)",
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
      english: "Actions are but by intentions, and every person will only have what they intended.",
      topic: "Intentions",
      reference: "Sahih al-Bukhari 1",
      explanation: "This fundamental principle establishes that the spiritual and moral weight of every deed depends entirely upon the purity and consciousness of the inward motive."
    },
    {
      id: "h-2",
      collection: "Sahih Muslim",
      bookNumber: "Book 55, Hadith 82",
      narrator: "Suhaib (RA)",
      grade: "Sahih (Authentic)",
      arabic: "عَجَبًا لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ وَلَيْسَ ذَاكَ لأَحَدٍ إِلاَّ لِلْمُؤْمِنِ إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ",
      english: "How wonderful is the affair of the believer, for his affairs are all good, and this applies to no one but the believer. If something of ease happens to him, he is grateful and that is good for him; and if something of adversity happens to him, he is patient and that is good for him.",
      topic: "Patience",
      reference: "Sahih Muslim 2999",
      explanation: "The believer’s spiritual equilibrium transforms both prosperity (through Shukr) and trial (through Sabr) into continuous proximity to Allah."
    },
    {
      id: "h-3",
      collection: "Jami` at-Tirmidhi",
      bookNumber: "Book 37, Hadith 2516",
      narrator: "Ibn Abbas (RA)",
      grade: "Hasan Sahih",
      arabic: "احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ، إِذَا سَأَلْتَ فَاسْأَلِ اللَّهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللَّهِ",
      english: "Be mindful of Allah, and He will protect you. Be mindful of Allah, and you will find Him before you. If you ask, ask Allah; and if you seek help, seek help from Allah.",
      topic: "Tawakkul",
      reference: "Jami` at-Tirmidhi 2516",
      explanation: "A profound foundational discourse on relying on Allah, maintaining moral vigilance in prosperity, and cultivating unbreakable trust."
    },
    {
      id: "h-4",
      collection: "Sahih al-Bukhari",
      bookNumber: "Book 78, Hadith 13",
      narrator: "Abu Hurairah (RA)",
      grade: "Sahih (Authentic)",
      arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
      english: "Whoever believes in Allah and the Last Day should speak a good word or remain silent.",
      topic: "Character",
      reference: "Sahih al-Bukhari 6018",
      explanation: "A masterclass in speech discipline, social harmony, and conscious communication."
    }
  ],

  // Dua Library
  duas: [
    {
      id: "dua-1",
      title: "Dua for Knowledge and Understanding",
      category: "Knowledge",
      arabic: "رَبِّ زِدْنِي عِلْمًا",
      transliteration: "Rabbi zidnī 'ilmā",
      translation: "My Lord, increase me in knowledge.",
      reference: "Surah Ta-Ha (20:114)",
      targetCount: 33,
      context: "Recited before study, contemplation, or entering upon demanding intellectual work."
    },
    {
      id: "dua-2",
      title: "Dua of Absolute Reliance (Tawakkul)",
      category: "Difficulty",
      arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
      transliteration: "Ḥasbunallāhu wa ni'mal-wakīl",
      translation: "Sufficient for us is Allah, and [He is] the best Disposer of affairs.",
      reference: "Surah Ali 'Imran (3:173)",
      targetCount: 33,
      context: "Uttered by Ibrahim (AS) and the Companions of the Prophet (ﷺ) during moments of immense adversity."
    },
    {
      id: "dua-3",
      title: "Dua in Distress (Yunusiya)",
      category: "Difficulty",
      arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
      transliteration: "Lā ilāha illā Anta subḥānaka innī kuntu minaẓ-ẓālimīn",
      translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
      reference: "Surah Al-Anbiya (21:87)",
      targetCount: 40,
      context: "The invocation of Prophet Yunus (AS) in the belly of the whale, affirming divine oneness and human humility."
    },
    {
      id: "dua-4",
      title: "Dua for Parents",
      category: "Parents",
      arabic: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
      transliteration: "Rabbir-ḥamhumā kamā rabbayānī ṣaghīrā",
      translation: "My Lord, have mercy upon them as they brought me up [when I was] small.",
      reference: "Surah Al-Isra (17:24)",
      targetCount: 10,
      context: "A prayer of tender gratitude for the sacrifices, warmth, and nurturing of parents."
    },
    {
      id: "dua-5",
      title: "Dua for Inner Peace & Clarity",
      category: "Morning",
      arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
      transliteration: "Rabbish-raḥ lī ṣadrī wa yassir lī amrī",
      translation: "My Lord, expand for me my breast [with assurance] and ease for me my task.",
      reference: "Surah Ta-Ha (20:25-26)",
      targetCount: 21,
      context: "Prophet Musa's (AS) supplication before addressing Pharaoh, asking for speech fluency and emotional fortitude."
    }
  ],

  // Adhkar Library
  adhkar: [
    {
      id: "dhikr-1",
      title: "SubhanAllah",
      arabic: "سُبْحَانَ اللَّهِ",
      transliteration: "Subḥānallāh",
      meaning: "Glory be to Allah",
      targetCount: 33,
      currentCount: 0,
      category: "After Salah"
    },
    {
      id: "dhikr-2",
      title: "Alhamdulillah",
      arabic: "الْحَمْدُ لِلَّهِ",
      transliteration: "Al-ḥamdulillāh",
      meaning: "All praise belongs to Allah",
      targetCount: 33,
      currentCount: 0,
      category: "After Salah"
    },
    {
      id: "dhikr-3",
      title: "Allahu Akbar",
      arabic: "اللَّهُ أَكْبَرُ",
      transliteration: "Allāhu Akbar",
      meaning: "Allah is the Greatest",
      targetCount: 34,
      currentCount: 0,
      category: "After Salah"
    },
    {
      id: "dhikr-4",
      title: "Astaghfirullah",
      arabic: "أَسْتَغْفِرُ اللَّهَ",
      transliteration: "Astaghfirullāh",
      meaning: "I seek forgiveness from Allah",
      targetCount: 100,
      currentCount: 0,
      category: "Morning"
    },
    {
      id: "dhikr-5",
      title: "SubhanAllahi wa bihamdihi",
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      transliteration: "Subḥānallāhi wa bi-ḥamdih",
      meaning: "Glory and praise be to Allah",
      targetCount: 100,
      currentCount: 0,
      category: "Morning"
    }
  ],

  // Learning Paths
  learningPaths: [
    {
      id: "path-sabr",
      title: "Understanding Sabr: Depth, Balance & Practice",
      tagline: "Move beyond passive endurance to active fortitude grounded in divine wisdom.",
      progress: 78,
      duration: "45 mins",
      difficulty: "Intermediate",
      sourcesCount: 14,
      nodes: [
        { id: 1, title: "Linguistic & Conceptual Core", type: "concept", status: "completed" },
        { id: 2, title: "The Quranic Perspective (2:153)", type: "quran", status: "completed" },
        { id: 3, title: "Prophetic Fortitude in Hadith", type: "hadith", status: "completed" },
        { id: 4, title: "Sabr vs Passivity in Daily Life", type: "practice", status: "in_progress" },
        { id: 5, title: "Personal Contemplation", type: "reflection", status: "locked" },
        { id: 6, title: "Knowledge Assessment Check", type: "quiz", status: "locked" }
      ]
    },
    {
      id: "path-tawakkul",
      title: "Tawakkul: Divine Trust & Human Agency",
      tagline: "Master the harmony between taking practical means and placing absolute reliance on Allah.",
      progress: 42,
      duration: "35 mins",
      difficulty: "Beginner",
      sourcesCount: 9,
      nodes: [
        { id: 1, title: "Defining Tawakkul vs Tawaakul", type: "concept", status: "completed" },
        { id: 2, title: "Tying the Camel: The Prophetic Balance", type: "hadith", status: "completed" },
        { id: 3, title: "Duas of Reliance in Quran", type: "dua", status: "in_progress" },
        { id: 4, title: "Overcoming Anxiety through Faith", type: "reflection", status: "locked" },
        { id: 5, title: "Knowledge Assessment Check", type: "quiz", status: "locked" }
      ]
    },
    {
      id: "path-salah",
      title: "Salah Foundations & Cultivating Khushu",
      tagline: "Transform prayer from ritual motion into spiritual ascension and intimate dialogue.",
      progress: 65,
      duration: "50 mins",
      difficulty: "All Levels",
      sourcesCount: 18,
      nodes: [
        { id: 1, title: "The Meaning of Standing Before Allah", type: "concept", status: "completed" },
        { id: 2, title: "Contemplating Surah Al-Fatihah", type: "quran", status: "completed" },
        { id: 3, title: "Prophetic Postures & Humility", type: "hadith", status: "completed" },
        { id: 4, title: "Practical Obstacles to Presence", type: "practice", status: "in_progress" },
        { id: 5, title: "Knowledge Assessment Check", type: "quiz", status: "locked" }
      ]
    }
  ],

  // Adaptive Quiz Questions (Knowledge Assessment, never Iman score)
  quizQuestions: [
    {
      id: "q-1",
      topic: "Sabr",
      question: "According to Surah Al-Baqarah (2:153), what two means are believers instructed to seek help through?",
      options: [
        "Knowledge and Solitude",
        "Patience and Prayer (Sabr & Salah)",
        "Charity and Fasting",
        "Silence and Seclusion"
      ],
      correctIndex: 1,
      explanation: "Surah Al-Baqarah 2:153 explicitly commands: 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.'"
    },
    {
      id: "q-2",
      topic: "Hadith Principles",
      question: "The celebrated first Hadith of Sahih al-Bukhari narrates that the value of deeds is judged by:",
      options: [
        "Their physical magnitude",
        "Their public recognition",
        "The intentions (Niyyah) behind them",
        "The speed of their completion"
      ],
      correctIndex: 2,
      explanation: "Umar bin Al-Khattab (RA) reported that the Messenger of Allah (ﷺ) said: 'Actions are but by intentions, and every person will only have what they intended.' (Bukhari 1)"
    },
    {
      id: "q-3",
      topic: "Tawakkul",
      question: "What does the famous Prophetic instruction 'Tie your camel and trust in Allah' demonstrate?",
      options: [
        "Complete fatalism without human effort",
        "That effort is unnecessary if faith is strong",
        "The essential integration of taking practical means alongside spiritual reliance",
        "That trust in Allah only applies after all resources fail"
      ],
      correctIndex: 2,
      explanation: "Tawakkul combines taking all lawful practical measures (tying the camel) while detaching one's heart from the means and relying solely on Allah for the outcome."
    },
    {
      id: "q-4",
      topic: "Quranic Knowledge",
      question: "Which Surah contains the reassurance: 'Indeed, with hardship [will be] ease' (repeated twice)?",
      options: [
        "Surah Ad-Duha",
        "Surah Ash-Sharh (Al-Inshirah)",
        "Surah Al-Mulk",
        "Surah Al-Asr"
      ],
      correctIndex: 1,
      explanation: "Surah Ash-Sharh (94:5-6) contains the profound promise 'Fa-inna ma'al-'usri yusrā, inna ma'al-'usri yusrā'."
    }
  ],

  // D3.js Knowledge Graph Dataset
  knowledgeGraph: {
    nodes: [
      { id: "Sabr", label: "Sabr (Patience & Fortitude)", group: "concept", size: 30 },
      { id: "Tawakkul", label: "Tawakkul (Reliance on Allah)", group: "concept", size: 28 },
      { id: "Shukr", label: "Shukr (Gratitude)", group: "concept", size: 26 },
      { id: "Salah", label: "Salah (Prayer)", group: "concept", size: 28 },
      { id: "Rahmah", label: "Rahmah (Divine Mercy)", group: "concept", size: 26 },
      { id: "Ilm", label: "'Ilm (Knowledge)", group: "concept", size: 24 },
      
      // Quran Verses
      { id: "Q2:153", label: "Quran 2:153 (Seek help in Sabr & Salah)", group: "quran", size: 20 },
      { id: "Q94:5", label: "Quran 94:5-6 (With hardship comes ease)", group: "quran", size: 20 },
      { id: "Q20:114", label: "Quran 20:114 (Rabbi Zidni 'Ilma)", group: "quran", size: 18 },
      { id: "Q1:1", label: "Quran 1:1-7 (Surah Al-Fatihah)", group: "quran", size: 22 },
      
      // Hadiths
      { id: "Bukhari-1", label: "Bukhari 1 (Actions by Intentions)", group: "hadith", size: 22 },
      { id: "Muslim-2999", label: "Muslim 2999 (Affair of the Believer)", group: "hadith", size: 22 },
      { id: "Tirmidhi-2516", label: "Tirmidhi 2516 (Be mindful of Allah)", group: "hadith", size: 20 },

      // Duas
      { id: "Dua-Hasbunallah", label: "Hasbunallahu wa ni'mal wakeel", group: "dua", size: 18 },
      { id: "Dua-Yunusiya", label: "La ilaha illa Anta (Yunus AS)", group: "dua", size: 18 }
    ],
    links: [
      { source: "Sabr", target: "Salah", relationship: "Companions in Quran 2:153" },
      { source: "Sabr", target: "Q2:153", relationship: "Primary Source" },
      { source: "Salah", target: "Q2:153", relationship: "Primary Source" },
      { source: "Sabr", target: "Muslim-2999", relationship: "Exemplified in Hadith" },
      { source: "Shukr", target: "Muslim-2999", relationship: "Exemplified in Hadith" },
      { source: "Sabr", target: "Q94:5", relationship: "Foundational Reassurance" },
      { source: "Tawakkul", target: "Tirmidhi-2516", relationship: "Source Discourse" },
      { source: "Tawakkul", target: "Dua-Hasbunallah", relationship: "Exemplary Supplication" },
      { source: "Tawakkul", target: "Sabr", relationship: "Reinforcing Principle" },
      { source: "Ilm", target: "Q20:114", relationship: "Quranic Command" },
      { source: "Rahmah", target: "Q1:1", relationship: "Ar-Rahman Ar-Rahim" },
      { source: "Salah", target: "Q1:1", relationship: "Recited in Every Rak'ah" },
      { source: "Bukhari-1", target: "Salah", relationship: "Internal Pre-requisite (Niyyah)" },
      { source: "Sabr", target: "Dua-Yunusiya", relationship: "Supplication in Trial" }
    ]
  }
};
