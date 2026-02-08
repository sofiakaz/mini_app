import type { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export function PhonePreview({ children }: Props) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-200">
      {/* КОРПУС ТЕЛЕФОНА */}
      <div
        className="
          relative
          w-[375px]
          h-[812px]
          bg-black
          rounded-[48px]
          shadow-2xl
          flex
          items-center
          justify-center
        "
      >
        {/* ЭКРАН */}
        <div
          className="
            relative
            w-[360px]
            h-[780px]
            bg-white
            rounded-[40px]
            overflow-hidden
          "
        >
          {children}
        </div>
      </div>
    </div>
  )
}
