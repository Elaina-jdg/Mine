/**
 * test-dom.js —— 不依赖浏览器,用最小 DOM 桩真实执行 calc.js + app.js,
 * 验证页面初始化渲染、切换标签、修改输入、错误提示等行为。
 * 运行:node test-dom.js
 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + (extra !== undefined ? '  → ' + extra : '')); }
}
/** 独立实现的等额本息参考公式(用于交叉校验页面输出) */
function refMonthly(ratePct, years, amount) {
  const r = ratePct / 1200, n = years * 12;
  if (r === 0) return amount / n;
  return amount * r / (1 - 1 / Math.pow(1 + r, n));
}
const fmt = (n) => '¥' + n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ---------------- 最小 DOM 桩 ---------------- */
function makeEl(tag, opts) {
  opts = opts || {};
  const el = {
    tagName: (tag || 'div').toUpperCase(),
    id: opts.id || '',
    value: opts.value !== undefined ? opts.value : '',
    textContent: '', innerHTML: '', hidden: false,
    style: {}, children: [], _attrs: {}, _handlers: {}, _classes: new Set(opts.classes || []),
    _chips: opts.chips || null,
    _sel: opts.sel || {},
    addEventListener(t, fn) { (el._handlers[t] = el._handlers[t] || []).push(fn); },
    setAttribute(k, v) { el._attrs[k] = String(v); },
    getAttribute(k) { return el._attrs[k] !== undefined ? el._attrs[k] : null; },
    appendChild(c) { el.children.push(c); return c; },
    removeChild(c) { el.children = el.children.filter(x => x !== c); return c; },
    select() {}, focus() {},
    closest(sel) { return opts.closestChip && sel === '.chip' ? el : null; },
    querySelector(sel) { return el._sel[sel] || null; },
    querySelectorAll(sel) { return el._chips && sel === '.chip' ? el._chips : []; }
  };
  el.classList = {
    add: (c) => el._classes.add(c),
    remove: (c) => el._classes.delete(c),
    contains: (c) => el._classes.has(c),
    toggle: (c, on) => { if (on === undefined) { el._classes.has(c) ? el._classes.delete(c) : el._classes.add(c); } else if (on) el._classes.add(c); else el._classes.delete(c); }
  };
  return el;
}

const ids = ['loan-form', 'rate', 'years', 'amount', 'rate-range', 'years-range', 'amount-range',
  'error', 'monthly', 'monthly-sub', 'total-payment', 'total-payment-wan', 'total-interest',
  'total-interest-wan', 'principal', 'principal-wan', 'months', 'interest-ratio',
  'donut-principal', 'donut-interest', 'legend-principal', 'legend-interest',
  'schedule-note', 'reset', 'copy', 'download', 'tab-year', 'tab-month'];
const reg = {};
ids.forEach(id => {
  reg[id] = makeEl('div', {
    id,
    value: id === 'rate' ? '4.9' : id === 'years' ? '20' : id === 'amount' ? '500000' : '',
    classes: id === 'tab-year' ? ['is-active'] : []
  });
});
// range 元素需带 min/max
['rate', 'years', 'amount'].forEach(k => {
  reg[k + '-range']._attrs = { min: k === 'rate' ? '0' : k === 'years' ? '1' : '10000', max: k === 'rate' ? '24' : k === 'years' ? '40' : '3000000' };
});
reg['rate-range'].min = '0'; reg['rate-range'].max = '24'; reg['rate-range'].value = '4.9';
reg['years-range'].min = '1'; reg['years-range'].max = '40'; reg['years-range'].value = '20';
reg['amount-range'].min = '10000'; reg['amount-range'].max = '3000000'; reg['amount-range'].value = '500000';

// 快捷标签组
function makeGroup(target, pairs) {
  const chips = pairs.map(p => makeEl('button', { classes: ['chip'], closestChip: true, value: '' }));
  chips.forEach((c, i) => { c._attrs['data-value'] = pairs[i]; });
  const g = makeEl('div', { classes: ['chips'], chips });
  g._attrs['data-target'] = target;   // app.js 通过该属性识别标签组对应的输入项
  return g;
}
const chipValues = { rate: ['3.1', '3.6', '4.1', '4.9', '0'], years: ['5', '10', '20', '30'], amount: ['100000', '300000', '500000', '1000000'] };
const groups = Object.keys(chipValues).map(k => makeGroup(k, chipValues[k]));
const allChips = groups.reduce((a, g) => a.concat(g._chips), []);

const tableHead = makeEl('thead');
const tableBody = makeEl('tbody');
const scheduleTable = makeEl('table', { sel: { thead: tableHead, tbody: tableBody } });
const body = makeEl('body');

const document = {
  getElementById: (id) => reg[id] || null,
  querySelector: (sel) => sel === '#schedule-table thead' ? tableHead : sel === '#schedule-table tbody' ? tableBody : null,
  querySelectorAll: (sel) => sel === '.chips' ? groups : sel === '.chip' ? allChips : [],
  createElement: (tag) => makeEl(tag),
  body
};

