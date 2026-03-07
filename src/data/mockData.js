// Mock data for Dino Handmade products
export const products = [
  {
    id: 1,
    name: 'Gojo Satoru Amigurumi',
    description: 'Nhân vật Gojo Satoru từ anime Jujutsu Kaisen được đan thủ công bằng len cotton cao cấp. Mỗi sản phẩm đều là tác phẩm độc nhất, được tạo ra với sự tỉ mỉ trong từng mũi kim. Phù hợp làm quà tặng cho fan anime.',
    price: 350000,
    category: 'anime',
    image: '/images/gojo.jpg',
    tags: ['jujutsu-kaisen', 'gojo', 'anime'],
    inStock: true,
    size: '15cm',
    material: 'Len cotton',
    isNew: true,
    isHot: true,
  },
  {
    id: 2,
    name: 'Omen Valorant Chibi',
    description: 'Nhân vật Omen từ game Valorant phong cách chibi dễ thương. Đan bằng len acrylic mềm mại, chi tiết tỉ mỉ từ mũ trùm đến đôi mắt xanh đặc trưng. Sản phẩm hoàn hảo cho game thủ Valorant!',
    price: 300000,
    category: 'game',
    image: '/images/omen.jpg',
    tags: ['valorant', 'omen', 'game'],
    inStock: true,
    size: '12cm',
    material: 'Len acrylic',
    isNew: true,
    isHot: false,
  },
  {
    id: 3,
    name: 'Chibi Anime Girl',
    description: 'Cô gái anime phong cách chibi với tóc đen tím, đính hoa xinh xắn. Mỗi chi tiết hoa được móc riêng lẻ rồi khâu tay. Một tác phẩm nghệ thuật len nhỏ xinh đầy màu sắc.',
    price: 280000,
    category: 'anime',
    image: '/images/chibi-girl.jpg',
    tags: ['anime', 'chibi', 'girl'],
    inStock: true,
    size: '10cm',
    material: 'Len cotton blend',
    isNew: false,
    isHot: true,
  },
  {
    id: 4,
    name: 'Cừu Bông Mini đeo Ba Lô',
    description: 'Chú cừu nhỏ đeo ba lô cực kỳ dễ thương! Đan bằng len mềm xù kiểu boucle, tạo lớp lông cừu chân thực. Ba lô nhỏ có thể tháo rời. Quà tặng hoàn hảo cho trẻ em.',
    price: 250000,
    category: 'gau-bong',
    image: '/images/sheep.jpg',
    tags: ['cừu', 'gấu bông', 'cute'],
    inStock: true,
    size: '14cm',
    material: 'Len boucle',
    isNew: false,
    isHot: false,
  },
  {
    id: 5,
    name: 'Gấu Bông Baby Three',
    description: 'Gấu bông lớn phong cách "Good Night" với gương mặt ngộ nghĩnh dễ thương. Đan bằng len lông thú siêu mềm, ôm rất thích. Có yếm trang trí bằng chữ thêu tay.',
    price: 400000,
    category: 'gau-bong',
    image: '/images/baby-three.jpg',
    tags: ['gấu bông', 'baby three', 'plushie'],
    inStock: true,
    size: '25cm',
    material: 'Len lông thú',
    isNew: false,
    isHot: true,
  },
  {
    id: 6,
    name: 'Móc Khóa Len Chibi',
    description: 'Bộ sưu tập móc khóa len chibi đa dạng mẫu mã. Nhỏ gọn, bền đẹp, gắn được vào túi xách, chìa khóa hoặc balo. Có thể đặt mẫu theo yêu cầu riêng!',
    price: 120000,
    category: 'phu-kien',
    image: '/images/keychain.jpg',
    tags: ['móc khóa', 'phụ kiện', 'mini'],
    inStock: true,
    size: '5-7cm',
    material: 'Len cotton',
    isNew: true,
    isHot: false,
  },
];

export const categories = [
  { id: 'anime', name: 'Nhân vật Anime', icon: '🌸', color: '#FFB6C1' },
  { id: 'game', name: 'Nhân vật Game', icon: '🎮', color: '#98E8C8' },
  { id: 'gau-bong', name: 'Gấu Bông', icon: '🧸', color: '#E6E0F8' },
  { id: 'phu-kien', name: 'Phụ Kiện', icon: '🔑', color: '#FFF8DC' },
];

export const blogPosts = [
  {
    id: 1,
    title: 'Quá trình đan Gojo Satoru 🧵',
    content: 'Mình mất khoảng 3 ngày để hoàn thành em Gojo này. Phần khó nhất là tóc trắng, phải đan từng lọn rồi khâu vào đầu...',
    date: '2026-03-01',
    image: '/images/gojo.jpg',
  },
  {
    id: 2,
    title: 'Đơn hàng Custom: Omen Valorant 🎮',
    content: 'Khách đặt một em Omen theo mẫu riêng. Phần mũ trùm và đôi mắt xanh là chi tiết mình thích nhất!',
    date: '2026-02-25',
    image: '/images/omen.jpg',
  },
  {
    id: 3,
    title: 'Review len mới: Cotton Milk 🧶',
    content: 'Hôm nay mình thử loại len Cotton Milk mới nhập. Sợi rất mềm, không xù, thích hợp cho amigurumi...',
    date: '2026-02-20',
    image: '/images/sheep.jpg',
  },
];

export const feedbacks = [
  {
    id: 1,
    name: 'Minh Anh',
    content: 'Nhận hàng đẹp quá, em Gojo dễ thương lắm! Đan tỉ mỉ, chất lượng tốt. Sẽ ủng hộ shop tiếp ạ 💖',
    rating: 5,
    date: '2026-02-28',
  },
  {
    id: 2,
    name: 'Hoàng Dũng',
    content: 'Mua em Omen tặng bạn gái, bạn ấy thích lắm! Shop tư vấn nhiệt tình, giao hàng nhanh 🎮',
    rating: 5,
    date: '2026-02-15',
  },
  {
    id: 3,
    name: 'Thu Hương',
    content: 'Con cừu bông cute quá! Bé nhà mình ôm ngủ suốt. Len mềm, an toàn cho trẻ em 🐑',
    rating: 5,
    date: '2026-02-10',
  },
];

export const shopInfo = {
  name: 'Dino Handmade',
  tagline: 'Mỗi mũi len là một câu chuyện ✨',
  description: 'Dino Handmade là nơi tạo ra những tác phẩm amigurumi thủ công độc đáo, lấy cảm hứng từ các nhân vật anime và game yêu thích. Mỗi sản phẩm đều được đan tay tỉ mỉ với tình yêu và sự sáng tạo.',
  contact: {
    zalo: '0941401149',
    facebook: 'https://www.facebook.com/share/1Ejd5KEHFY/',
    email: 'ngonbui2206@gmail.com',
  },
  maker: {
    name: 'Ngon Bui',
    role: 'Founder & Crafter',
    bio: 'Mình là Ngon, người đứng sau Dino Handmade. Mình yêu thích đan len và anime/game. Mỗi sản phẩm amigurumi là một tác phẩm nghệ thuật nhỏ, chứa đựng tình yêu và sự tỉ mỉ trong từng mũi kim. Nếu bạn muốn đặt mẫu theo ý thích, hãy nhắn tin cho mình qua Zalo hoặc Facebook nhé! ✨',
    skills: ['🧶 Amigurumi', '🎨 Crochet Design', '🎮 Gaming', '📱 Social Media'],
  },
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price) + '₫';
};
