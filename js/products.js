// BG's Jewellery - Curated Luxury Gold & Bridal Collection
const PRODUCTS_DATA = [
  {
    id: "bg-hero-01",
    name: "The Royal Noor-E-Awadh Bridal Trove",
    subtitle: "As seen in the Heritage Bridal Collection",
    category: "bridal",
    purity: "22KT",
    purityCode: "916 BIS Hallmarked",
    netWeight: 84.50, // grams
    grossWeight: 92.20,
    makingChargePct: 14,
    stoneDetails: "Syndicate Uncut Polki, Zambian Emeralds, Basra Seed Pearls",
    priceBase: 629525, // Calculated dynamically based on live gold rate
    tag: "Signature Bridal",
    badge: "Cover Reference",
    rating: 5.0,
    reviewsCount: 38,
    image: "images/hero-banner.jpg",
    gallery: [
      "images/hero-banner.jpg",
      "images/hero-bride.jpg",
      "images/bridal-detail.jpg"
    ],
    description: "An imperial bridal assemblage handcrafted over 420 artisan hours. Adorned with uncut Syndicate polki, emerald drops, and intricate temple-inspired repoussé motifs. This is the hallmark centerpiece of our bridal campaign.",
    specifications: {
      "Gold Purity": "22 Karat (91.6% Pure Gold)",
      "Hallmark Certification": "BIS Hallmarked with Laser HUID",
      "Gross Weight": "92.20 grams",
      "Net Gold Weight": "84.50 grams",
      "Gemstones": "Certified Natural Emeralds & Uncut Polki",
      "Included In Set": "Royal Matha Patti, Bridal Choker, Rani Haar, Nath, Jhumkas, Hathphool",
      "Lifetime Buyback": "100% Gold Value Exchange Guarantee"
    }
  },
  {
    id: "bg-neck-01",
    name: "Devi Antique Kundan & Ruby Hasli Choker",
    subtitle: "22KT Antique Temple Gold Collection",
    category: "necklaces",
    purity: "22KT",
    purityCode: "916 BIS Hallmarked",
    netWeight: 48.20,
    grossWeight: 52.80,
    makingChargePct: 12,
    stoneDetails: "Burmese Cabochon Rubies & Hydro Polki",
    priceBase: 359090,
    tag: "Masterpiece",
    badge: "Heritage Craft",
    rating: 4.9,
    reviewsCount: 24,
    image: "images/necklace-1.jpg",
    gallery: ["images/necklace-1.jpg", "images/craft-1.jpg"],
    description: "Inspired by imperial Chola dynasty temple art. Features delicate repoussé gold work with hand-set rubies and micro-pearl tassels. Perfect for cocktail receptions and royal nuptials.",
    specifications: {
      "Gold Purity": "22 Karat (91.6% Gold)",
      "Hallmark": "BIS 916 HUID Verified",
      "Gross Weight": "52.80 g",
      "Net Gold Weight": "48.20 g",
      "Lock Type": "Adjustable Silk Dori with Gold Beads",
      "Lifetime Policy": "100% Exchange & Buyback"
    }
  },
  {
    id: "bg-neck-02",
    name: "Maharani Layered Rani Haar & Pearl Mala",
    subtitle: "Imperial Nizami Heritage Jewellery",
    category: "necklaces",
    purity: "22KT",
    purityCode: "916 BIS Hallmarked",
    netWeight: 64.75,
    grossWeight: 71.00,
    makingChargePct: 13,
    stoneDetails: "Fine South Sea Cultured Pearls & Enamel",
    priceBase: 482387,
    tag: "Bestseller",
    badge: "Royal Edition",
    rating: 4.9,
    reviewsCount: 41,
    image: "images/necklace-2.jpg",
    gallery: ["images/necklace-2.jpg"],
    description: "Seven cascading strands of luminous pearls anchored by a majestic 22KT gold pendant carved with celestial peacock motifs and emerald accents.",
    specifications: {
      "Gold Purity": "22 Karat (91.6%)",
      "Hallmark": "BIS 916 HUID Stamp",
      "Net Gold Weight": "64.75 g",
      "Pearl Grade": "AAA Luster South Sea Pearls",
      "Pendant Dimensions": "6.5 cm x 4.2 cm"
    }
  },
  {
    id: "bg-bang-01",
    name: "Royal Meenakari & Jadau Openable Kadas (Pair)",
    subtitle: "Hand-engraved Heirloom Bangles",
    category: "bangles",
    purity: "22KT",
    purityCode: "916 BIS Hallmarked",
    netWeight: 54.30,
    grossWeight: 56.10,
    makingChargePct: 11,
    stoneDetails: "Pachekam Kundan & Traditional Red Meenakari",
    priceBase: 404535,
    tag: "Bridal Essential",
    badge: "Pair",
    rating: 5.0,
    reviewsCount: 19,
    image: "images/bangles-1.jpg",
    gallery: ["images/bangles-1.jpg"],
    description: "A breathtaking pair of royal kadas with secret screw closures. Outer rim is adorned with hand-carved floral patterns while the interior reveals vibrant banarasi enamel art.",
    specifications: {
      "Gold Purity": "22 Karat (91.6%)",
      "Hallmark": "BIS 916 Certified",
      "Net Weight": "54.30 g (27.15g each)",
      "Standard Size": "2.4, 2.6, 2.8 available",
      "Closure": "Precision Gold Screw Lock"
    }
  },
  {
    id: "bg-ear-01",
    name: "Surya Rekha 22K Chandbali & Jhumka Drops",
    subtitle: "Architectural Temple Statement Earrings",
    category: "earrings",
    purity: "22KT",
    purityCode: "916 BIS Hallmarked",
    netWeight: 26.80,
    grossWeight: 28.50,
    makingChargePct: 10,
    stoneDetails: "Natural Ruby Beads & Seed Pearls",
    priceBase: 199660,
    tag: "Trending",
    badge: "New Arrival",
    rating: 4.8,
    reviewsCount: 32,
    image: "images/earrings-1.jpg",
    gallery: ["images/earrings-1.jpg"],
    description: "Graceful crescent chandbalis terminating in rhythmic micro-jhumka bells that produce a gentle melodic chime with every movement.",
    specifications: {
      "Gold Purity": "22 Karat Hallmarked",
      "Net Gold Weight": "26.80 g",
      "Drop Length": "7.5 cm",
      "Back Mechanism": "Bombay Screw Back with Safety Clip"
    }
  },
  {
    id: "bg-ring-01",
    name: "Nizam-Ul-Mulk Imperial Polki Statement Ring",
    subtitle: "Cocktail Heritage Ring in 22KT Gold",
    category: "rings",
    purity: "22KT",
    purityCode: "916 BIS Hallmarked",
    netWeight: 14.60,
    grossWeight: 16.20,
    makingChargePct: 12,
    stoneDetails: "Central Table-cut Polki Diamond & Emerald Halo",
    priceBase: 108770,
    tag: "Statement Piece",
    badge: "Handcrafted",
    rating: 4.9,
    reviewsCount: 15,
    image: "images/ring-1.jpg",
    gallery: ["images/ring-1.jpg"],
    description: "A show-stopping finger ring reminiscent of royal court jewels. The raised dome design catches ambient light from every facet.",
    specifications: {
      "Gold Purity": "22 Karat 916",
      "Net Gold Weight": "14.60 g",
      "Ring Size": "Adjustable Royal Comfort Band (Sizes 12-18)",
      "Crown Diameter": "2.8 cm"
    }
  },
  {
    id: "bg-ring-02",
    name: "Aria Eternal Diamond Solitaire Band",
    subtitle: "18KT Rose Gold with VVS-EF Diamonds",
    category: "rings",
    purity: "18KT",
    purityCode: "750 Hallmarked Gold",
    netWeight: 5.80,
    grossWeight: 6.40,
    makingChargePct: 9,
    stoneDetails: "0.85 ct Certified Natural VVS1-EF Diamonds",
    priceBase: 85200,
    tag: "Modern Luxury",
    badge: "IGI Certified",
    rating: 5.0,
    reviewsCount: 52,
    image: "images/ring-2.jpg",
    gallery: ["images/ring-2.jpg"],
    description: "Subtle elegance tailored for daily indulgence or modern wedding vows. Crafted in luminous 18KT blush rose gold with precision micro-pave setting.",
    specifications: {
      "Gold Purity": "18 Karat (75.0% Gold)",
      "Diamond Weight": "0.85 carats",
      "Diamond Clarity/Color": "VVS1 Clarity, EF Colorless",
      "Net Gold Weight": "5.80 g"
    }
  },
  {
    id: "bg-mang-01",
    name: "Ananya Sacred Auspicious Mangalsutra",
    subtitle: "22KT Gold & Heritage Black Onyx Beads",
    category: "mangalsutra",
    purity: "22KT",
    purityCode: "916 BIS Hallmarked",
    netWeight: 16.40,
    grossWeight: 18.20,
    makingChargePct: 9,
    stoneDetails: "Fine Grade Auspicious Black Beads & Solitaire Accent",
    priceBase: 122180,
    tag: "Sacred Bond",
    badge: "Auspicious",
    rating: 5.0,
    reviewsCount: 67,
    image: "images/mangalsutra-1.jpg",
    gallery: ["images/mangalsutra-1.jpg"],
    description: "A contemporary reinterpretation of the sacred marital talisman. Combines lightweight comfort for everyday wear with the regal grace of 22KT pure gold.",
    specifications: {
      "Gold Purity": "22 Karat 916 BIS",
      "Net Gold Weight": "16.40 g",
      "Chain Length": "18 inches (adjustable with loop)",
      "Hallmark": "BIS Laser Inscribed"
    }
  },
  {
    id: "bg-bride-02",
    name: "The Sitara Shehnai Full Bridal Collection",
    subtitle: "Complete 5-Piece Heritage Bridal Suite",
    category: "bridal",
    purity: "22KT",
    purityCode: "916 BIS Hallmarked",
    netWeight: 112.50,
    grossWeight: 125.00,
    makingChargePct: 15,
    stoneDetails: "Syndicate Polki, Colombian Emeralds & Basra Pearls",
    priceBase: 838125,
    tag: "Grand Heirloom",
    badge: "Complete Suite",
    rating: 5.0,
    reviewsCount: 14,
    image: "images/bride-2.jpg",
    gallery: ["images/bride-2.jpg", "images/bridal-detail.jpg"],
    description: "The ultimate bridal treasure for the discerning bride. Comprises the Grand Guluband choker, a 3-tier rani haar, matching chandelier ear ornaments, matha patti, and dual haathphools.",
    specifications: {
      "Gold Purity": "22 Karat (91.6% Pure Gold)",
      "Total Net Gold": "112.50 grams",
      "Certification": "BIS 916 & International Gemological Appraisal",
      "Packaging": "Custom Handcrafted Velvet & Teak Bridal Casket",
      "Consultation": "Complimentary In-person Styling Session Included"
    }
  }
];

