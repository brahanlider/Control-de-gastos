import { useReducer, createContext, Dispatch, ReactNode, useMemo } from "react"; // * :---INFO: Importa hooks y tipos necesarios de React
import { BudgetActions, budgetReducer, BudgetState, initialState } from "../reducers/budget-reducer"; // * :---INFO: Importa tipos y funciones del reductor de presupuesto

// * :---INFO: Define las propiedades del contexto de presupuesto
type BudgetContextProps = {
  state: BudgetState;
  dispatch: Dispatch<BudgetActions>;
  totalExpenses: number;
  remainingBudget: number;
}

// *Define las propiedades del proveedor de presupuesto
type BudgetProviderProps = {
  children: ReactNode;
}

// *Crea el contexto de presupuesto con un valor inicial vacío
export const BudgetContext = createContext<BudgetContextProps>({} as BudgetContextProps); // ! Inicializa el contexto para ser utilizado en la aplicación

// *Proveedor de presupuesto que encapsula el estado y la lógica del presupuesto
export const BudgetProvider = ({ children }: BudgetProviderProps) => {

  // *Usa el reductor para manejar el estado del presupuesto
  const [state, dispatch] = useReducer(budgetReducer, initialState); // *Inicializa el estado y la función dispatch con el reductor y el estado inicial

  //  Calcula el total de gastos acumulados
  const totalExpenses = useMemo(() =>
    state.expenses.reduce((total, expense) => expense.amount + total, 0), [state.expenses] // * :---INFO: Suma todos los gastos en el estado
  );

  const remainingBudget = state.budget - totalExpenses; // INFO: Calcula el presupuesto restante

  return (
    <BudgetContext.Provider
      value={{
        state,
        dispatch,
        totalExpenses,
        remainingBudget,
      }}>
      {children}
    </BudgetContext.Provider>
  )
}
