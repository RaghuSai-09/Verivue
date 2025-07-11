
import Agent from "@/components/Agent"
import { getCurrentUser } from "@/lib/actions/auth.action"

const page = async () => {
  const user = await getCurrentUser();

  return (
    <>
        <h3>Interview Generation</h3>
        <Agent userName={user?.name!} type="generate" userId={user?.id} />
    </>
  )
}

export default page