import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_sidebar-layout/projects')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects"!</div>
}
