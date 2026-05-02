import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_sidebar-layout/timeline')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_sidebar-layout/timeline"!</div>
}
