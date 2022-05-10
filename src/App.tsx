import { useCallback, useEffect, useState } from 'react'
import * as VMasker from 'vanilla-masker'
import './App.css'

interface IYield {
  month: number
  totalValue: number
  yieldValue: number
  totalYield: number
  totalValueWithYield: number
}

function returnNumberFromFormattedValue(value: string) {
  return Number(
    value.replaceAll('.','').replaceAll(',', '.')
  )
}

function App() {

  const [initialValue, setInitialValue] = useState('')
  const [monthlyValue, setMonthlyValue] = useState('')
  const [fees, setFees] = useState('')
  const [term, setTerm] = useState('')
  
  const [results, setResults] = useState<IYield[]>([])

  const recalculate = useCallback(() => {
    if (!initialValue || !monthlyValue || !fees || !term) return
    
    const numberedInitialValue = returnNumberFromFormattedValue(initialValue)
    const numberedMonthlyValue = returnNumberFromFormattedValue(monthlyValue)
    const monthlyFee = (returnNumberFromFormattedValue(fees) / 12) / 100
    const totalMonths = Number(term) * 12

    const months: IYield[] = []
    for (let index = 0; index <= totalMonths; index++) {
      if (index === 0) {
        months.push({
          month: index,
          totalValue: numberedInitialValue,
          yieldValue: 0,
          totalYield: 0,
          get totalValueWithYield() {
            return this.totalValue + this.totalYield
          }
        })
        continue
      }
      const lastMonth = months[index - 1]
      const monthYield = lastMonth.totalValueWithYield * monthlyFee
      const newMonth: IYield = {
        month: index,
        totalValue: lastMonth.totalValue + numberedMonthlyValue,
        yieldValue: monthYield,
        totalYield: monthYield + lastMonth.totalYield,
        get totalValueWithYield() {
          return this.totalValue + this.totalYield
        }
      }

      months.push(newMonth)
    }

    setResults(months.reverse())

  }, [initialValue, monthlyValue, fees, term])

  useEffect(() => {
    recalculate()
  }, [recalculate])

  useEffect(() => {
    console.log(results)
  }, [results])

  return (
    <div className="container">
      <div>
        <h1>Investments simulator</h1>
        
        <div className='flex-column'>
          <label htmlFor="initialValue">Initial Value</label>
          <input
            type="text"
            name="initialValue"
            id="initialValue"
            value={initialValue}
            onChange={(e) => setInitialValue(VMasker.toMoney(e.target.value))}
          />
        </div>
        <br />

        <div className='flex-column'>
          <label htmlFor="monthlyValue">Monthly contribution</label>
          <input
            type="text"
            name="monthlyValue"
            id="monthlyValue"
            value={monthlyValue}
            onChange={(e) => setMonthlyValue(VMasker.toMoney(e.target.value))}
          />
        </div>
        <br />

        <div className='flex-column'>
          <label htmlFor="fees">Anual fee</label>
          <input
            type="text"
            name="fees"
            id="fees"
            value={fees}
            onChange={(e) => setFees(VMasker.toMoney(e.target.value))}
          />
        </div>
        <br />

        <div className='flex-column'>
          <label htmlFor="term">Term (years)</label>
          <input
            type="number"
            name="term"
            id="term"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Total value</th>
            <th>Month yield</th>
            <th>Total yield</th>
            <th>Total value with yield</th>
          </tr>
        </thead>
        <tbody>
          {results.map(month => 
            <tr key={month.month}>
              <td>{month.month}</td>
              <td>{VMasker.toMoney(month.totalValue.toFixed(2))}</td>
              <td>{VMasker.toMoney(month.yieldValue.toFixed(2))}</td>
              <td>{VMasker.toMoney(month.totalYield.toFixed(2))}</td>
              <td>{VMasker.toMoney(month.totalValueWithYield.toFixed(2))}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App
