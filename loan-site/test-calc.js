/**
 * 自测:校验 calc.js 与 Java 版公式的一致性 + 边界情况
 * 运行:node test-calc.js
 */
const C = require('./calc.js');

let pass = 0, fail = 0;
function ok(name, cond, extra) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ ' + name + (extra ? '  → ' + extra : '')); }
}
function near(a, b, tol) { return Math.abs(a - b) <= (tol === undefined ? 0.01 : tol); }

console.log('\n[1] 与 Java 公式对照(参考值)');
const r1 = C.calcLoan(5, 30, 100000);
console.log('    100000 元 / 5% / 30 年 → 月供 ' + C.formatCNY(r1.monthlyPayment) +
  ', 总还款 ' + C.formatCNY(r1.totalPayment) + ', 总利息 ' + C.formatCNY(r1.totalInterest));
ok('月供 ≈ 536.82', near(r1.monthlyPayment, 536.82, 0.01), r1.monthlyPayment);
ok('总还款 ≈ 193255.78', near(r1.totalPayment, 193255.78, 0.01), r1.totalPayment);
ok('期数 = 360', r1.months === 360);
ok('总利息 = 总还款 − 本金', near(r1.totalInterest, r1.totalPayment - 100000));

const r2 = C.calcLoan(4.9, 20, 500000);
console.log('    500000 元 / 4.9% / 20 年 → 月供 ' + C.formatCNY(r2.monthlyPayment) +
  ', 总还款 ' + C.formatCNY(r2.totalPayment) + ', 总利息 ' + C.formatCNY(r2.totalInterest));
ok('月供 ≈ 3272.22', near(r2.monthlyPayment, 3272.22, 0.01), r2.monthlyPayment);
// 与 Java 程序口径一致:总额按“未取整的月供 × 期数”计算(Java 打印时才对总额截断到分)
ok('总还款 ≈ 785332.86(月供未取整口径,同 Java)', near(r2.totalPayment, 785332.86, 0.01), r2.totalPayment);

console.log('\n[2] 计划表自洽性');
const sumPay = r2.schedule.reduce((s, x) => s + x.payment, 0);
const sumPri = r2.schedule.reduce((s, x) => s + x.principal, 0);
const sumInt = r2.schedule.reduce((s, x) => s + x.interest, 0);
ok('逐期还款之和 = 总还款额', near(sumPay, r2.totalPayment), sumPay);
ok('逐期本金之和 = 贷款本金', near(sumPri, 500000), sumPri);
ok('逐期利息之和 = 总利息', near(sumInt, r2.totalInterest), sumInt);
ok('末期剩余本金 = 0', near(r2.schedule[r2.schedule.length - 1].balance, 0));
ok('每期还款额基本相等(等额本息)', r2.schedule.every(x => near(x.payment, r2.monthlyPayment, 0.02)));
ok('利息首期 > 末期(逐月递减)', r2.schedule[0].interest > r2.schedule[r2.schedule.length - 1].interest);
ok('按年汇总年数 = 20', r2.yearly.length === 20);
ok('末年汇总 = 总还款额', near(r2.yearly.reduce((s, y) => s + y.payment, 0), r2.totalPayment));
ok('末年剩余本金 = 0', near(r2.yearly[r2.yearly.length - 1].balance, 0));

console.log('\n[3] 边界与异常');
const z = C.calcLoan(0, 10, 120000);
ok('零利率:月供 = 本金/期数 = 1000', near(z.monthlyPayment, 1000), z.monthlyPayment);
ok('零利率:总利息 = 0', near(z.totalInterest, 0), z.totalInterest);
const one = C.calcLoan(6, 1, 12000);
ok('1 年期:期数 = 12', one.months === 12);
ok('1 年期:末期剩余本金 = 0', near(one.schedule[11].balance, 0));
const throws = (fn) => { try { fn(); return false; } catch (e) { return true; } };
ok('金额为 0 时报错', throws(() => C.calcLoan(5, 10, 0)));
ok('年限为 0 时报错', throws(() => C.calcLoan(5, 0, 1000)));
ok('利率为负时报错', throws(() => C.calcLoan(-1, 10, 1000)));
ok('非数字报错', throws(() => C.calcLoan('abc', 10, 1000)));

console.log('\n[4] 格式化');
ok('金额格式化 ¥1,234,567.89', C.formatCNY(1234567.891) === '¥1,234,567.89', C.formatCNY(1234567.891));
ok('万元换算 193.26 万元', C.toWan(1932557.6).indexOf('193.26') === 0, C.toWan(1932557.6));
ok('CSV 行数 = 期数 + 表头', C.toCSV(r2).split('\r\n').length === r2.months + 1);

console.log('\n结果: ' + pass + ' 通过 / ' + fail + ' 失败');
process.exit(fail ? 1 : 0);
