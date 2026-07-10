// @ts-nocheck
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient, Region, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'
import ws from 'ws'

// Cấu hình WebSocket constructor cho môi trường Node.js
neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })


async function main() {
  console.log('🌱 Starting seed...')
  console.log('DATABASE_URL is:', process.env.DATABASE_URL)


  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.tour.deleteMany()
  await prisma.destination.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Cleared existing data')

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('user123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin VietTravel',
      email: 'admin@viettravel.vn',
      password: adminPassword,
      role: 'ADMIN',
      phone: '0901234567',
    },
  })

  const customer = await prisma.user.create({
    data: {
      name: 'Nguyễn Văn An',
      email: 'user@viettravel.vn',
      password: userPassword,
      role: 'CUSTOMER',
      phone: '0912345678',
    },
  })

  console.log('👥 Created users')

  // Create destinations
  const destinations = await Promise.all([
    prisma.destination.create({
      data: {
        name: 'Vịnh Hạ Long',
        slug: 'ha-long',
        region: 'NORTH',
        description: 'Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi hùng vĩ trên biển xanh biếc.',
        imageUrl: '/images/destinations/ha-long.jpg',
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Sapa',
        slug: 'sapa',
        region: 'NORTH',
        description: 'Thị trấn mù sương với những thửa ruộng bậc thang đẹp như tranh và văn hóa dân tộc phong phú.',
        imageUrl: '/images/destinations/sapa.jpg',
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Ninh Bình',
        slug: 'ninh-binh',
        region: 'NORTH',
        description: 'Vịnh Hạ Long trên cạn với hệ thống hang động kỳ vĩ và đồng bằng lúa nước.',
        imageUrl: '/images/destinations/ninh-binh.jpg',
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Hội An',
        slug: 'hoi-an',
        region: 'CENTRAL',
        description: 'Phố cổ huyền diệu với đèn lồng rực rỡ, kiến trúc cổ kính và ẩm thực tuyệt vời.',
        imageUrl: '/images/destinations/hoi-an.jpg',
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Đà Nẵng',
        slug: 'da-nang',
        region: 'CENTRAL',
        description: 'Thành phố đáng sống với bãi biển tuyệt đẹp, cầu Rồng và Bà Nà Hills huyền ảo.',
        imageUrl: '/images/destinations/da-nang.jpg',
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Phú Quốc',
        slug: 'phu-quoc',
        region: 'SOUTH',
        description: 'Đảo ngọc với bãi biển hoang sơ, làn nước xanh trong và hải sản tươi ngon.',
        imageUrl: '/images/destinations/phu-quoc.jpg',
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Đà Lạt',
        slug: 'da-lat',
        region: 'SOUTH',
        description: 'Thành phố ngàn hoa với khí hậu mát mẻ, hồ lãng mạn và vườn hoa rực rỡ.',
        imageUrl: '/images/destinations/da-lat.jpg',
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Mũi Né',
        slug: 'mui-ne',
        region: 'SOUTH',
        description: 'Thiên đường nghỉ dưỡng với đồi cát vàng, suối Tiên và hải sản biển tươi ngon.',
        imageUrl: '/images/destinations/dest-muine.jpg',
      },
    }),
  ])

  const [haLong, sapa, ninhBinh, hoiAn, daNang, phuQuoc, daLat, muiNe] = destinations
  console.log('📍 Created destinations')

  // Create tours
  const tours = await Promise.all([
    // Ha Long tours
    prisma.tour.create({
      data: {
        title: 'Vịnh Hạ Long 2N1Đ – Du thuyền 5 sao',
        slug: 'ha-long-du-thuyen-5-sao-2n1d',
        destinationId: haLong.id,
        description: 'Hành trình khám phá Vịnh Hạ Long trên du thuyền 5 sao với trải nghiệm nghỉ đêm sang trọng trên vịnh. Thưởng thức ẩm thực cao cấp, kayaking, thăm hang động và ngắm hoàng hôn tuyệt đẹp.',
        duration: '2N1Đ',
        durationDays: 2,
        priceAdult: 3500000,
        priceChild: 2000000,
        maxGroupSize: 20,
        featured: true,
        images: ['/images/tours/ha-long-1.jpg', '/images/tours/ha-long-2.jpg'],
        itinerary: [
          {
            day: 1,
            title: 'Hà Nội → Hạ Long – Khám phá vịnh',
            activities: [
              'Xe đón tại Hà Nội lúc 7h30 sáng, khởi hành đi Hạ Long',
              'Check-in du thuyền, ăn trưa hải sản tươi ngon',
              'Tham quan hang Sửng Sốt, đảo Ti Tốp',
              'Kayaking khám phá hang động và vũng ương vắng',
              'Tiệc BBQ trên boong tàu, ngắm hoàng hôn',
              'Nghỉ đêm trên du thuyền',
            ],
          },
          {
            day: 2,
            title: 'Tập Thái cực quyền – Đảo Titov – Hà Nội',
            activities: [
              'Tập Thái cực quyền trên boong lúc bình minh',
              'Ăn sáng tự chọn tại nhà hàng du thuyền',
              'Leo lên đỉnh đảo Titov ngắm toàn cảnh vịnh',
              'Check-out, ăn trưa hải sản',
              'Xe đưa về Hà Nội, kết thúc tour lúc 18h',
            ],
          },
        ],
        inclusions: ['Xe đưa đón khứ hồi Hà Nội – Hạ Long', 'Phòng đôi trên du thuyền 5 sao', 'Tất cả bữa ăn trên thuyền', 'Vé tham quan', 'Kayak và các hoạt động', 'Hướng dẫn viên'],
        exclusions: ['Đồ uống cá nhân', 'Bảo hiểm du lịch', 'Chi phí cá nhân'],
        rating: 4.9,
        reviewCount: 128,
      },
    }),

    // Sapa tours
    prisma.tour.create({
      data: {
        title: 'Sapa Trek 3N2Đ – Chinh phục Fansipan',
        slug: 'sapa-trek-fansipan-3n2d',
        destinationId: sapa.id,
        description: 'Hành trình trekking thám hiểm bản làng dân tộc và chinh phục đỉnh Fansipan huyền thoại – nóc nhà Đông Dương. Trải nghiệm văn hóa H\'mong, Tày độc đáo và cảnh sắc núi rừng tuyệt vời.',
        duration: '3N2Đ',
        durationDays: 3,
        priceAdult: 2800000,
        priceChild: 1600000,
        maxGroupSize: 15,
        featured: true,
        images: ['/images/destinations/sapa.jpg'],
        itinerary: [
          {
            day: 1,
            title: 'Hà Nội → Sapa – Khám phá bản Cát Cát',
            activities: [
              'Xe limousine giường nằm khởi hành từ Hà Nội lúc 22h',
              'Đến Sapa lúc 5h30 sáng, nhận phòng khách sạn',
              'Thăm bản Cát Cát – bản H\'mong cổ nhất Sapa',
              'Ăn tối và ngủ nghỉ tại Sapa',
            ],
          },
          {
            day: 2,
            title: 'Chinh phục đỉnh Fansipan 3143m',
            activities: [
              'Ăn sáng, chuẩn bị đồ leo núi',
              'Đi cáp treo lên đỉnh Fansipan (3143m)',
              'Tham quan đỉnh cao nhất Đông Dương',
              'Chụp ảnh kỷ niệm, trở xuống',
              'Chiều thăm ruộng bậc thang Mường Hoa',
            ],
          },
          {
            day: 3,
            title: 'Bản Lao Chải – Y Tý – Hà Nội',
            activities: [
              'Trekking qua bản Lao Chải, Ta Van',
              'Giao lưu văn hóa với đồng bào dân tộc',
              'Ăn trưa đặc sản vùng cao',
              'Xe trả về Hà Nội, kết thúc tour',
            ],
          },
        ],
        inclusions: ['Xe limousine khứ hồi HN – Sapa', '2 đêm khách sạn 3 sao Sapa', 'Vé cáp treo Fansipan', 'Hướng dẫn viên trekking', 'Tất cả bữa ăn', 'Áo mưa và gậy leo'],
        exclusions: ['Chi phí cá nhân', 'Bảo hiểm du lịch', 'Đồ uống'],
        rating: 4.8,
        reviewCount: 95,
      },
    }),

    // Ninh Binh
    prisma.tour.create({
      data: {
        title: 'Ninh Bình 2N1Đ – Tràng An & Bái Đính',
        slug: 'ninh-binh-trang-an-bai-dinh-2n1d',
        destinationId: ninhBinh.id,
        description: 'Khám phá vùng đất cố đô Hoa Lư với quần thể chùa Bái Đính hoành tráng, thuyền bơi Tràng An và đạp xe qua cánh đồng lúa thơ mộng. Trải nghiệm văn hoá tâm linh và thiên nhiên độc đáo.',
        duration: '2N1Đ',
        durationDays: 2,
        priceAdult: 1800000,
        priceChild: 1000000,
        maxGroupSize: 25,
        featured: true,
        images: ['/images/destinations/ninh-binh.jpg'],
        itinerary: [
          { day: 1, title: 'Tràng An – Mua Cave – Bái Đính', activities: ['Xe đón tại Hà Nội 7h30', 'Thăm chùa Bái Đính – chùa lớn nhất Đông Nam Á', 'Thuyền bơi Tràng An qua 9 hang động', 'Leo đỉnh Mua Cave ngắm toàn cảnh Ninh Bình', 'Nghỉ đêm tại resort Ninh Bình'] },
          { day: 2, title: 'Cố đô Hoa Lư – Đạp xe Tam Cốc', activities: ['Thăm cố đô Hoa Lư – kinh đô đầu tiên của Việt Nam', 'Đạp xe qua cánh đồng lúa Tam Cốc', 'Thuyền bơi qua 3 hang động tự nhiên', 'Về Hà Nội kết thúc tour'] },
        ],
        inclusions: ['Xe khứ hồi HN – Ninh Bình', '1 đêm resort', 'Vé tham quan', 'Thuyền bơi và xe đạp', 'Hướng dẫn viên', 'Bữa trưa'],
        exclusions: ['Bữa tối', 'Đồ uống', 'Chi phí cá nhân'],
        rating: 4.7,
        reviewCount: 84,
      },
    }),

    // Hoi An
    prisma.tour.create({
      data: {
        title: 'Hội An – Phố Cổ & Biển 3N2Đ',
        slug: 'hoi-an-pho-co-bien-3n2d',
        destinationId: hoiAn.id,
        description: 'Đắm mình trong không gian phố cổ đèn lồng lung linh, thả đèn hoa đăng trên sông Hoài, may áo dài truyền thống và thưởng thức ẩm thực Hội An nổi tiếng thế giới.',
        duration: '3N2Đ',
        durationDays: 3,
        priceAdult: 3200000,
        priceChild: 1800000,
        maxGroupSize: 20,
        featured: true,
        images: ['/images/destinations/hoi-an.jpg'],
        itinerary: [
          { day: 1, title: 'Đến Hội An – Phố cổ về đêm', activities: ['Bay đến Đà Nẵng, xe đưa về Hội An', 'Dạo phố cổ Hội An về đêm', 'Thả đèn hoa đăng trên sông Hoài', 'Ẩm thực đường phố: Cao Lầu, Mì Quảng'] },
          { day: 2, title: 'May áo dài – Làng gốm Thanh Hà', activities: ['Đo may áo dài truyền thống tại phố cổ', 'Thăm làng gốm Thanh Hà 500 năm tuổi', 'Đạp xe qua cánh đồng rau Trà Quế', 'Học nấu ẩm thực Hội An', 'Tham quan chùa Cầu, nhà cổ'] },
          { day: 3, title: 'Biển Cửa Đại – Đà Nẵng', activities: ['Tắm biển Cửa Đại buổi sáng', 'Mua sắm tại chợ Hội An', 'Xe đưa ra Đà Nẵng', 'Bay về Hà Nội / TP.HCM'] },
        ],
        inclusions: ['Vé máy bay khứ hồi', '2 đêm khách sạn 4 sao', 'Xe đưa đón sân bay', 'Vé tham quan phố cổ', 'Lớp học nấu ăn', 'Hướng dẫn viên'],
        exclusions: ['Chi phí may áo dài', 'Bữa tối tự túc', 'Mua sắm cá nhân'],
        rating: 4.9,
        reviewCount: 201,
      },
    }),

    // Da Nang
    prisma.tour.create({
      data: {
        title: 'Đà Nẵng – Bà Nà Hills 3N2Đ',
        slug: 'da-nang-ba-na-hills-3n2d',
        destinationId: daNang.id,
        description: 'Khám phá thành phố biển năng động với cầu Rồng phun lửa, Ngũ Hành Sơn huyền bí và Bà Nà Hills – thiên đường trong mây với Cầu Vàng nổi tiếng thế giới.',
        duration: '3N2Đ',
        durationDays: 3,
        priceAdult: 3800000,
        priceChild: 2200000,
        maxGroupSize: 20,
        featured: false,
        images: ['/images/destinations/da-nang.jpg'],
        itinerary: [
          { day: 1, title: 'Đến Đà Nẵng – Biển Mỹ Khê', activities: ['Bay đến Đà Nẵng, nhận phòng khách sạn', 'Tắm biển Mỹ Khê – bãi biển đẹp nhất hành tinh', 'Chiều tham quan Ngũ Hành Sơn', 'Tối ngắm cầu Rồng phun lửa và phun nước'] },
          { day: 2, title: 'Bà Nà Hills – Cầu Vàng', activities: ['Cáp treo lên Bà Nà Hills', 'Tham quan Cầu Vàng nổi tiếng thế giới', 'Vui chơi tại Fantasy Park', 'Thăm làng Pháp cổ trên đỉnh núi'] },
          { day: 3, title: 'Phố Hội – Hội An cổ trấn', activities: ['Sáng tắm biển lần cuối', 'Ghé thăm Hội An buổi trưa', 'Mua đặc sản Đà Nẵng về làm quà', 'Bay về'] },
        ],
        inclusions: ['Vé máy bay khứ hồi', '2 đêm khách sạn biển', 'Vé Bà Nà Hills (cáp treo + park)', 'Xe đưa đón', 'Hướng dẫn viên'],
        exclusions: ['Ăn uống tự túc', 'Chi phí cá nhân', 'Bảo hiểm'],
        rating: 4.7,
        reviewCount: 113,
      },
    }),

    // Phu Quoc
    prisma.tour.create({
      data: {
        title: 'Phú Quốc 4N3Đ – Đảo Ngọc Thiên Đường',
        slug: 'phu-quoc-dao-ngoc-4n3d',
        destinationId: phuQuoc.id,
        description: 'Nghỉ dưỡng đẳng cấp tại đảo ngọc Phú Quốc với resort 5 sao, lặn ngắm san hô, câu cá và khám phá 3 hòn đảo hoang sơ. Trải nghiệm hoàng hôn tuyệt đẹp và hải sản tươi ngon.',
        duration: '4N3Đ',
        durationDays: 4,
        priceAdult: 5500000,
        priceChild: 3000000,
        maxGroupSize: 20,
        featured: true,
        images: ['/images/destinations/phu-quoc.jpg'],
        itinerary: [
          { day: 1, title: 'Đến Phú Quốc – Bãi Sao', activities: ['Bay đến Phú Quốc, nhận phòng resort 5 sao', 'Nghỉ ngơi, tắm biển tại bãi riêng của resort', 'Thưởng thức tiệc hải sản BBQ buổi tối', 'Ngắm hoàng hôn tuyệt đẹp'] },
          { day: 2, title: 'Tour 3 đảo – Lặn san hô', activities: ['Boat tour ra 3 đảo: Hòn Thơm, Hòn Mây Rút, Hòn Gầm Ghì', 'Lặn ngắm san hô đầy màu sắc', 'Câu cá và nướng ngay trên thuyền', 'Chiều về tự do khám phá'] },
          { day: 3, title: 'Làng Chài – Bắc Đảo', activities: ['Thăm nhà tù Phú Quốc – chứng tích lịch sử', 'Thăm vườn tiêu Phú Quốc', 'Mua đặc sản: nước mắm, tiêu, rượu sim', 'Spa nghỉ ngơi buổi chiều'] },
          { day: 4, title: 'Tắm biển – Bay về', activities: ['Sáng tắm biển lần cuối', 'Thưởng thức buffet sáng tại resort', 'Check-out, ra sân bay', 'Bay về TP.HCM / Hà Nội'] },
        ],
        inclusions: ['Vé máy bay khứ hồi', '3 đêm resort 5 sao', 'Tour 3 đảo + lặn ngắm san hô', 'Xe đưa đón', 'Hướng dẫn viên', 'Tất cả bữa sáng'],
        exclusions: ['Bữa trưa/tối tự túc (trừ BBQ)', 'Spa', 'Mua sắm', 'Bảo hiểm du lịch'],
        rating: 4.9,
        reviewCount: 167,
      },
    }),

    // Da Lat
    prisma.tour.create({
      data: {
        title: 'Đà Lạt 3N2Đ – Thành Phố Ngàn Hoa',
        slug: 'da-lat-nghin-hoa-3n2d',
        destinationId: daLat.id,
        description: 'Khám phá thành phố ngàn hoa lãng mạn với Hồ Xuân Hương, Thung Lũng Tình Yêu, đồi chè xanh mướt và cà phê thác Datanla. Thưởng thức dâu tây, rau củ và hoa Đà Lạt đặc sắc.',
        duration: '3N2Đ',
        durationDays: 3,
        priceAdult: 2500000,
        priceChild: 1400000,
        maxGroupSize: 20,
        featured: true,
        images: ['/images/destinations/da-lat.jpg'],
        itinerary: [
          { day: 1, title: 'Đến Đà Lạt – Hồ Xuân Hương', activities: ['Bay/xe đến Đà Lạt, nhận phòng', 'Đạp xe quanh hồ Xuân Hương', 'Thăm chợ đêm Đà Lạt', 'Thưởng thức sữa đậu nành, bánh mì xíu mại đặc sản'] },
          { day: 2, title: 'Thung Lũng Tình Yêu – Đồi Chè', activities: ['Thăm Thung Lũng Tình Yêu', 'Tham quan làng hoa Vạn Thành', 'Trải nghiệm hái dâu tây tại vườn', 'Đồi chè Cầu Đất – cảnh quan thiên nhiên đẹp', 'Cáp treo LangBiang'] },
          { day: 3, title: 'Datanla – Núi LangBiang', activities: ['Leo núi LangBiang – nóc nhà Tây Nguyên', 'Thác Datanla – trò chơi xe trượt ray', 'Mua đặc sản Đà Lạt về làm quà', 'Bay/xe về'] },
        ],
        inclusions: ['Xe đưa đón sân bay', '2 đêm khách sạn trung tâm', 'Vé tham quan tất cả điểm', 'Hướng dẫn viên', 'Bữa sáng mỗi ngày'],
        exclusions: ['Vé máy bay', 'Bữa trưa/tối', 'Chi phí mua sắm'],
        rating: 4.8,
        reviewCount: 142,
      },
    }),

    // Mui Ne
    prisma.tour.create({
      data: {
        title: 'Mũi Né 2N1Đ – Đồi Cát Vàng Huyền Bí',
        slug: 'mui-ne-doi-cat-vang-2n1d',
        destinationId: muiNe.id,
        description: 'Khám phá thiên đường resort Mũi Né với đồi cát vàng sa mạc, suối Tiên đầy màu sắc và bãi biển hoang sơ. Trải nghiệm lướt ván diều, xe jeep đồi cát và thưởng thức hải sản biển tươi ngon.',
        duration: '2N1Đ',
        durationDays: 2,
        priceAdult: 2200000,
        priceChild: 1300000,
        maxGroupSize: 20,
        featured: false,
        images: ['/images/destinations/dest-muine.jpg'],
        itinerary: [
          { day: 1, title: 'TP.HCM → Mũi Né – Đồi Cát', activities: ['Xe khởi hành từ TP.HCM lúc 7h', 'Đến Mũi Né, check-in resort', 'Chiều thăm đồi cát vàng, xe jeep leo đồi', 'Xem hoàng hôn trên đồi cát', 'Tối thưởng thức hải sản tại bãi biển'] },
          { day: 2, title: 'Suối Tiên – Làng Chài – Đồi Cát Đỏ', activities: ['Sáng sớm ngắm bình minh trên đồi cát', 'Thăm suối Tiên – dòng suối đầy màu sắc', 'Tham quan làng chài Mũi Né', 'Đồi cát đỏ – nét độc đáo của vùng', 'Xe trả về TP.HCM'] },
        ],
        inclusions: ['Xe khứ hồi TP.HCM – Mũi Né', '1 đêm resort biển', 'Xe jeep đồi cát', 'Hướng dẫn viên', 'Bữa sáng'],
        exclusions: ['Bữa trưa/tối', 'Lướt ván diều', 'Chi phí cá nhân'],
        rating: 4.6,
        reviewCount: 78,
      },
    }),
  ])

  console.log('🗺️  Created tours')

  // Create reviews
  const [haLongTour, sapaTour, , hoiAnTour, , phuQuocTour, daLatTour] = tours

  await prisma.review.createMany({
    data: [
      { userId: customer.id, tourId: haLongTour.id, rating: 5, comment: 'Tuyệt vời! Du thuyền 5 sao thực sự xứng đáng từng đồng. Đội ngũ phục vụ cực kỳ chuyên nghiệp, hải sản tươi ngon. Sẽ quay lại lần nữa!' },
      { userId: admin.id, tourId: haLongTour.id, rating: 5, comment: 'Hành trình đáng nhớ nhất trong cuộc đời. Vịnh Hạ Long thực sự là kỳ quan thiên nhiên. Kayaking qua hang động rất thú vị.' },
      { userId: customer.id, tourId: sapaTour.id, rating: 5, comment: 'Leo Fansipan là trải nghiệm cả đời không quên. Hướng dẫn viên rất nhiệt tình, am hiểu văn hóa dân tộc. Ruộng bậc thang đẹp không tả được.' },
      { userId: admin.id, tourId: hoiAnTour.id, rating: 5, comment: 'Hội An về đêm với đèn lồng thực sự huyền diệu. Lớp học nấu ăn rất thú vị, mang về nhiều kỹ năng mới.' },
      { userId: customer.id, tourId: phuQuocTour.id, rating: 5, comment: 'Resort 5 sao cực đẳng cấp! Lặn ngắm san hô lần đầu tiên trong đời, cực kỳ ấn tượng. Hải sản tươi và ngon.' },
      { userId: admin.id, tourId: daLatTour.id, rating: 4, comment: 'Thành phố ngàn hoa thật sự lãng mạn. Hái dâu tây, uống cà phê núi rừng – tất cả đều tuyệt vời. Khí hậu mát mẻ dễ chịu.' },
    ],
  })

  console.log('⭐ Created reviews')
  console.log('✅ Seed completed successfully!')
  console.log(`
  📊 Summary:
  - Users: 2 (1 admin, 1 customer)
  - Destinations: ${destinations.length}
  - Tours: ${tours.length}
  - Reviews: 6
  
  🔑 Login credentials:
  - Admin: admin@viettravel.vn / admin123
  - User:  user@viettravel.vn  / user123
  `)
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
