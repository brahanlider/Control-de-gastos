import { Category, DraftExpense, Expense } from "../types";
import { v4 as uuidv4 } from "uuid";

export type BudgetActions =
  | { type: "add-budget"; payload: { budget: number } }
  | { type: "show-modal" }
  | { type: "close-modal" }
  | { type: "add-expense"; payload: { expense: DraftExpense } }
  | { type: "remove-expense"; payload: { id: Expense["id"] } } // * Eliminar gasto con swipeable
  | { type: "get-expense-by-id"; payload: { id: Expense["id"] } } // * Obtener gasto por ID con swipeable
  | { type: "update-expense"; payload: { expense: Expense } } // * Actualizar gasto existente / para que no se cree otro expense
  | { type: "reset-app" }
  | { type: "add-filter-category"; payload: { id: Category["id"] } }; // * Filtrar opciones de categorías

export type BudgetState = {
  budget: number;
  modal: boolean;
  expenses: Expense[];
  editingId: Expense["id"]; //editar id => para actualizar   //swipeable get
  currentCategory: Category["id"]; // Categoría actual para filtrar
};

// * :---INFO: Obtener el presupuesto del localStorage
const localStorageBudget = (): number => {
  const budget = localStorage.getItem("budget");
  return budget ? +budget : 0;
};

// * :---INFO: Obtener los gastos del localStorage
const localStorageExpenses = (): Expense[] => {
  const expenses = localStorage.getItem("expenses");
  return expenses ? JSON.parse(expenses) : [];
};

// * :---INFO: Estado inicial del presupuesto
export const initialState: BudgetState = {
  budget: localStorageBudget(),
  modal: false,
  expenses: localStorageExpenses(),
  editingId: "",
  currentCategory: "",
};

// * :---INFO: Generar un ID único para el gasto
const createExpense = (draftExpense: DraftExpense): Expense => {
  return {
    ...draftExpense,
    id: uuidv4(),
  };
};

// * :---INFO: Reducer para manejar el estado del presupuesto
export const budgetReducer = (
  state: BudgetState = initialState,
  action: BudgetActions
) => {
  //logica

  // * :---INFO: Agregar un presupuesto
  if (action.type === "add-budget") {
    return {
      ...state,
      budget: action.payload.budget,
    };
  }

  // * :---INFO: Mostrar el modal
  if (action.type === "show-modal") {
    return {
      ...state,
      modal: true,
    };
  }

  // * :---INFO: Cerrar el modal
  if (action.type === "close-modal") {
    return {
      ...state,
      modal: false,
      editingId: "", // * para que al editar NO se reescriba al AGREGAR NUEVO expense
    };
  }

  // * :---INFO: Agregar un nuevo gasto
  if (action.type === "add-expense") {
    const expense = createExpense(action.payload.expense); // * :---INFO: Crea un nuevo gasto con un ID único

    return {
      ...state,
      expenses: [...state.expenses, expense], // * :---INFO: Agrega el nuevo gasto a la lista de gastos
      modal: false, // * :---INFO: Cierra el modal después de agregar el gasto
    };
  }

  // * :---INFO: Eliminar un gasto existente
  if (action.type === "remove-expense") {
    return {
      ...state,
      expenses: state.expenses.filter(
        (expense) => expense.id !== action.payload.id // * :---INFO: Filtra los gastos para eliminar el que coincide con el ID proporcionado
      ),
    };
  }

  // * :---INFO: Obtener un gasto por ID para editarlo
  if (action.type === "get-expense-by-id") {
    return {
      ...state,
      editingId: action.payload.id, // * :---INFO: Establece el ID de edición al ID del gasto seleccionado
      modal: true, // * :---INFO: Abre el modal para editar el gasto
    };
  }

  // Al editar no se creara otro expense
  // * :---INFO: Actualizar un gasto existent
  if (action.type === "update-expense") {
    return {
      ...state,
      expenses: state.expenses.map((expense) =>
        expense.id === action.payload.expense.id
          ? action.payload.expense // * :---INFO: Reemplaza el gasto existente por el actualizado
          : expense
      ),
      modal: false, // * :---INFO: Cierra el modal después de actualizar el gasto
      editingId: "", // * :---INFO: Reinicia el ID de edición
    };
  }

  // * :---INFO: Restablecer la aplicación al estado inicial
  if (action.type === "reset-app") {
    return {
      ...state,
      budget: 0, // * :---INFO: Reinicia el presupuesto a 0
      expenses: [], // * :---INFO: Elimina todos los gastos
    };
  }

  // * :---INFO: Agregar un filtro de categoría
  if (action.type === "add-filter-category") {
    return {
      ...state,
      currentCategory: action.payload.id, // * :---INFO: Establece la categoría actual para filtrar
    };
  }

  return state; // ! Retorna el estado actual si no hay acciones que manejar
};
