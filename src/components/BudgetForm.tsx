import { useMemo, useState } from "react";
import { useBudget } from "../hooks/useBudget";

export default function BudgetForm() {

  const [budget, setbudget] = useState(0);

  const { dispatch } = useBudget()


  // * :---INFO: Maneja el cambio en el input del presupuesto
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setbudget(e.target.valueAsNumber); // :---INFO: Actualiza el estado del presupuesto con el valor numérico del input
  }

  // * :---INFO: Verifica si el presupuesto definido es válido
  const isValidBudget = useMemo(() => {
    return isNaN(budget) || budget <= 0; // :---INFO: Retorna verdadero si el presupuesto es NaN o menor o igual a 0
  }, [budget])

  // * :---INFO: Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    dispatch({ type: "add-budget", payload: { budget } }) //:---INFO: Envía la acción para agregar el presupuesto al estado global
  }


  return (
    <form className="space-y-5"
      onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-5">
        <label htmlFor="budget" className="text-4xl text-blue-600 font-bold text-center">Definir Presupuesto</label>
        <input
          id="budget"
          type="number"
          className="w-full bg-white border border-gray-200 p-2"
          placeholder="Define tu presupuesto"
          name="budget"
          onChange={handleChange}

        />
      </div>

      <input type="submit"
        value="Definir Presupuesto"
        className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white w-full p-2 font-black uppercase
        disabled:opacity-20"
        disabled={isValidBudget}
      />

    </form>
  )
}
