export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col">
      <div>{children}</div>
    </div>
  )
}