const sandbox = {
  document,
  console,
  setTimeout, clearTimeout,
  navigator: {},                       // 无 clipboard,走 fallback 分支(不会在测试中触发)
  window: {},
  alert: () => {}
};
sandbox.self = undefined;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

// 依次执行页面脚本(与 index.html 中的 <script> 顺序一致)
vm.runInContext(fs.readFileSync(path.join(__dirname, 'calc.js'), 'utf8'), sandbox, { filename: 'calc.js' });
vm.runInContext(fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8'), sandbox, { filename: 'app.js' });

const fire = (el, type) => (el._handlers[type] || []).forEach(fn => fn({ preventDefault() {}, target: el }));
const txt = (id) => reg[id].textContent;

/* ---------------- 断言 ---------------- */
console.log('\n[1] 页面初始化(默认 50 万 / 4.9% / 20 年)');
const m0 = refMonthly(4.9, 20, 500000);
ok('月供与参考公式一致', txt('monthly') === fmt(m0), txt('monthly') + ' vs ' + fmt(m0));
ok('总还款额正确', txt('total-payment') === fmt(m0 * 240), txt('total-payment'));
ok('总利息 = 总还款 − 本金', txt('total-interest') === fmt(m0 * 240 - 500000), txt('total-interest'));
ok('还款期数显示 240 期', txt('months') === '240 期', txt('months'));
ok('摘要行含利率与期数', /4\.9%/.test(txt('monthly-sub')) && /240/.test(txt('monthly-sub')), txt('monthly-sub'));
ok('占比图主轴已写入 stroke-dasharray', !!reg['donut-principal'].getAttribute('stroke-dasharray'));
ok('图例显示本金/利息', /¥500,000\.00/.test(txt('legend-principal')) && /¥/.test(txt('legend-interest')));
ok('错误提示默认隐藏', reg['error'].hidden === true);

console.log('\n[2] 还款计划表(按年 → 按月)');
ok('表头为按年字段', /年份/.test(tableHead.innerHTML), tableHead.innerHTML.slice(0, 60));
ok('表体含 20 行年度数据', (tableBody.innerHTML.match(/<tr>/g) || []).length === 20, (tableBody.innerHTML.match(/<tr>/g) || []).length);
ok('含“第 20 年”行且末年剩余本金为 0', /第 20 年/.test(tableBody.innerHTML) && /¥0\.00/.test(tableBody.innerHTML));
ok('提示文案说明年度数', /20 个还款年度/.test(txt('schedule-note')), txt('schedule-note'));
fire(reg['tab-month'], 'click');
ok('切换到按月后表头变为期数字段', /期数/.test(tableHead.innerHTML));
ok('按月明细共 240 行', (tableBody.innerHTML.match(/<tr>/g) || []).length === 240, (tableBody.innerHTML.match(/<tr>/g) || []).length);
ok('含第 240 期', /第 240 期/.test(tableBody.innerHTML));
ok('按月标签加上了 is-active', reg['tab-month'].classList.contains('is-active') && !reg['tab-year'].classList.contains('is-active'));

console.log('\n[3] 交互:快捷标签 / 手动输入 / 错误处理');
// 点击“30 年”快捷标签(第 4 个 chip)
const chip30 = chipValues.years.indexOf('30');
const y30chip = groups[1]._chips[chip30];
(groups[1]._handlers['click'] || []).forEach(fn => fn({ preventDefault() {}, target: y30chip }));
const m30 = refMonthly(4.9, 30, 500000);
ok('点击 30 年后月供更新', txt('monthly') === fmt(m30), txt('monthly') + ' vs ' + fmt(m30));
ok('期数更新为 360 期', txt('months') === '360 期', txt('months'));
ok('标签高亮切换正确', y30chip.classList.contains('is-active'));

// 手动修改金额(触发 input 事件)
reg['amount'].value = '1000000';
fire(reg['amount'], 'input');
const m30b = refMonthly(4.9, 30, 1000000);
ok('金额改为 100 万后月供翻倍', txt('monthly') === fmt(m30b), txt('monthly') + ' vs ' + fmt(m30b));

// 零利率
reg['rate'].value = '0';
fire(reg['rate'], 'input');
ok('零利率月供 = 1000000 / 360', txt('monthly') === fmt(1000000 / 360), txt('monthly'));
ok('零利率总利息为 0', txt('total-interest') === fmt(0), txt('total-interest'));

// 非法输入
reg['amount'].value = '0';
fire(reg['amount'], 'input');
ok('金额为 0 时显示错误提示', reg['error'].hidden === false && /必须大于 0/.test(reg['error'].textContent), reg['error'].textContent);

// 恢复
fire(reg['reset'], 'click');
ok('重置后回到默认参数', reg['rate'].value === 4.9 || String(reg['rate'].value) === '4.9', reg['rate'].value);
ok('重置后错误提示消失', reg['error'].hidden === true);
ok('重置后月供恢复默认值', txt('monthly') === fmt(refMonthly(4.9, 20, 500000)), txt('monthly'));

console.log('\n结果: ' + pass + ' 通过 / ' + fail + ' 失败');
process.exit(fail ? 1 : 0);
