/**
 * app.js —— 页面交互:读取表单 → 调用 LoanCalc → 渲染结果/占比图/还款计划
 */
(function () {
  'use strict';

  var DEFAULTS = { rate: 4.9, years: 20, amount: 500000 };
  var CIRCUMFERENCE = 2 * Math.PI * 54; // 与 SVG 中 r=54 对应

  var $ = function (id) { return document.getElementById(id); };

  var form = $('loan-form');
  var inputs = {
    rate: $('rate'), years: $('years'), amount: $('amount')
  };
  var ranges = {
    rate: $('rate-range'), years: $('years-range'), amount: $('amount-range')
  };
  var errorBox = $('error');
  var lastResult = null;
  var lastInputs = null;
  var mode = 'year'; // 'year' | 'month'

  /* ---------------- 输入联动 ---------------- */
  function syncFromNumber(key) {
    var v = Number(inputs[key].value);
    if (isFinite(v)) {
      var r = ranges[key];
      var min = Number(r.min), max = Number(r.max);
      r.value = Math.min(Math.max(v, min), max); // 超出滑块范围时仅钳制显示
    }
  }
  function syncFromRange(key) {
    inputs[key].value = ranges[key].value;
  }

  Object.keys(inputs).forEach(function (key) {
    inputs[key].addEventListener('input', function () { syncFromNumber(key); compute(); });
    ranges[key].addEventListener('input', function () { syncFromRange(key); compute(); });
  });

  // 快捷选项
  document.querySelectorAll('.chips').forEach(function (group) {
    var key = group.getAttribute('data-target');
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      inputs[key].value = btn.getAttribute('data-value');
      syncFromNumber(key);
      group.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-active'); });
      btn.classList.add('is-active');
      compute();
    });
  });

  form.addEventListener('submit', function (e) { e.preventDefault(); compute(); });

  $('reset').addEventListener('click', function () {
    Object.keys(DEFAULTS).forEach(function (key) {
      inputs[key].value = DEFAULTS[key];
      syncFromNumber(key);
    });
    document.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-active'); });
    compute();
  });

  /* ---------------- 计算与渲染 ---------------- */
  function compute() {
    var rate = parseFloat(inputs.rate.value);
    var years = parseFloat(inputs.years.value);
    var amount = parseFloat(inputs.amount.value);

    var result;
    try {
      result = LoanCalc.calcLoan(rate, years, amount);
    } catch (err) {
      showError(err.message);
      return;
    }
    showError('');
    lastResult = result;
    lastInputs = { rate: rate, years: years, amount: amount };
    render(result, lastInputs);
  }

  function showError(msg) {
    if (!msg) { errorBox.hidden = true; errorBox.textContent = ''; return; }
    errorBox.hidden = false;
    errorBox.textContent = msg;
  }

  function render(r, input) {
    // 主结果
    $('monthly').textContent = LoanCalc.formatCNY(r.monthlyPayment);
    $('monthly-sub').textContent = '等额本息 · 年利率 ' + input.rate + '% · ' + r.months + ' 期';
    $('total-payment').textContent = LoanCalc.formatCNY(r.totalPayment);
    $('total-payment-wan').textContent = '约 ' + LoanCalc.toWan(r.totalPayment);
    $('total-interest').textContent = LoanCalc.formatCNY(r.totalInterest);
    $('total-interest-wan').textContent = '约 ' + LoanCalc.toWan(r.totalInterest);
    $('principal').textContent = LoanCalc.formatCNY(input.amount);
    $('principal-wan').textContent = '约 ' + LoanCalc.toWan(input.amount);
    $('months').textContent = r.months + ' 期';
    $('interest-ratio').textContent = '利息占本金 ' + LoanCalc.toPercent(r.totalInterest, input.amount);

    // 占比环图
    var total = input.amount + r.totalInterest || 1;
    var pFrac = input.amount / total;
    var pArc = CIRCUMFERENCE * pFrac;
    var iArc = CIRCUMFERENCE * (1 - pFrac);
    var ep = $('donut-principal'), ei = $('donut-interest');
    ep.setAttribute('stroke-dasharray', pArc + ' ' + CIRCUMFERENCE);
    ei.setAttribute('stroke-dasharray', iArc + ' ' + CIRCUMFERENCE);
    ei.setAttribute('stroke-dashoffset', String(-pArc));
    $('legend-principal').textContent = LoanCalc.formatCNY(input.amount) + '（' + (pFrac * 100).toFixed(1) + '%）';
    $('legend-interest').textContent = LoanCalc.formatCNY(r.totalInterest) + '（' + ((1 - pFrac) * 100).toFixed(1) + '%）';

    renderTable(r);
  }

  function renderTable(r) {
    var thead = document.querySelector('#schedule-table thead');
    var tbody = document.querySelector('#schedule-table tbody');
    var note = $('schedule-note');
    var rows = [];

    if (mode === 'year') {
      thead.innerHTML = '<tr><th>年份</th><th>年还款额</th><th>年还本金</th><th>年还利息</th><th>年末剩余本金</th></tr>';
      r.yearly.forEach(function (y) {
        rows.push('<tr><td>第 ' + y.year + ' 年</td><td>' + LoanCalc.formatCNY(y.payment) + '</td><td>' +
          LoanCalc.formatCNY(y.principal) + '</td><td>' + LoanCalc.formatCNY(y.interest) + '</td><td>' +
          LoanCalc.formatCNY(y.balance) + '</td></tr>');
      });
      note.textContent = '共 ' + r.yearly.length + ' 个还款年度;每月还款额固定,利息逐年下降、本金逐年上升。';
    } else {
      thead.innerHTML = '<tr><th>期数</th><th>月供</th><th>本金</th><th>利息</th><th>剩余本金</th></tr>';
      r.schedule.forEach(function (m) {
        rows.push('<tr><td>第 ' + m.period + ' 期</td><td>' + LoanCalc.formatCNY(m.payment) + '</td><td>' +
          LoanCalc.formatCNY(m.principal) + '</td><td>' + LoanCalc.formatCNY(m.interest) + '</td><td>' +
          LoanCalc.formatCNY(m.balance) + '</td></tr>');
      });
      note.textContent = '共 ' + r.months + ' 期明细(可上下滚动查看),末期已做四舍五入对齐,总额精确等于本金 + 利息。';
    }
    tbody.innerHTML = rows.join('');
  }

  /* ---------------- 切换 / 导出 / 复制 ---------------- */
  $('tab-year').addEventListener('click', function () { switchTab('year'); });
  $('tab-month').addEventListener('click', function () { switchTab('month'); });

  function switchTab(m) {
    mode = m;
    $('tab-year').classList.toggle('is-active', m === 'year');
    $('tab-month').classList.toggle('is-active', m === 'month');
    $('tab-year').setAttribute('aria-selected', String(m === 'year'));
    $('tab-month').setAttribute('aria-selected', String(m === 'month'));
    if (lastResult) renderTable(lastResult);
  }

  $('download').addEventListener('click', function () {
    if (!lastResult) return;
    var text = LoanCalc.toCSV(lastResult);
    var blob = new Blob(['\ufeff' + text], { type: 'text/csv;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = '还款计划_' + lastInputs.amount + '元_' + lastInputs.years + '年_' + lastInputs.rate + '%.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  $('copy').addEventListener('click', function () {
    if (!lastResult) return;
    var r = lastResult, i = lastInputs;
    var text = [
      '【等额本息贷款计算结果】',
      '贷款金额:' + LoanCalc.formatCNY(i.amount),
      '年利率:' + i.rate + '%    贷款年限:' + i.years + ' 年(' + r.months + ' 期)',
      '每月月供:' + LoanCalc.formatCNY(r.monthlyPayment),
      '总还款额:' + LoanCalc.formatCNY(r.totalPayment) + '(' + LoanCalc.toWan(r.totalPayment) + ')',
      '总利息:' + LoanCalc.formatCNY(r.totalInterest) + '(' + LoanCalc.toWan(r.totalInterest) + ')',
      '利息占本金:' + LoanCalc.toPercent(r.totalInterest, i.amount)
    ].join('\n');
    var btn = this;
    var done = function () { btn.textContent = '已复制 ✓'; setTimeout(function () { btn.textContent = '复制结果'; }, 1600); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  });

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { window.alert(text); }
    document.body.removeChild(ta);
  }

  /* ---------------- 初始化 ---------------- */
  Object.keys(DEFAULTS).forEach(function (key) { syncFromNumber(key); });
  compute();
})();
