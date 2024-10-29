import { PropsWithChildren } from "react"


export default function ErrorMessage({ children }: PropsWithChildren) {
  return (
    <p className="bg-red-600 text-center text-white text-sm p-2 font-bold">
      {children}
    </p>
  )
}
