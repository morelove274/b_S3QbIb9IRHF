import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Heart, 
  Download, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  X,
  Cloud
} from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  quoteCn: string;
  quoteEn: string;
  description: string;
  image: string;
  theme: string;
  category: string;
  audioUrl?: string;
}

const movies: Movie[] = [
  {
    id: 'cinderella',
    title: '《灰姑娘》',
    quoteCn: '“永远不要让任何人让你觉得你不配拥有你想要的东西。”',
    quoteEn: 'Never let anyone make you feel like you don\'t deserve what you want.',
    description: '寻找属于自己的价值与尊严。在逆境中保持善良与勇气，终会迎来属于你的奇迹。',
    image: 'https://picsum.photos/seed/cinderella-magic-gown/800/600',
    theme: '自我价值',
    category: '坚持',
    audioUrl: 'https://www.movie-sounds.org/quotes/cinderella/never-let-anyone-make-you-feel-like-you-don-t-deserve-what-you-want.mp3'
  },
  {
    id: 'shawshank',
    title: '《肖申克的救赎》',
    quoteCn: '“希望是件好事，也许是世间最好的事，而美好的事物永不消逝。”',
    quoteEn: 'Hope is a good thing, maybe the best of things, and no good thing ever dies.',
    description: '在最黑暗的时刻，坚守内心的火种。自由不仅是身体的解放，更是灵魂的觉醒。',
    image: 'https://picsum.photos/seed/prison-walls-hope/800/600',
    theme: '希望',
    category: '梦想',
    audioUrl: 'https://www.movie-sounds.org/quotes/shawshank/hope-is-a-good-thing-maybe-the-best-of-things-and-no-good-thing-ever-dies.mp3'
  },
  {
    id: 'happyness',
    title: '《当幸福来敲门》',
    quoteCn: '“如果你有梦想，你就要去守护它。当人们做不到某些事时，他们就会对你说你也同样办不到。”',
    quoteEn: 'You got a dream... You gotta protect it. People can\'t do somethin\' themselves, they wanna tell you you can\'t do it.',
    description: '在逆境中逆流而上，追逐属于你的光。不要让别人的平庸限制了你的可能。',
    image: 'https://picsum.photos/seed/father-son-struggle/800/600',
    theme: '韧性',
    category: '成长',
    audioUrl: 'https://www.movie-sounds.org/quotes/happyness/you-got-a-dream-you-gotta-protect-it.mp3'
  },
  {
    id: 'lionking',
    title: '《狮子王》',
    quoteCn: '“过去也许令人痛苦，但在我看来，你要么选择逃避，要么从中学习。”',
    quoteEn: 'The past can hurt. But the way I see it, you can either run from it, or learn from it.',
    description: '成长的真谛在于直面过去的勇气。承担起你的责任，成为你注定要成为的人。',
    image: 'https://picsum.photos/seed/pride-rock-sunset/800/600',
    theme: '成长',
    category: '勇气',
    audioUrl: 'https://www.movie-sounds.org/quotes/lionking/the-past-can-hurt-but-the-way-i-see-it-you-can-either-run-from-it-or-learn-from-it.mp3'
  },
  {
    id: 'forrestgump',
    title: '《阿甘正传》',
    quoteCn: '“生命就像一盒巧克力，你永远不知道下一块是什么味道。”',
    quoteEn: 'Life is like a box of chocolates. You never know what you\'re gonna get.',
    description: '保持纯真与奔跑，生活总会给你意想不到的答案。',
    image: 'https://picsum.photos/seed/bench-park-running/800/600',
    theme: '命运',
    category: '成长',
    audioUrl: 'https://www.movie-sounds.org/quotes/forrestgump/life-is-like-a-box-of-chocolates-you-never-know-what-you-re-gonna-get.mp3'
  },
  {
    id: 'deadpoets',
    title: '《死亡诗社》',
    quoteCn: '“及时行乐，抓紧时间，孩子们，让你的生命不同寻常。”',
    quoteEn: 'Carpe diem. Seize the day, boys. Make your lives extraordinary.',
    description: '打破常规，寻找属于自己的声音。',
    image: 'https://picsum.photos/seed/classroom-standing-desk/800/600',
    theme: '自我',
    category: '梦想',
    audioUrl: 'https://www.movie-sounds.org/quotes/dead-poets-society/carpe-diem-seize-the-day-boys-make-your-lives-extraordinary.mp3'
  },
  {
    id: 'rocky',
    title: '《洛奇》',
    quoteCn: '“重要的不是你打得有多重，而是你能承受多重的打击并继续前进。”',
    quoteEn: 'It ain\'t about how hard you hit. It\'s about how hard you can get hit and keep moving forward.',
    description: '拳击台上的坚持，也是人生的缩影。',
    image: 'https://picsum.photos/seed/boxing-ring-training/800/600',
    theme: '毅力',
    category: '坚持',
    audioUrl: 'https://www.movie-sounds.org/quotes/rocky-balboa/it-ain-t-about-how-hard-you-hit-it-s-about-how-hard-you-can-get-hit-and-keep-moving-forward.mp3'
  },
  {
    id: 'godfather',
    title: '《教父》',
    quoteCn: '“伟人并非天生伟大，而是在成长过程中体现其伟大。”',
    quoteEn: 'Great men are not born great, they grow great.',
    description: '责任与家族，成就了不朽的传奇。',
    image: 'https://picsum.photos/seed/mafia-suit-shadow/800/600',
    theme: '成长',
    category: '成长',
    audioUrl: 'https://www.movie-sounds.org/quotes/the-godfather/great-men-are-not-born-great-they-grow-great.mp3'
  },
  {
    id: 'starwars',
    title: '《星球大战》',
    quoteCn: '“做或者不做，没有尝试一说。”',
    quoteEn: 'Do or do not. There is no try.',
    description: '信念是行动的唯一动力。',
    image: 'https://picsum.photos/seed/space-stars-lightsaber/800/600',
    theme: '信念',
    category: '勇气',
    audioUrl: 'https://www.movie-sounds.org/quotes/star-wars-episode-v-the-empire-strikes-back/do-or-do-not-there-is-no-try.mp3'
  },
  {
    id: 'braveheart',
    title: '《勇敢的心》',
    quoteCn: '“每个人都会死，但不是每个人都真正活过。”',
    quoteEn: 'Every man dies, not every man really lives.',
    description: '为了自由，值得付出一切。',
    image: 'https://picsum.photos/seed/warrior-field-freedom/800/600',
    theme: '自由',
    category: '勇气',
    audioUrl: 'https://www.movie-sounds.org/quotes/braveheart/every-man-dies-not-every-man-really-lives.mp3'
  },
  {
    id: 'gladiator',
    title: '《角斗士》',
    quoteCn: '“我们在生命中所做的，将在永恒中回响。”',
    quoteEn: 'What we do in life echoes in eternity.',
    description: '荣誉与复仇，在历史的长河中留下印记。',
    image: 'https://picsum.photos/seed/colosseum-armor-wheat/800/600',
    theme: '荣誉',
    category: '坚持'
  },
  {
    id: 'darkknight',
    title: '《蝙蝠侠：黑暗骑士》',
    quoteCn: '“我的外表下是谁并不重要，我的所作所为定义了我。”',
    quoteEn: 'It\'s not who I am underneath, but what I do that defines me.',
    description: '英雄不在于面具，而在于选择。',
    image: 'https://picsum.photos/seed/city-night-batman/800/600',
    theme: '身份',
    category: '成长'
  },
  {
    id: 'harrypotter',
    title: '《哈利·波特》',
    quoteCn: '“表现我们真实自我的，是我们所做的选择，而非我们的能力。”',
    quoteEn: 'It is our choices that show what we truly are, far more than our abilities.',
    description: '魔法世界里的勇气与友谊。',
    image: 'https://picsum.photos/seed/castle-magic-wand/800/600',
    theme: '选择',
    category: '成长'
  },
  {
    id: 'lotr',
    title: '《指环王》',
    quoteCn: '“我们所要决定的是如何处理被赋予的时间。”',
    quoteEn: 'All we have to decide is what to do with the time that is given to us.',
    description: '在宏大的史诗中寻找微小的光芒。',
    image: 'https://picsum.photos/seed/mountain-ring-journey/800/600',
    theme: '使命',
    category: '勇气'
  },
  {
    id: 'findingnemo',
    title: '《海底总动员》',
    quoteCn: '“游吧，游吧，只要不停下。”',
    quoteEn: 'Just keep swimming.',
    description: '简单的坚持，是通往目标的唯一途径。',
    image: 'https://picsum.photos/seed/ocean-clownfish-coral/800/600',
    theme: '乐观',
    category: '坚持'
  },
  {
    id: 'kungfupanda',
    title: '《功夫熊猫》',
    quoteCn: '“昨天已成历史，明天还是未知，而今天则是礼物。”',
    quoteEn: 'Yesterday is history, tomorrow is a mystery, but today is a gift.',
    description: '活在当下，发现内在的力量。',
    image: 'https://picsum.photos/seed/panda-mountain-temple/800/600',
    theme: '当下',
    category: '成长'
  },
  {
    id: 'mulan',
    title: '《花木兰》',
    quoteCn: '“在逆境中盛开的花朵是最稀有、最美丽的。”',
    quoteEn: 'The flower that blooms in adversity is the most rare and beautiful of all.',
    description: '勇气与孝心，在战场上绽放。',
    image: 'https://picsum.photos/seed/warrior-sword-cherryblossom/800/600',
    theme: '逆境',
    category: '勇气'
  },
  {
    id: 'ratatouille',
    title: '《料理鼠王》',
    quoteCn: '“人人都能烹饪，但只有无畏者才能成就伟大。”',
    quoteEn: 'Anyone can cook, but only the fearless can be great.',
    description: '天赋不分出身，梦想不设限。',
    image: 'https://picsum.photos/seed/chef-kitchen-paris/800/600',
    theme: '天赋',
    category: '梦想'
  },
  {
    id: 'up',
    title: '《飞屋环游记》',
    quoteCn: '“冒险就在那里！”',
    quoteEn: 'Adventure is out there!',
    description: '无论年纪多大，心永远在路上。',
    image: 'https://picsum.photos/seed/house-balloons-sky/800/600',
    theme: '冒险',
    category: '梦想'
  },
  {
    id: 'toystory',
    title: '《玩具总动员》',
    quoteCn: '“飞向宇宙，浩瀚无垠！”',
    quoteEn: 'To infinity and beyond!',
    description: '友谊与忠诚，超越时空的界限。',
    image: 'https://picsum.photos/seed/toys-bedroom-adventure/800/600',
    theme: '友谊',
    category: '梦想'
  },
  {
    id: 'gatsby',
    title: '《了不起的盖茨比》',
    quoteCn: '“于是我们奋力向前，逆水行舟，被不断地推回过去。”',
    quoteEn: 'So we beat on, boats against the current, borne back ceaselessly into the past.',
    description: '追逐那盏绿灯，追逐永恒的幻梦。',
    image: 'https://picsum.photos/seed/party-mansion-luxury/800/600',
    theme: '执着',
    category: '梦想'
  },
  {
    id: 'casablanca',
    title: '《卡萨布兰卡》',
    quoteCn: '“孩子，就看你的了。”',
    quoteEn: 'Here\'s looking at you, kid.',
    description: '乱世中的爱情与牺牲。',
    image: 'https://picsum.photos/seed/classic-airport-fog/800/600',
    theme: '牺牲',
    category: '勇气'
  },
  {
    id: 'gonewithwind',
    title: '《乱世佳人》',
    quoteCn: '“毕竟，明天又是新的一天！”',
    quoteEn: 'After all, tomorrow is another day!',
    description: '坚韧不拔的生命力。',
    image: 'https://picsum.photos/seed/plantation-sunset-romance/800/600',
    theme: '希望',
    category: '坚持'
  },
  {
    id: 'wizardofoz',
    title: '《绿野仙踪》',
    quoteCn: '“没有任何地方比得上家。”',
    quoteEn: 'There\'s no place like home.',
    description: '寻找智慧、爱与勇气的旅程。',
    image: 'https://picsum.photos/seed/yellow-brick-road/800/600',
    theme: '归属',
    category: '成长'
  },
  {
    id: 'mockingbird',
    title: '《杀死一只知更鸟》',
    quoteCn: '“除非你从一个人的角度考虑问题，否则你永远无法真正理解他。”',
    quoteEn: 'You never really understand a person until you consider things from his point of view.',
    description: '正义与同理心的启蒙。',
    image: 'https://picsum.photos/seed/courtroom-justice-old/800/600',
    theme: '正义',
    category: '成长'
  },
  {
    id: 'schindler',
    title: '《辛德勒的名单》',
    quoteCn: '“救人一命，即救全世界。”',
    quoteEn: 'Whoever saves one life, saves the world entire.',
    description: '在人性毁灭的边缘，闪耀的光辉。',
    image: 'https://picsum.photos/seed/red-coat-hope/800/600',
    theme: '人性',
    category: '勇气'
  },
  {
    id: 'pulpfiction',
    title: '《低俗小说》',
    quoteCn: '“义人的道路四面受敌。”',
    quoteEn: 'The path of the righteous man is beset on all sides.',
    description: '黑色幽默与命运的交织。',
    image: 'https://picsum.photos/seed/dance-suit-classic/800/600',
    theme: '命运',
    category: '成长'
  },
  {
    id: 'fightclub',
    title: '《搏击俱乐部》',
    quoteCn: '“你拥有的东西最终会拥有你。”',
    quoteEn: 'The things you own end up owning you.',
    description: '对消费主义的疯狂反击。',
    image: 'https://picsum.photos/seed/soap-underground-fight/800/600',
    theme: '自由',
    category: '成长'
  },
  {
    id: 'matrix',
    title: '《黑客帝国》',
    quoteCn: '“知道路和走路是有区别的。”',
    quoteEn: 'There is a difference between knowing the path and walking the path.',
    description: '觉醒，选择红药丸。',
    image: 'https://picsum.photos/seed/digital-code-green/800/600',
    theme: '觉醒',
    category: '勇气'
  },
  {
    id: 'inception',
    title: '《盗梦空间》',
    quoteCn: '“一个想法就像病毒。有韧性。极具传染性。”',
    quoteEn: 'An idea is like a virus. Resilient. Highly contagious.',
    description: '在梦境的深处植入信念。',
    image: 'https://picsum.photos/seed/spinning-top-dream/800/600',
    theme: '信念',
    category: '梦想'
  },
  {
    id: 'interstellar',
    title: '《星际穿越》',
    quoteCn: '“不要温顺地走进那个良夜。怒斥那光明的消逝。”',
    quoteEn: 'Do not go gentle into that good night. Rage against the dying of the light.',
    description: '爱是唯一可以超越时空维度的东西。',
    image: 'https://picsum.photos/seed/black-hole-space/800/600',
    theme: '爱',
    category: '坚持'
  },
  {
    id: 'martian',
    title: '《火星救援》',
    quoteCn: '“你解决一个问题……然后解决下一个。”',
    quoteEn: 'You solve one problem... and then you solve the next one.',
    description: '科学与乐观，在火星上生存。',
    image: 'https://picsum.photos/seed/mars-red-planet/800/600',
    theme: '生存',
    category: '坚持'
  },
  {
    id: 'gravity',
    title: '《地心引力》',
    quoteCn: '“不要放手。”',
    quoteEn: 'Don\'t let go.',
    description: '在无垠的太空中寻找生的希望。',
    image: 'https://picsum.photos/seed/earth-space-shuttle/800/600',
    theme: '希望',
    category: '勇气'
  },
  {
    id: 'whiplash',
    title: '《爆裂鼓手》',
    quoteCn: '“英语中没有哪两个词比‘做得好’更有害了。”',
    quoteEn: 'There are no two words in the English language more harmful than \'good job\'.',
    description: '对极致的疯狂追求。',
    image: 'https://picsum.photos/seed/drums-jazz-intense/800/600',
    theme: '极致',
    category: '坚持'
  },
  {
    id: 'lalaland',
    title: '《爱乐之城》',
    quoteCn: '“献给那些追梦的人，哪怕他们看起来很傻。”',
    quoteEn: 'Here\'s to the ones who dream, foolish as they may seem.',
    description: '星空下的舞步，梦想与爱情的博弈。',
    image: 'https://picsum.photos/seed/dance-sunset-city/800/600',
    theme: '梦想',
    category: '梦想'
  },
  {
    id: 'greenbook',
    title: '《绿皮书》',
    quoteCn: '“暴力永远赢不了。只有当你保持尊严时，你才赢了。”',
    quoteEn: 'You never win with violence. You only win when you maintain your dignity.',
    description: '跨越偏见的友谊之旅。',
    image: 'https://picsum.photos/seed/car-road-trip-piano/800/600',
    theme: '尊严',
    category: '成长'
  },
  {
    id: 'parasite',
    title: '《寄生虫》',
    quoteCn: '“你知道什么样的计划永远不会失败吗？根本没有计划。”',
    quoteEn: 'You know what kind of plan never fails? No plan at all.',
    description: '阶级鸿沟下的黑色悲剧。',
    image: 'https://picsum.photos/seed/modern-house-stairs/800/600',
    theme: '阶级',
    category: '成长'
  },
  {
    id: 'joker',
    title: '《小丑》',
    quoteCn: '“我曾以为我的生活是一场悲剧，但现在我意识到，它是一场喜剧。”',
    quoteEn: 'I used to think that my life was a tragedy, but now I realize, it\'s a comedy.',
    description: '社会的边缘，疯狂的诞生。',
    image: 'https://picsum.photos/seed/stairs-dance-clown/800/600',
    theme: '疯狂',
    category: '成长'
  },
  {
    id: 'endgame',
    title: '《复仇者联盟4》',
    quoteCn: '“我爱你三千遍。”',
    quoteEn: 'I love you 3000.',
    description: '终局之战，英雄的谢幕。',
    image: 'https://picsum.photos/seed/hero-team-battle/800/600',
    theme: '牺牲',
    category: '勇气'
  },
  {
    id: 'spiderman',
    title: '《蜘蛛侠》',
    quoteCn: '“能力越大，责任越大。”',
    quoteEn: 'With great power comes great responsibility.',
    description: '平凡少年的英雄之路。',
    image: 'https://picsum.photos/seed/city-swing-hero/800/600',
    theme: '责任',
    category: '成长'
  },
  {
    id: 'wonderwoman',
    title: '《神奇女侠》',
    quoteCn: '“这不是关于值得，而是关于你相信什么。而我相信爱。”',
    quoteEn: 'It\'s not about deserve, it\'s about what you believe. And I believe in love.',
    description: '在战争中寻找爱与和平。',
    image: 'https://picsum.photos/seed/shield-sword-warrior/800/600',
    theme: '爱',
    category: '勇气'
  },
  {
    id: 'blackpanther',
    title: '《黑豹》',
    quoteCn: '“在危机时刻，智者建桥，愚者筑墙。”',
    quoteEn: 'In times of crisis, the wise build bridges, while the foolish build barriers.',
    description: '瓦坎达万岁，责任与传承。',
    image: 'https://picsum.photos/seed/wakanda-city-tech/800/600',
    theme: '智慧',
    category: '成长'
  },
  {
    id: 'coco',
    title: '《寻梦环游记》',
    quoteCn: '“请记住我。”',
    quoteEn: 'Remember me.',
    description: '死亡不是终点，遗忘才是。',
    image: 'https://picsum.photos/seed/guitar-marigold-bridge/800/600',
    theme: '记忆',
    category: '梦想'
  },
  {
    id: 'soul',
    title: '《心灵奇旅》',
    quoteCn: '“我只是担心如果我今天死了，我的生活将一事无成。”',
    quoteEn: 'I\'m just afraid that if I died today, my life would have amounted to nothing.',
    description: '寻找生命的“火花”。',
    image: 'https://picsum.photos/seed/soul/800/600',
    theme: '生命',
    category: '成长'
  },
  {
    id: 'insideout',
    title: '《头脑特工队》',
    quoteCn: '“替我带她去月球，好吗？”',
    quoteEn: 'Take her to the moon for me, okay?',
    description: '情绪的成长，告别童年。',
    image: 'https://picsum.photos/seed/emotions-control-center/800/600',
    theme: '情绪',
    category: '成长'
  },
  {
    id: 'zootopia',
    title: '《疯狂动物城》',
    quoteCn: '“无论你是什么类型的动物，改变都从你开始。”',
    quoteEn: 'No matter what type of animal you are, change starts with you.',
    description: '打破偏见，尝试一切可能。',
    image: 'https://picsum.photos/seed/zootopia/800/600',
    theme: '改变',
    category: '勇气'
  },
  {
    id: 'moana',
    title: '《海洋奇缘》',
    quoteCn: '“无论你去哪里，我都会陪着你。”',
    quoteEn: 'There\'s nowhere you could go that I won\'t be with you.',
    description: '听从大海的召唤，寻找自我。',
    image: 'https://picsum.photos/seed/ocean-boat-island/800/600',
    theme: '自我',
    category: '成长'
  },
  {
    id: 'frozen',
    title: '《冰雪奇缘》',
    quoteCn: '“随它吧。”',
    quoteEn: 'Let it go.',
    description: '接纳真实的自己，释放力量。',
    image: 'https://picsum.photos/seed/ice-castle-snow/800/600',
    theme: '接纳',
    category: '成长'
  },
  {
    id: 'tangled',
    title: '《魔发奇缘》',
    quoteCn: '“去实现你的梦想。”',
    quoteEn: 'Go live your dream.',
    description: '走出舒适区，迎接新世界。',
    image: 'https://picsum.photos/seed/tangled/800/600',
    theme: '梦想',
    category: '梦想'
  },
  {
    id: 'brave',
    title: '《勇敢传说》',
    quoteCn: '“我们的命运就活在我们心中。”',
    quoteEn: 'Our fate lives within us.',
    description: '改变命运，需要真正的勇气。',
    image: 'https://picsum.photos/seed/archery-forest-scotland/800/600',
    theme: '命运',
    category: '勇气'
  }
];

