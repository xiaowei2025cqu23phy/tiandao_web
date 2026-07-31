/** 周公解梦 — 梦境符号库 */

export interface DreamEntry {
  keyword: string;
  category: string;
  interpretation: string;
  lucky: string;
}

export const dreamCategories = [
  '全部','自然','动物','人物','身体','物品','场景','行为','食物','鬼神',
];

export const dreamData: DreamEntry[] = [
  // 自然
  { keyword: '水', category: '自然', interpretation: '梦见水主财运，清水主吉，浊水主凶。水流平稳则事业顺利，洪水滔天则需警惕风险。', lucky: '★★★★' },
  { keyword: '火', category: '自然', interpretation: '梦见火主名声运，火势旺盛主事业兴旺。被火烧身则需注意口舌是非。温和之火主家庭和睦。', lucky: '★★★' },
  { keyword: '山', category: '自然', interpretation: '梦见高山主前程远大，攀登主进取心强。山崩则需防意外变故。远山朦胧主有惊喜将至。', lucky: '★★★★' },
  { keyword: '雨', category: '自然', interpretation: '梦见下雨主情感运，细雨绵绵主恋情甜蜜。暴雨倾盆则情绪波动。雨后彩虹主困境将过。', lucky: '★★★' },
  { keyword: '太阳', category: '自然', interpretation: '梦见太阳主光明运，旭日东升主事业起飞。烈日当空主精力充沛。日落西山则需珍惜当下。', lucky: '★★★★★' },
  { keyword: '月亮', category: '自然', interpretation: '梦见月亮主情感运，圆月主团圆美满。新月主新恋情萌芽。月食则感情有波折。', lucky: '★★★★' },
  { keyword: '星星', category: '自然', interpretation: '梦见星星主贵人运，满天星斗主前程似锦。流星划过主许愿可成。暗淡之星则需等待时机。', lucky: '★★★★' },
  { keyword: '风', category: '自然', interpretation: '梦见刮风主变动运，春风拂面主好消息。狂风大作则需防口舌之争。微风徐徐主心情舒畅。', lucky: '★★★' },
  { keyword: '雪', category: '自然', interpretation: '梦见雪主纯净运，白雪皑皑主一切从头开始。雪中漫步主浪漫邂逅。雪崩则需防意外。', lucky: '★★★★' },
  { keyword: '花', category: '自然', interpretation: '梦见花开主桃花运，百花齐放主事业兴旺。花谢则需珍惜眼前人。收到花主有喜事临门。', lucky: '★★★★★' },

  // 动物
  { keyword: '蛇', category: '动物', interpretation: '梦见蛇主财运/生育运。蛇缠绕主财富将至。被蛇咬则需防小人暗算。白蛇主贵人相助。', lucky: '★★★★' },
  { keyword: '鱼', category: '动物', interpretation: '梦见鱼主财运，鱼跃龙门主事业飞跃。捕鱼丰收主收入增加。死鱼则需防破财。', lucky: '★★★★★' },
  { keyword: '狗', category: '动物', interpretation: '梦见狗主朋友运，温顺之狗主忠诚友谊。恶犬狂吠则防口舌。小狗主新朋友出现。', lucky: '★★★★' },
  { keyword: '猫', category: '动物', interpretation: '梦见猫主女性运，温顺之猫主家庭安宁。野猫则需防女性小人。猫叫主有暧昧关系。', lucky: '★★★' },
  { keyword: '鸟', category: '动物', interpretation: '梦见飞鸟主自由运，展翅高飞主事业突破。笼中之鸟则感压抑。群鸟归巢主家庭团圆。', lucky: '★★★★' },
  { keyword: '马', category: '动物', interpretation: '梦见马主事业运，策马奔腾主事业加速。马车平稳主稳步前进。野马难驯则需收敛锋芒。', lucky: '★★★★' },
  { keyword: '龙', category: '动物', interpretation: '梦见龙主大吉，飞龙在天主事业登顶。双龙戏珠主喜结良缘。见龙在田主贵人提携。', lucky: '★★★★★' },
  { keyword: '虎', category: '动物', interpretation: '梦见老虎主权威运，猛虎下山主职位晋升。与虎对峙则面临挑战。驯服猛虎主克服困难。', lucky: '★★★★' },
  { keyword: '蜘蛛', category: '动物', interpretation: '梦见蜘蛛主财运，蜘蛛结网主财路渐开。被蜘蛛咬则防口舌。见蛛丝则好事将近。', lucky: '★★★' },
  { keyword: '蝴蝶', category: '动物', interpretation: '梦见蝴蝶主变化运，蝶变主人生转折。彩蝶飞舞主喜事临门。追逐蝴蝶主追求美好。', lucky: '★★★★' },

  // 人物
  { keyword: '已故亲人', category: '人物', interpretation: '梦见已故亲人主思念之情。若面带微笑则在天有灵保佑。若哭泣则需祭祀表达哀思。', lucky: '★★★' },
  { keyword: '婴儿', category: '人物', interpretation: '梦见婴儿主新生运，怀抱婴儿主新计划启动。婴儿啼哭则需关注细节。多个婴儿主财运旺盛。', lucky: '★★★★' },
  { keyword: '老人', category: '人物', interpretation: '梦见老人主智慧运，与老人交谈主获得指点。白发老人主长寿之兆。陌生老人主贵人相助。', lucky: '★★★★' },
  { keyword: '老师', category: '人物', interpretation: '梦见老师主学习运，被老师夸奖主能力认可。考试梦见老师则成绩提升。老师批评则需反思。', lucky: '★★★' },
  { keyword: '医生', category: '人物', interpretation: '梦见医生主健康运，看病主需关注身体。医生开药方则问题将解。白大褂医生主事业转机。', lucky: '★★★' },
  { keyword: '警察', category: '人物', interpretation: '梦见警察主是非运，被盘问则心中有愧。警察帮忙主困难将化解。穿制服则主权威认可。', lucky: '★★' },
  { keyword: '朋友', category: '人物', interpretation: '梦见朋友主社交运，老友重逢主旧情复燃。朋友远行主聚散有时。朋友赠物主好运将至。', lucky: '★★★★' },
  { keyword: '陌生人', category: '人物', interpretation: '梦见陌生人主变化运，友善之人主新机遇。面目狰狞则防小人。与陌生人交谈主贵人将至。', lucky: '★★★' },

  // 身体
  { keyword: '牙齿', category: '身体', interpretation: '梦见掉牙主健康运，门牙脱落则长辈健康堪忧。牙齿洁白主自信满满。牙齿松动主决策犹豫。', lucky: '★★' },
  { keyword: '头发', category: '身体', interpretation: '梦见头发主精力运，长发飘飘主精神焕发。脱发则注意身体健康。白发则主智慧增长。', lucky: '★★★' },
  { keyword: '血', category: '身体', interpretation: '梦见血主财运，流血主意外之财。献血主善有善报。血迹斑斑则需防破财。', lucky: '★★' },
  { keyword: '眼睛', category: '身体', interpretation: '梦见眼睛主洞察力，明亮之眼主看透人心。失明则需谨慎决策。第三只眼主灵性觉醒。', lucky: '★★★' },
  { keyword: '手', category: '身体', interpretation: '梦见手主行动力，有力之手主事业进展。受伤之手则计划受阻。握手主合作顺利。', lucky: '★★★' },
  { keyword: '脚', category: '身体', interpretation: '梦见脚主行动运，健步如飞主事业顺利。崴脚则需放慢脚步。赤脚主回归本真。', lucky: '★★' },

  // 物品
  { keyword: '钱', category: '物品', interpretation: '梦见钱主财运，捡到钱主意外之喜。丢钱则需节约开支。数钱主财富积累中。', lucky: '★★★★' },
  { keyword: '钥匙', category: '物品', interpretation: '梦见钥匙主解决运，找到钥匙主难题将解。丢失钥匙则暂时困顿。金钥匙主大好机遇。', lucky: '★★★★' },
  { keyword: '手机', category: '物品', interpretation: '梦见手机主沟通运，手机响主重要消息。手机坏则沟通不畅。新手机主新的人际圈。', lucky: '★★★' },
  { keyword: '镜子', category: '物品', interpretation: '梦见镜子主自省运，照镜主自我审视。镜碎则需防人际关系破裂。明亮之镜主好运连连。', lucky: '★★★' },
  { keyword: '钟表', category: '物品', interpretation: '梦见钟表主时间运，钟表停走主某事将终结。快转之钟主紧迫感。准点之钟主万事顺利。', lucky: '★★' },
  { keyword: '书', category: '物品', interpretation: '梦见书主学习运，读书主知识增长。写作之书主创造力爆发。旧书主回顾过往经验。', lucky: '★★★★' },
  { keyword: '车', category: '物品', interpretation: '梦见车主事业运，开车主掌控人生方向。等车则需耐心等待时机。豪华车主地位提升。', lucky: '★★★★' },
  { keyword: '房子', category: '物品', interpretation: '梦见房子主家运，新房主生活新阶段。破旧房屋则需修缮关系。豪宅主目标远大。', lucky: '★★★★' },

  // 场景
  { keyword: '考试', category: '场景', interpretation: '梦见考试主压力运，顺利答题主自信满满。忘带笔则准备不足。考满分主能力被认可。', lucky: '★★★' },
  { keyword: '婚礼', category: '场景', interpretation: '梦见婚礼主喜运，参加婚礼主分享喜悦。自己结婚主人生新阶段。婚礼出状况则稍有波折。', lucky: '★★★★★' },
  { keyword: '葬礼', category: '场景', interpretation: '梦见葬礼主结束运，旧事终结主新的开始。参加葬礼主送走霉运。棺材则主升官发财。', lucky: '★★★★' },
  { keyword: '医院', category: '场景', interpretation: '梦见医院主健康运，住院则需注意身体。探病则主关心他人。出院主问题将解决。', lucky: '★★' },
  { keyword: '学校', category: '场景', interpretation: '梦见学校主成长运，回母校主怀旧之情。上课则主需要学习新知识。毕业则主人生进阶。', lucky: '★★★' },
  { keyword: '旅行', category: '场景', interpretation: '梦见旅行主变化运，愉快旅途主好运将至。迷路则暂时迷茫。独自旅行主独立成长。', lucky: '★★★★' },
  { keyword: '电梯', category: '场景', interpretation: '梦见电梯主起伏运，电梯上升主事业爬升。电梯下降则稍有不顺。电梯故障则计划暂停。', lucky: '★★★' },
  { keyword: '桥', category: '场景', interpretation: '梦见桥主转折运，过桥主人生节点。断桥则需绕道而行。拱桥主虽有曲折终达彼岸。', lucky: '★★★★' },

  // 行为
  { keyword: '飞', category: '行为', interpretation: '梦见飞翔主自由运，展翅高飞主抱负远大。低空飞行主脚踏实地。飞翔中坠落则目标过高。', lucky: '★★★★' },
  { keyword: '逃跑', category: '行为', interpretation: '梦见逃跑主压力运，被人追赶主逃避现实。成功逃脱主困难将过。跑不动则心中负担重。', lucky: '★★' },
  { keyword: '坠落', category: '行为', interpretation: '梦见坠落主不安运，从高处坠落主失去掌控。缓慢坠落主心态平和。坠入水中主情绪波动。', lucky: '★★' },
  { keyword: '游泳', category: '行为', interpretation: '梦见游泳主情感运，畅游水中主心情舒畅。溺水则需注意健康。教人游泳主分享快乐。', lucky: '★★★★' },
  { keyword: '争吵', category: '行为', interpretation: '梦见争吵主口舌运，与人争吵主心中不满。和好如初主矛盾将化解。大声喊叫主需要表达。', lucky: '★★' },
  { keyword: '唱歌', category: '行为', interpretation: '梦见唱歌主心情运，登台演唱主才华展示。记不住词则准备不足。听到歌声主喜事临门。', lucky: '★★★★' },
  { keyword: '吃饭', category: '行为', interpretation: '梦见吃饭主口福运，美味佳肴主生活滋润。饿肚子则需补充能量。宴请他人主社交活跃。', lucky: '★★★★' },
  { keyword: '拥抱', category: '行为', interpretation: '梦见拥抱主情感运，拥抱爱人主感情升温。拥抱陌生人主新的缘分。被拒绝拥抱则情感受挫。', lucky: '★★★★★' },

  // 食物
  { keyword: '水果', category: '食物', interpretation: '梦见水果主收获运，新鲜水果主成果丰硕。腐烂水果则需及时止损。摘水果主付出有回报。', lucky: '★★★★' },
  { keyword: '米饭', category: '食物', interpretation: '梦见米饭主食禄运，白米饭主生活安稳。米饭馊了则需注意饮食。煮饭主家庭和睦。', lucky: '★★★' },
  { keyword: '面条', category: '食物', interpretation: '梦见面条主长寿运，吃面主福寿绵长。煮面主准备迎接好运。面条断开则注意身体健康。', lucky: '★★★★' },
  { keyword: '糖果', category: '食物', interpretation: '梦见糖果主甜蜜运，吃糖主心情愉快。送礼之糖主人际和谐。糖果化了则好事多磨。', lucky: '★★★★' },

  // 鬼神
  { keyword: '佛', category: '鬼神', interpretation: '梦见佛像主庇佑运，拜佛主心中有信仰。佛光普照主大吉大利。梦中诵经主心灵净化。', lucky: '★★★★★' },
  { keyword: '鬼', category: '鬼神', interpretation: '梦见鬼主压力运，恶鬼追逐主心中恐惧。与鬼交谈主心结将解。鬼消失则霉运已过。', lucky: '★★' },
  { keyword: '神仙', category: '鬼神', interpretation: '梦见神仙主大吉，神仙赐福主天降好运。与神仙对话主得高人指点。腾云驾雾主境界提升。', lucky: '★★★★★' },
  { keyword: '祖先', category: '鬼神', interpretation: '梦见祖先主庇荫运，祖先微笑主在天有灵。祖先训诫则需反思行为。祭拜祖先主孝心可嘉。', lucky: '★★★★' },
  { keyword: '寺庙', category: '鬼神', interpretation: '梦见寺庙主修行运，进寺烧香主求心安。寺庙钟声主警醒自身。晨钟暮鼓主生活有规律。', lucky: '★★★★' },
];

export function searchDreams(query: string): DreamEntry[] {
  const q = query.toLowerCase();
  return dreamData.filter(d =>
    d.keyword.includes(q) || d.interpretation.includes(q) || d.category.includes(q)
  );
}

export function getRandomDreams(n: number): DreamEntry[] {
  const shuffled = [...dreamData].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
