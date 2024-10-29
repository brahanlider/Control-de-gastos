import { useEffect, useState } from "react";
import DatePicker from 'react-date-picker';
import 'react-calendar/dist/Calendar.css';
import 'react-date-picker/dist/DatePicker.css';

import { DraftExpense, Value } from "../types";
import { categoriesdb } from "../data/categoriesdb";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";



export default function ExpenseForm() {

  const [expense, setExpense] = useState<DraftExpense>({
    amount: 0,
    expenseName: "",
    category: "",
    date: new Date()
  })

  const [error, setError] = useState("")
  const [previousAmount, setPreviousAmount] = useState(0)  // * state para que al editar el amount tome encuenta el MONTO DISponible
  const { dispatch, state, remainingBudget } = useBudget()

  //trae para editar el formulario
  useEffect(() => {
    if (state.editingId) {
      const editingExpense = state.expenses.filter((currentExpense) => currentExpense.id === state.editingId)[0]
      setExpense(editingExpense)
      setPreviousAmount(editingExpense.amount) // * previousAmount =>CONGELADA para al editar el amount se corrrija
    }
  }, [state.editingId]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target

    const isNumberField = ["amount"].includes(name)
    setExpense({
      ...expense,
      [name]: isNumberField ? Number(value) : value
    })
  }

  const handleChangeDate = (value: Value) => {
    setExpense({
      ...expense,
      date: value,
    });
  }

  // Handle Form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    //Validacion 
    if (Object.values(expense).includes("")) {
      setError("Todos los campos son obligatorios")
      return
    }

    //Validar que no me pase del limite gastos
    if ((expense.amount - previousAmount) > remainingBudget) {
      setError("Ese gasto se sale del presupuesto")
      return
    }

    // Agregar o actualizar el gasto
    if (state.editingId) {
      dispatch({ type: "update-expense", payload: { expense: { id: state.editingId, ...expense } } })
    } else {
      dispatch({ type: "add-expense", payload: { expense } })
    }


    // Reiniciar state
    setExpense({
      amount: 0,
      expenseName: "",
      category: "",
      date: new Date()
    })
    setPreviousAmount(0) // * set amount congelado

  }

  return (
    <form onSubmit={handleSubmit}
      className="space-y-5">
      <legend className="text-center text-3xl font-black  uppercase border-b-4 border-blue-600 py-2">
        {/* si editingId existe REALIZA */}
        {state.editingId ? "Guardar Cambios" : "Nuevo Gasto"}
      </legend>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="expenseName"
          className="text-xl "
        >Nombre Gasto: </label>
        <input
          type="text"
          id="expenseName"
          placeholder="Añade el Nombre del gasto"
          className="bg-slate-100 p-2 rounded-md"
          name="expenseName"
          value={expense.expenseName}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="amount"
          className="text-xl "
        >Cantidad: </label>
        <input
          type="number"
          id="amount"
          placeholder="Añade la cantidad del gasto ej. 300"
          className="bg-slate-100 p-2 rounded-md"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="category"
          className="text-xl "
        >Categoria: </label>
        <select
          id="category"
          name="category"
          className="bg-slate-100 p-2 rounded-md"
          value={expense.category}
          onChange={handleChange}
        >
          <option value="">--Seleccione</option>
          {categoriesdb.map(category => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="date"//calendario
          className="text-xl "
        >Fecha Gasto: </label>
        <DatePicker
          className="bg-slate-100 p-2 border-0"
          value={expense.date}
          onChange={handleChangeDate}
        />
      </div>

      <input
        type="submit"
        className="w-full bg-blue-600 p-2 rounded-lg uppercase font-bold text-white cursor-pointer"
        value={state.editingId ? "Guardar Cambios" : "Registrar Gasto"}  // si editingId existe REALIZA

      />

    </form>
  )
}
