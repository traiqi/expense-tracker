const CATEGORY_COLORS = {
  Food: '#ef4444', Transport: '#3b82f6', Housing: '#f59e0b',
  Entertainment: '#14b8a6', Healthcare: '#8b5cf6',
  Shopping: '#f97316', Education: '#22c55e', Others: '#94a3b8',
};

export default function Analytics({ expenses }) {
  if (expenses.length === 0) {
    return (
      <div>
        <h2 className="page-title">Analytics</h2>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>No expenses yet. Add some to see your analytics.</p>
        </div>
      </div>
    );
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group spending by category
  const byCategory = {};
  for (const e of expenses) {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  }
  const categoryList = Object.entries(byCategory)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Group spending by month (e.g. "2024-03")
  const byMonth = {};
  for (const e of expenses) {
    const month = e.date.substring(0, 7);
    byMonth[month] = (byMonth[month] || 0) + e.amount;
  }
  const monthList = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ month, amount }));

  return (
    <div className="analytics">
      <div className="page-header">
        <div>
          <h2 className="page-title">Analytics</h2>
          <p className="page-subtitle">Insights into your spending habits</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <p className="summary-label">Total Expenses</p>
          <p className="summary-value">{expenses.length}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">Total Spent</p>
          <p className="summary-value">${total.toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">Average per Expense</p>
          <p className="summary-value">${(total / expenses.length).toFixed(2)}</p>
        </div>
        <div className="summary-card">
          <p className="summary-label">Top Category</p>
          <p className="summary-value">{categoryList[0]?.name || '—'}</p>
        </div>
      </div>

      {/* Spending by category */}
      <div className="chart-card" style={{ marginBottom: '16px' }}>
        <h3>Spending by Category</h3>
        <table className="category-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>% of Total</th>
              <th>Proportion</th>
            </tr>
          </thead>
          <tbody>
            {categoryList.map(item => (
              <tr key={item.name}>
                <td>
                  <span
                    className="cat-dot"
                    style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#94a3b8' }}
                  />
                  {item.name}
                </td>
                <td className="cell-amount">${item.amount.toFixed(2)}</td>
                <td>{((item.amount / total) * 100).toFixed(1)}%</td>
                <td>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${(item.amount / total) * 100}%`,
                        backgroundColor: CATEGORY_COLORS[item.name] || '#94a3b8',
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Monthly totals */}
      <div className="chart-card">
        <h3>Monthly Totals</h3>
        <table className="category-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Total Spent</th>
            </tr>
          </thead>
          <tbody>
            {monthList.map(item => (
              <tr key={item.month}>
                <td>{item.month}</td>
                <td className="cell-amount">${item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
