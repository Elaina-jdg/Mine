/**
 * calc.js —— 贷款计算核心(纯函数,浏览器与 Node 均可使用)
 * 算法完全对应 Java 版 App.java 的等额本息公式:
 *   月利率 = 年利率 / 1200
 *   期数   = 年数 * 12
 *   月供   = 本金 * 月利率 / (1 - 1 / (1 + 月利率)^期数)
 *   总还款 = 月供 * 期数
 */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;      // Node(用于自测)
  } else {
    root.LoanCalc = api;       // 浏览器
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var MONTHS_PER_YEAR = 12;

  /**
   * 计算等额本息贷款
   * @param {number} annualRatePercent 年利率(百分数,如 5 表示 5%)
   * @param {number} years             贷款年限(年)
   * @param {number} loanAmount        贷款本金(元)
   * @returns {{monthlyPayment:number,totalPayment:number,totalInterest:number,
   *            months:number,monthlyRate:number,schedule:Array,yearly:Array}}
   */
  function calcLoan(annualRatePercent, years, loanAmount) {
    var rate = Number(annualRatePercent);
    var yrs = Number(years);
    var principalIn = Number(loanAmount);

    if (!isFinite(rate) || !isFinite(yrs) || !isFinite(principalIn)) {
      throw new Error('年利率、年限、贷款金额都必须填写数字');
    }
    if (principalIn <= 0) throw new Error('贷款金额必须大于 0');
    if (yrs <= 0) throw new Error('贷款年限必须大于 0');
    if (rate < 0) throw new Error('年利率不能为负数');

    var monthlyRate = rate / 1200;                  // 对应 Java: annuallInterestRate / 1200
    var months = Math.round(yrs * MONTHS_PER_YEAR); // 对应 Java: numberOfYears * 12

    var monthlyPayment;
    if (monthlyRate === 0) {
      // Java 版此处会出现 1/0 的除零问题,网页版做“零利率”兼容处理
      monthlyPayment = principalIn / months;
    } else {
      monthlyPayment = principalIn * monthlyRate /
        (1 - 1 / Math.pow(1 + monthlyRate, months));
    }

    // 逐月还款计划(等额本息:每月还款额固定,利息按剩余本金计)
    var schedule = [];
    var balance = principalIn;
    for (var i = 1; i <= months; i++) {
      var interest = balance * monthlyRate;
      var principalPart = monthlyPayment - interest;
      if (i === months) {
        // 末期以剩余本金为准,消除浮点累计误差(总额精确等于本金+利息)
        principalPart = balance;
        interest = Math.max(monthlyPayment - principalPart, 0);
      }
      balance = Math.max(balance - principalPart, 0);
      schedule.push({
        period: i,
        payment: principalPart + interest,
        principal: principalPart,
        interest: interest,
        balance: balance
      });
    }

    var totalPayment = 0;
    for (var k = 0; k < schedule.length; k++) totalPayment += schedule[k].payment;
    var totalInterest = totalPayment - principalIn;

    // 按年汇总
    var yearly = [];
    for (var y = 0; y < yrs; y++) {
      var slice = schedule.slice(y * MONTHS_PER_YEAR, (y + 1) * MONTHS_PER_YEAR);
      if (!slice.length) break;
      var row = { year: y + 1, payment: 0, principal: 0, interest: 0, balance: slice[slice.length - 1].balance };
      for (var j = 0; j < slice.length; j++) {
        row.payment += slice[j].payment;
        row.principal += slice[j].principal;
        row.interest += slice[j].interest;
      }
      yearly.push(row);
    }

    return {
      monthlyPayment: monthlyPayment,
      totalPayment: totalPayment,
      totalInterest: totalInterest,
      months: months,
      monthlyRate: monthlyRate,
      schedule: schedule,
      yearly: yearly
    };
  }

  /** 金额格式化:1234567.891 -> "¥1,234,567.89" */
  function formatCNY(n) {
    var v = Number(n) || 0;
    return '¥' + v.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /** 大额辅助显示:1932557.76 -> "193.26 万元" */
  function toWan(n) {
    var v = (Number(n) || 0) / 10000;
    return v.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' 万元';
  }

  /** 百分比格式化 */
  function toPercent(part, whole) {
    if (!whole) return '0%';
    return (part / whole * 100).toFixed(1) + '%';
  }

  /** 生成还款计划 CSV 文本 */
  function toCSV(result) {
    var lines = ['期数,月供(元),本金(元),利息(元),剩余本金(元)'];
    result.schedule.forEach(function (r) {
      lines.push([r.period, r.payment.toFixed(2), r.principal.toFixed(2), r.interest.toFixed(2), r.balance.toFixed(2)].join(','));
    });
    return lines.join('\r\n');
  }

  return {
    calcLoan: calcLoan,
    formatCNY: formatCNY,
    toWan: toWan,
    toPercent: toPercent,
    toCSV: toCSV,
    MONTHS_PER_YEAR: MONTHS_PER_YEAR
  };
});