export default function MovieGallery() {
  const [filter, setFilter] = useState('全部');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const filteredMovies = filter === '全部' 
    ? movies 
    : movies.filter(m => m.category === filter);

  return (
    <div className="min-h-screen bg-surface-container-lowest p-6 md:p-12">
      <header className="max-w-7xl mx-auto mb-16 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-primary"></div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim"></div>
            </div>
          </div>
          <h1 className="text-5xl font-black text-on-surface font-headline tracking-tighter leading-none mb-4">电影励志画廊</h1>
          <p className="text-on-surface-variant max-w-lg font-medium">通过每一帧精心挑选的银幕瞬间，重拾前行的力量。在这里，光影不仅是艺术，更是对梦想的注脚。</p>
        </motion.div>
        
        <div className="flex flex-wrap gap-3">
          {['全部', '坚持', '梦想', '成长', '勇气'].map((cat) => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-bold transition-all active:scale-95 ${
                filter === cat 
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                  : 'bg-surface-container-lowest text-slate-600 hover:bg-primary-fixed'
              }`}
            >
              {cat === '全部' ? '全部展示' : cat}
            </button>
          ))}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredMovies.map((movie, index) => (
            <motion.article 
              key={movie.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-card rounded-3xl p-6 flex flex-col group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-white/40"
            >
              <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[16/10]">
                <img
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={movie.image}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-bold tracking-widest uppercase">{movie.category}</span>
                </div>
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-black text-on-surface tracking-tight">{movie.title}</h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedMovie(movie)}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors shadow-sm"
                    >
                      <Play className="w-5 h-5 fill-current" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-error hover:bg-error-container transition-colors shadow-sm">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 italic">
                  <p className="text-xl font-black text-blue-600 leading-tight font-headline line-clamp-3">{movie.quoteEn}</p>
                  <p className="text-sm text-slate-500 font-medium line-clamp-2">{movie.quoteCn}</p>
                  <p className="text-xs text-on-surface-variant opacity-70 line-clamp-2">{movie.description}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-blue-100/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">主题：{movie.theme}</span>
                </div>
                <button 
                  onClick={() => setSelectedMovie(movie)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  查看详情
                </button>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </section>

      <footer className="mt-20 flex flex-col items-center gap-6">
        <div className="flex items-center gap-4 text-slate-300">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-slate-300"></div>
          <Cloud className="w-6 h-6" />
          <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-slate-300"></div>
        </div>
        <button className="group flex items-center gap-3 px-10 py-4 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-primary font-bold hover:bg-primary hover:text-white transition-all shadow-xl shadow-blue-500/5">
          <span>探索更多金句</span>
          <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
        <p className="text-xs text-slate-400 mt-4">已经到底啦，明天再来看看新的灵感吧！</p>
      </footer>

      {/* Movie Detail Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <MovieDetailModal 
            movie={selectedMovie} 
            onClose={() => setSelectedMovie(null)} 
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function MovieDetailModal({ movie, onClose, isMuted, onToggleMute }: { movie: Movie, onClose: () => void, isMuted: boolean, onToggleMute: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const hasPlayedOnce = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTTS = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(movie.quoteEn || '');
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.volume = isMuted ? 0 : 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const playOriginalAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);

    if (movie.audioUrl) {
      const audio = new Audio(movie.audioUrl);
      audio.preload = 'auto';
      audio.loop = false;
      audio.muted = isMuted;
      audioRef.current = audio;
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => playTTS();
      
      audio.play().catch(() => playTTS());
    } else {
      playTTS();
    }
  };

  useEffect(() => {
    if (!hasPlayedOnce.current) {
      playOriginalAudio();
      hasPlayedOnce.current = true;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      window.speechSynthesis.cancel();
    };
  }, [movie.id]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
    if (isMuted) {
      window.speechSynthesis.cancel();
    }
  }, [isMuted]);

  const handleDownloadWallpaper = () => {
    const link = document.createElement('a');
    link.href = movie.image;
    link.download = `${movie.title}-wallpaper.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        key={movie.id}
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0502] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row transform-gpu"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_30%,#3a1510_0%,transparent_60%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_10%_80%,#ff4e00_0%,transparent_50%)]"></div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full md:w-2/5 relative aspect-video md:aspect-auto overflow-hidden">
          <img 
            src={movie.image} 
            alt={movie.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 flex items-end gap-1 h-8">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={isPlaying ? { height: [4, 24, 8, 16, 4] } : { height: 4 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.6 + Math.random() * 0.4,
                  delay: i * 0.05 
                }}
                className="w-1 bg-primary rounded-full"
              />
            ))}
            <span className="ml-3 text-white/60 text-[8px] font-bold tracking-widest uppercase">
              {isPlaying ? 'Playing...' : 'Muted'}
            </span>
          </div>
        </div>

        <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col relative z-10 overflow-y-auto">
          <div className="space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold text-[10px] tracking-widest uppercase">{movie.category} · {movie.theme}</span>
                {movie.audioUrl && (
                  <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[8px] font-bold rounded border border-green-500/30">ORIGINAL AUDIO</span>
                )}
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white font-headline tracking-tighter leading-tight">
                {movie.title}
              </h2>
            </div>

            <div className="relative space-y-4 min-h-[120px]">
              <div className="space-y-1">
                <p className="text-xl md:text-2xl font-sans font-bold text-white leading-tight drop-shadow-sm">
                  {movie.quoteEn}
                </p>
              </div>
              <p className="text-base md:text-lg font-serif italic text-white/60 leading-relaxed drop-shadow-sm">
                {movie.quoteCn}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <p className="text-sm text-white/50 leading-relaxed line-clamp-3">
                {movie.description}
              </p>
              
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={playOriginalAudio}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>重播原声</span>
                </button>
                <button 
                  onClick={onToggleMute}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isMuted ? '取消静音' : '静音'}</span>
                </button>
                <button 
                  onClick={handleDownloadWallpaper}
                  className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-white text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  <Download className="w-4 h-4" />
                  <span>保存壁纸</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
