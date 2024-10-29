import { useEffect, useMemo } from "react"
import BudgetForm from "./components/BudgetForm"
import { useBudget } from "./hooks/useBudget"
import BudgetTracker from "./components/BudgetTracker"
import ExpenseModal from "./components/ExpenseModal"
import ExpenseList from "./components/ExpenseList"
import FilterByCategory from "./components/FilterByCategory"

function App() {

  const { state } = useBudget()
  console.log(state)

  // * :---INFO: Efecto secundario para guardar el presupuesto y los gastos en localStorage
  useEffect(() => {
    localStorage.setItem("budget", state.budget.toString())
    localStorage.setItem("expenses", JSON.stringify(state.expenses))
  }, [state])

  const isValidBudget = useMemo(() => state.budget > 0, [state.budget]); // * :---INFO: Verifica si el presupuesto es válido (mayor que 0)

  return (
    <>
      <header className="bg-blue-600 py-8 max-h-72">
        <h1 className="text-white font-black text-4xl uppercase text-center">Planificador de Gastos</h1>
      </header>

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
        {isValidBudget ? <BudgetTracker /> : <BudgetForm />}
      </div>

      {isValidBudget && (
        <main className="max-w-3xl mx-auto py-10">
          <FilterByCategory />
          <ExpenseList />
          <ExpenseModal />

        </main>
      )}
    </>
  )
}

export default App
