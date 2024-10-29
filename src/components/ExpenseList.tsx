import { useMemo } from "react"
import { useBudget } from "../hooks/useBudget"
import ExpenseDetail from "./ExpenseDetail"

export default function ExpenseList() {

  const { state } = useBudget()

  // * :---INFO: Filtra los gastos según la categoría actual.
  const filteredExpenses = state.currentCategory ? state.expenses.filter(expense =>
    expense.category === state.currentCategory //  :---INFO: Filtra los gastos que coinciden con la categoría actual
  ) : state.expenses; //  :---INFO: Si no hay categoría seleccionada, devuelve todos los gastos


  // *  Verifica si la lista de gastos filtrados está vacía.
  const isEmpty = useMemo(() => filteredExpenses.length === 0, [state.expenses])

  return (
    <div className="mt-10 bg-white shadow-lg rounded-lg p-10">
      {isEmpty ? <p className="text-gray-600 text-2xl font-bold">No hay Gastos</p>
        :
        <>
          <p className="text-gray-600 text-2xl font-bold my-5">
            Listado de Gastos
          </p>

          {filteredExpenses.map(expense =>
            <ExpenseDetail
              key={expense.id}
              expense={expense}
            />
          )}
        </>}

    </div>
  )
}