// Curated collections overview
const COLLECTIONS_DATA = [
  {
    id: "bridal-heritage",
    title: "Where Tradition Meets Timeless Beauty",
    subtitle: "Bridal Jewellery Designed to Be Remembered",
    description: "Centuries of royal heritage distilled into breathtaking bridal adornments for your once-in-a-lifetime moment.",
    badge: "Reference Showcase",
    image: "images/hero-banner.jpg",
    itemCount: "48 Masterpieces",
    categoryFilter: "bridal"
  },
  {
    id: "antique-temple",
    title: "Temple & Antique 22K Gold",
    subtitle: "Sacred South Indian & Chola Artistry",
    description: "Intricately carved depictions of divine Lakshmi, peacock motifs, and antique dull-matte heritage finishes.",
    badge: "Heritage Series",
    image: "images/necklace-1.jpg",
    itemCount: "32 Creations",
    categoryFilter: "necklaces"
  },
  {
    id: "polki-uncut",
    title: "Royal Kundan & Syndicate Polki",
    subtitle: "Mughal & Rajputana Splendor",
    description: "Raw, uncut diamonds set with fine 24KT gold foil backing (Jadau) and reverse meenakari enameling.",
    badge: "Imperial Atelier",
    image: "images/craft-1.jpg",
    itemCount: "26 Exclusives",
    categoryFilter: "all"
  },
  {
    id: "daily-elegance",
    title: "Modern Daily Gold & Lightweight",
    subtitle: "Elegance for the Contemporary Woman",
    description: "Featherweight 18KT & 22KT gold necklaces, chains, minimalist bands, and wearable luxury.",
    badge: "Everyday Luxury",
    image: "images/ring-2.jpg",
    itemCount: "54 Designs",
    categoryFilter: "rings"
  }
];

// Gold Rate Base Defaults (in INR)
const GOLD_RATES = {
  currency: "INR",
  currencySymbol: "₹",
  rate24K: 8125, // per gram
  rate22K: 7450, // per gram (91.6% hallmarked)
  rate18K: 6095, // per gram
  silverRate: 98.50, // per gram
  change24K: "+₹30 (+0.37%)",
  change22K: "+₹25 (+0.34%)",
  lastUpdated: "Today, 11:30 AM IST (Live MCX Indexed)"
};

// Currency Exchange Rates against INR
const CURRENCIES = {
  INR: { symbol: "₹", rate: 1, name: "Indian Rupee" },
  USD: { symbol: "$", rate: 0.0118, name: "US Dollar" },
  AED: { symbol: "AED ", rate: 0.0433, name: "UAE Dirham" },
  GBP: { symbol: "£", rate: 0.0093, name: "British Pound" },
  EUR: { symbol: "€", rate: 0.0109, name: "Euro" }
};
